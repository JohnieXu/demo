import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from '@lynx-js/react'
import { useThrottle } from '../utils'
import type { CSSProperties } from '@lynx-js/types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarMonth } from './CalendarMonth';
import { CALENDAR_TEXTS } from './constants';
import type { CalendarDayItem, CalendarProps, CalendarRef } from './types';
import {
  calcDateNum,
  cloneDate,
  cloneDates,
  compareDay,
  compareMonth,
  formatMonthTitle,
  getDayByOffset,
  getDayRowOffset,
  getEstimatedMonthHeight,
  getMonthByOffset,
  getNextDay,
  getPrevDay,
  getToday,
  joinClass,
  parseSize,
} from './utils';

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

// Minimum interval (ms) between processed scroll positions. scroll fires on
// every frame; useThrottle caps how often the heavy month computation runs.
const SCROLL_THROTTLE_MS = 200;

// Monotonic counter giving each Calendar instance a stable, unique scroll-view
// id for imperative scrollTo (Lynx <scroll-view> has no reactive scroll-top).
let calendarInstanceSeq = 0;

export const Calendar = forwardRef<CalendarRef, CalendarProps>(
  function Calendar(props, ref) {
    const {
      show,
      type = 'single',
      switchMode = 'none',
      title,
      color,
      round = true,
      poppable = true,
      maxRange,
      showMark = true,
      showTitle = true,
      formatter,
      rowHeight = 64,
      confirmText = CALENDAR_TEXTS.confirm,
      lazyRender = true,
      showConfirm = true,
      defaultDate,
      allowSameDay,
      showSubtitle = true,
      confirmDisabledText,
      safeAreaInsetBottom = true,
      minDate: minDateProp,
      maxDate: maxDateProp,
      firstDayOfWeek = 0,
      readonly,
      showRangePrompt = true,
      style,
      className,
      renderTitle,
      renderSubtitle,
      renderMonthTitle,
      renderTopInfo,
      renderBottomInfo,
      renderDayText,
      renderFooter,
      renderConfirm,
      renderPrevMonth,
      renderNextMonth,
      renderPrevYear,
      renderNextYear,
      onSelect,
      onConfirm,
      onUnselect,
      onMonthShow,
      onPanelChange,
      onOverRange,
      onShowChange,
      onClickDisabledDate,
      onClickOverlay,
    } = props;

    const safeFirstDayOfWeek = firstDayOfWeek % 7;
    const canSwitch = switchMode !== 'none';

    const minDate = useMemo(() => {
      return minDateProp ?? (canSwitch ? undefined : getToday());
    }, [minDateProp, canSwitch]);

    const maxDate = useMemo(() => {
      return (
        maxDateProp ?? (canSwitch ? undefined : getMonthByOffset(getToday(), 6))
      );
    }, [maxDateProp, canSwitch]);

    const limitDateRange = useCallback(
      (date: Date, min = minDate, max = maxDate) => {
        if (min && compareDay(date, min) < 0) return min;
        if (max && compareDay(date, max) > 0) return max;
        return date;
      },
      [minDate, maxDate],
    );

    const getInitialDate = useCallback(
      (initialDefaultDate = defaultDate): Date | Date[] | null => {
        if (initialDefaultDate === null) return null;

        const now = getToday();

        if (type === 'range') {
          let dates = Array.isArray(initialDefaultDate)
            ? initialDefaultDate
            : [];
          if (dates.length === 1 && compareDay(dates[0], now) === 1) {
            dates = [];
          }

          const start = limitDateRange(
            dates[0] || now,
            minDate,
            maxDate
              ? allowSameDay
                ? maxDate
                : getPrevDay(maxDate)
              : undefined,
          );
          const end = limitDateRange(
            dates[1] || (allowSameDay ? now : getNextDay(now)),
            minDate
              ? allowSameDay
                ? minDate
                : getNextDay(minDate)
              : undefined,
            maxDate,
          );
          return [start, end];
        }

        if (type === 'multiple') {
          if (Array.isArray(initialDefaultDate)) {
            return initialDefaultDate.map((date) => limitDateRange(date));
          }
          return [limitDateRange(now)];
        }

        let singleDate = initialDefaultDate;
        if (!singleDate || Array.isArray(singleDate)) {
          singleDate = now;
        }
        return limitDateRange(singleDate as Date);
      },
      [type, minDate, maxDate, allowSameDay, limitDateRange, defaultDate],
    );

    const [currentDate, setCurrentDate] = useState<Date | Date[] | null>(() =>
      getInitialDate(),
    );
    const [currentPanelDate, setCurrentPanelDate] = useState<Date>(() => {
      const date = Array.isArray(currentDate) ? currentDate[0] : currentDate;
      return date ? cloneDate(date) : limitDateRange(getToday());
    });
    const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 0]);
    const [scrollTop, setScrollTop] = useState(0);
    // Unique id so imperative scrollTo targets THIS calendar's scroll-view even
    // with multiple calendars mounted. Lynx <scroll-view> has no reactive
    // scroll-top; scrolling must go through createSelectorQuery().invoke().
    const scrollIdRef = useRef<string>('');
    if (!scrollIdRef.current) {
      scrollIdRef.current = `lu-calendar-body-${calendarInstanceSeq++}`;
    }
    const scrollId = scrollIdRef.current;
    const currentDateRef = useLatest(currentDate);
    const disabledDaysMapRef = useRef<Map<number, CalendarDayItem[]>>(
      new Map(),
    );
    // Dedupe high-frequency scroll work: remember the last active month so we
    // only push state updates when the visible month actually changes.
    const lastActiveMonthRef = useRef(-1);

    const months = useMemo(() => {
      const result: Date[] = [];
      if (!minDate || !maxDate) return result;

      const cursor = new Date(minDate);
      cursor.setDate(1);

      do {
        result.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      } while (compareMonth(cursor, maxDate) <= 0);

      return result;
    }, [minDate, maxDate]);

    const monthHeights = useMemo(
      () =>
        months.map((month) =>
          getEstimatedMonthHeight(month, rowHeight, safeFirstDayOfWeek),
        ),
      [months, rowHeight, safeFirstDayOfWeek],
    );

    const monthOffsets = useMemo(() => {
      const offsets: number[] = [];
      let acc = 0;
      for (let i = 0; i < months.length; i++) {
        offsets.push(acc);
        acc += monthHeights[i];
      }
      return offsets;
    }, [months, monthHeights]);

    const buttonDisabled = useMemo(() => {
      if (!currentDate) return true;
      if (type === 'range') {
        const [start, end] = currentDate as [Date, Date];
        return !start || !end;
      }
      if (type === 'multiple') {
        return !(currentDate as Date[]).length;
      }
      return false;
    }, [currentDate, type]);

    const getSelectedDate = useCallback(
      () => currentDateRef.current,
      [currentDateRef],
    );

    const handleDisabledDaysChange = useCallback(
      (monthIndex: number, days: CalendarDayItem[]) => {
        disabledDaysMapRef.current.set(monthIndex, days);
      },
      [],
    );

    const getAllDisabledDays = useCallback(() => {
      return Array.from(disabledDaysMapRef.current.values()).flat();
    }, []);

    const checkRange = useCallback(
      (date: [Date, Date]): boolean => {
        if (maxRange && calcDateNum(date) > +maxRange) {
          if (showRangePrompt) {
            onOverRange?.();
          }
          return false;
        }
        return true;
      },
      [maxRange, showRangePrompt, onOverRange],
    );

    const select = useCallback(
      (date: Date | Date[], complete = false) => {
        // Track the final value locally so onConfirm receives the just-selected
        // date. React's setCurrentDate is async, so currentDateRef.current is
        // stale within this callback (Vant reads the synchronous ref value).
        let finalDate = cloneDates(date);

        if (complete && type === 'range') {
          const valid = checkRange(finalDate as [Date, Date]);
          if (!valid) {
            // Range exceeds maxRange: auto-truncate, emit select once, and do
            // NOT confirm (mirrors Vant Calendar.tsx:408-418 early return).
            if (maxRange) {
              const start = (finalDate as [Date, Date])[0];
              finalDate = [start, getDayByOffset(start, +maxRange - 1)];
            }
            setCurrentDate(finalDate);
            onSelect?.(finalDate);
            return;
          }
        }

        setCurrentDate(finalDate);
        onSelect?.(finalDate);

        if (complete && !showConfirm) {
          onConfirm?.(finalDate);
        }
      },
      [type, maxRange, showConfirm, onSelect, onConfirm, checkRange],
    );

    const getDisabledDate = useCallback(
      (startDay: Date, date: Date): Date | undefined => {
        return getAllDisabledDays().find(
          (day) =>
            compareDay(startDay, day.date!) === -1 &&
            compareDay(day.date!, date) === -1,
        )?.date;
      },
      [getAllDisabledDays],
    );

    const onClickDay = useCallback(
      (item: CalendarDayItem) => {
        if (readonly || !item.date) return;

        const { date } = item;

        if (type === 'range') {
          if (
            !currentDateRef.current ||
            !Array.isArray(currentDateRef.current)
          ) {
            select([date]);
            return;
          }
          const [startDay, endDay] = currentDateRef.current as [Date, Date];

          if (startDay && !endDay) {
            const compareToStart = compareDay(date, startDay);
            if (compareToStart === 1) {
              const disabledDay = getDisabledDate(startDay, date);
              if (disabledDay) {
                const newEnd = getPrevDay(disabledDay);
                if (compareDay(startDay, newEnd) === -1) {
                  // Vant Calendar.tsx:477 — truncated range is incomplete,
                  // so it must not confirm (no complete flag).
                  select([startDay, newEnd]);
                } else {
                  select([date]);
                }
              } else {
                select([startDay, date], true);
              }
            } else if (compareToStart === -1) {
              select([date]);
            } else if (allowSameDay) {
              select([date, date], true);
            }
          } else {
            select([date]);
          }
        } else if (type === 'multiple') {
          if (
            !currentDateRef.current ||
            !Array.isArray(currentDateRef.current)
          ) {
            select([date]);
            return;
          }
          const dates = [...currentDateRef.current];
          const selectedIndex = dates.findIndex(
            (d) => compareDay(d, date) === 0,
          );

          if (selectedIndex !== -1) {
            const [removed] = dates.splice(selectedIndex, 1);
            setCurrentDate(dates);
            onUnselect?.(cloneDate(removed));
          } else if (maxRange && dates.length >= +maxRange) {
            if (showRangePrompt) {
              onOverRange?.();
            }
          } else {
            select([...dates, date]);
          }
        } else {
          select(date, true);
        }
      },
      [
        type,
        readonly,
        allowSameDay,
        maxRange,
        showRangePrompt,
        select,
        getDisabledDate,
        onUnselect,
        onOverRange,
        currentDateRef,
      ],
    );

    const scrollToDateInternal = useCallback(
      (targetDate: Date) => {
        // In month/year-month mode there is a single paged month — just switch
        // the panel date (mirrors Vant scrollToDate() under canSwitch).
        if (canSwitch) {
          setCurrentPanelDate(cloneDate(targetDate));
          return;
        }

        const monthIndex = months.findIndex(
          (m) => compareMonth(m, targetDate) === 0,
        );
        if (monthIndex === -1) return;

        const monthOffset = monthOffsets[monthIndex];
        const dayOffset = getDayRowOffset(
          targetDate,
          months[monthIndex],
          rowHeight,
          safeFirstDayOfWeek,
        );
        const offset = monthOffset + dayOffset;
        setScrollTop(offset);

        // Lynx <scroll-view> has no reactive scroll-top prop; drive the scroll
        // imperatively via SelectorQuery (same idiom as
        // src/apps/flight/components/Segments.tsx). Optional-chained so non-Lynx
        // environments (e.g. unit tests) no-op instead of throwing.
        lynx
          ?.createSelectorQuery()
          .select(`#${scrollId}`)
          .invoke({
            method: 'scrollTo',
            params: { index: 0, offset, smooth: false },
            fail: (err) => console.warn('[Calendar] scrollTo failed', err),
          })
          .exec();
      },
      [canSwitch, months, monthOffsets, rowHeight, safeFirstDayOfWeek, scrollId],
    );

    const reset = useCallback(
      (date = getInitialDate()) => {
        setCurrentDate(date);
        const target = Array.isArray(date) ? date[0] : date;
        if (target) {
          setCurrentPanelDate(cloneDate(target));
          scrollToDateInternal(target);
        }
      },
      [getInitialDate, scrollToDateInternal],
    );

    const handleConfirm = useCallback(() => {
      onConfirm?.(currentDateRef.current ?? []);
    }, [onConfirm, currentDateRef]);

    const scrollToDate = useCallback(
      (targetDate: Date) => {
        scrollToDateInternal(targetDate);
      },
      [scrollToDateInternal],
    );

    useImperativeHandle(ref, () => ({
      reset,
      scrollToDate,
      getSelectedDate,
    }));

    useEffect(() => {
      if (!poppable || show) {
        const target = currentDate
          ? Array.isArray(currentDate)
            ? currentDate[0]
            : currentDate
          : undefined;
        if (target) {
          scrollToDateInternal(target);
        }
      }
    }, [poppable, show, currentDate, scrollToDateInternal]);

    useEffect(() => {
      const initial = getInitialDate();
      setCurrentDate(initial);
      const target = Array.isArray(initial) ? initial[0] : initial;
      if (target) {
        setCurrentPanelDate(cloneDate(target));
      }
    }, [type, minDate, maxDate, switchMode, getInitialDate]);

    // scroll fires on every frame; just record the latest offset (a single
    // number) and let useThrottle gate the expensive month computation below.
    const handleScroll = useCallback(
      (e: { detail?: { scrollTop?: number } }) => {
        setScrollTop(e.detail?.scrollTop ?? 0);
      },
      [],
    );

    const throttledScrollTop = useThrottle(scrollTop, SCROLL_THROTTLE_MS);

    useEffect(() => {
      const top = throttledScrollTop;
      const buffer = monthHeights[0] ?? parseSize(rowHeight) * 6;

      let start = -1;
      let end = -1;
      for (let i = 0; i < months.length; i++) {
        const monthTop = monthOffsets[i];
        const monthBottom = monthTop + monthHeights[i];
        if (monthTop < top + buffer && monthBottom > top - buffer) {
          if (start === -1) start = i;
          end = i;
        }
      }

      if (start === -1) return;

      const newStart = Math.max(0, start - 1);
      const newEnd = Math.min(months.length - 1, end + 1);
      setVisibleRange((prev) =>
        prev[0] !== newStart || prev[1] !== newEnd ? [newStart, newEnd] : prev,
      );

      // Only update the panel/subtitle and notify when the active month actually
      // changes — otherwise we re-render the whole calendar needlessly.
      if (start === lastActiveMonthRef.current) return;
      lastActiveMonthRef.current = start;

      const currentMonth = months[start];
      if (currentMonth) {
        setCurrentPanelDate(cloneDate(currentMonth));
        onMonthShow?.({
          date: currentMonth,
          title: formatMonthTitle(currentMonth),
        });
      }
    }, [
      throttledScrollTop,
      months,
      monthHeights,
      monthOffsets,
      rowHeight,
      onMonthShow,
    ]);

    const handleOverlayTap = useCallback(() => {
      onClickOverlay?.();
      onShowChange?.(false);
    }, [onClickOverlay, onShowChange]);

    // Swallow taps that originate inside the panel so they don't bubble up to
    // the overlay's bindtap and dismiss the popup before the user confirms.
    const handleContentTap = useCallback(() => {
      // no-op: presence of catchtap stops tap propagation to the overlay.
    }, []);

    const renderFooterButton = () => {
      if (renderFooter) {
        return renderFooter();
      }
      if (!showConfirm) return null;

      const disabled = buttonDisabled;
      const text = disabled ? confirmDisabledText : confirmText;

      if (renderConfirm) {
        return renderConfirm({ disabled, onConfirm: handleConfirm });
      }

      return (
        <view
          className={joinClass(
            'lu-calendar__confirm',
            disabled && 'lu-calendar__confirm--disabled ui-disabled',
          )}
          style={
            color
              ? ({ '--lu-color-primary': color } as CSSProperties)
              : undefined
          }
          bindtap={disabled ? undefined : handleConfirm}
        >
          <text className="lu-calendar__confirm-text">{text}</text>
        </view>
      );
    };

    // Memoize the month grid so that high-frequency scroll re-renders (which only
    // change `scrollTop`) reuse the same element tree instead of re-diffing every
    // day node. It rebuilds only when something it actually depends on changes.
    const monthsContent = useMemo(
      () =>
        months.map((monthDate, index) => (
          <CalendarMonth
            key={monthDate.getTime()}
            date={monthDate}
            type={type}
            color={color}
            minDate={minDate}
            maxDate={maxDate}
            showMark={showMark}
            rowHeight={rowHeight}
            formatter={formatter}
            lazyRender={lazyRender}
            visible={
              !lazyRender ||
              (index >= visibleRange[0] && index <= visibleRange[1])
            }
            currentDate={currentDate}
            allowSameDay={allowSameDay}
            showMonthTitle={index !== 0 || !showSubtitle}
            firstDayOfWeek={safeFirstDayOfWeek}
            onClick={onClickDay}
            onClickDisabledDate={onClickDisabledDate}
            onDisabledDaysChange={(days) =>
              handleDisabledDaysChange(index, days)
            }
            renderMonthTitle={renderMonthTitle}
            renderTopInfo={renderTopInfo}
            renderBottomInfo={renderBottomInfo}
            renderDayText={renderDayText}
          />
        )),
      [
        months,
        type,
        color,
        minDate,
        maxDate,
        showMark,
        rowHeight,
        formatter,
        lazyRender,
        visibleRange,
        currentDate,
        allowSameDay,
        showSubtitle,
        safeFirstDayOfWeek,
        onClickDay,
        onClickDisabledDate,
        handleDisabledDaysChange,
        renderMonthTitle,
        renderTopInfo,
        renderBottomInfo,
        renderDayText,
      ],
    );

    const renderCalendarPanel = () => {
      const subtitleDate = currentPanelDate;
      const subtitle = formatMonthTitle(subtitleDate);

      return (
        <view
          className={joinClass('lu-calendar', className)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            ...(style ?? {}),
          }}
        >
          <CalendarHeader
            date={subtitleDate}
            minDate={minDate}
            maxDate={maxDate}
            title={title}
            subtitle={subtitle}
            showTitle={showTitle}
            showSubtitle={showSubtitle}
            switchMode={switchMode}
            firstDayOfWeek={safeFirstDayOfWeek}
            renderTitle={renderTitle}
            renderSubtitle={renderSubtitle}
            renderPrevMonth={renderPrevMonth}
            renderNextMonth={renderNextMonth}
            renderPrevYear={renderPrevYear}
            renderNextYear={renderNextYear}
            onPanelChange={(date) => {
              setCurrentPanelDate(cloneDate(date));
              onPanelChange?.({ date });
            }}
          />
          {canSwitch ? (
            <scroll-view
              className="lu-calendar__body"
              style={{ flex: 1, minHeight: '400px' }}
              scroll-orientation="vertical"
              scroll-y
            >
              <CalendarMonth
                date={currentPanelDate}
                type={type}
                color={color}
                minDate={minDate}
                maxDate={maxDate}
                showMark={showMark}
                rowHeight={rowHeight}
                formatter={formatter}
                lazyRender={false}
                visible
                currentDate={currentDate}
                allowSameDay={allowSameDay}
                showMonthTitle={!showSubtitle}
                firstDayOfWeek={safeFirstDayOfWeek}
                onClick={onClickDay}
                onClickDisabledDate={onClickDisabledDate}
                onDisabledDaysChange={(days) =>
                  handleDisabledDaysChange(0, days)
                }
                renderMonthTitle={renderMonthTitle}
                renderTopInfo={renderTopInfo}
                renderBottomInfo={renderBottomInfo}
                renderDayText={renderDayText}
              />
            </scroll-view>
          ) : (
            <scroll-view
              id={scrollId}
              className="lu-calendar__body"
              style={{ flex: 1, minHeight: '400px' }}
              scroll-orientation="vertical"
              scroll-y
              bindscroll={handleScroll}
            >
              {monthsContent}
            </scroll-view>
          )}
          <view
            className="lu-calendar__footer"
            style={{
              paddingBottom: safeAreaInsetBottom
                ? 'env(safe-area-inset-bottom)'
                : '0px',
            }}
          >
            {renderFooterButton()}
          </view>
        </view>
      );
    };

    if (poppable) {
      if (!show) return null;
      return (
        <view className="lu-calendar-popup" bindtap={handleOverlayTap}>
          <view
            className="lu-calendar-popup__content"
            style={{
              borderRadius: round ? '16px 16px 0 0' : '0px',
            }}
            catchtap={handleContentTap}
          >
            {renderCalendarPanel()}
          </view>
        </view>
      );
    }

    return renderCalendarPanel();
  },
);
