import { useRef, useState } from '@lynx-js/react';
import type { BaseTouchEvent, CSSProperties, Target } from '@lynx-js/types';
import { cn } from '../theme/cn';
import { addUnit, clamp, createNamespace, isDef, toNumber } from '../utils';
import type { SliderProps } from './types';

const bem = createNamespace('slider');

function getDecimalPlaces(num: number): number {
  const str = String(num);
  if (!str.includes('.')) return 0;
  return str.split('.')[1].length;
}

function formatValue(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  if (!Number.isFinite(value)) return min;
  const steps = Math.round((value - min) / step);
  let next = min + steps * step;
  next = clamp(next, min, max);
  const decimals = Math.max(
    getDecimalPlaces(step),
    getDecimalPlaces(min),
    getDecimalPlaces(max),
  );
  return Number(next.toFixed(decimals));
}

interface Position {
  x: number;
  y: number;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

type SliderEvent = BaseTouchEvent<Target>;

export function Slider(props: SliderProps) {
  const {
    min = 0,
    max = 100,
    step = 1,
    defaultValue,
    value,
    disabled = false,
    readonly = false,
    vertical = false,
    barHeight = 4,
    buttonSize = 24,
    activeColor = 'var(--lu-color-primary)',
    inactiveColor = 'var(--lu-color-disabled-bg)',
    className,
    style,
    onChange,
    onDragStart,
    onDragEnd,
  } = props;

  const isControlled = isDef(value);
  const initialValue = formatValue(
    toNumber(value ?? defaultValue ?? min),
    min,
    max,
    step,
  );
  const [innerValue, setInnerValue] = useState(initialValue);
  const actualValue = isControlled
    ? formatValue(toNumber(value), min, max, step)
    : innerValue;

  const idRef = useRef(`lu-slider-${Math.random().toString(36).slice(2, 9)}`);
  const rectRef = useRef<Rect>({ left: 0, top: 0, width: 0, height: 0 });
  const draggingRef = useRef(false);

  const updateValue = (nextValue: number) => {
    const formatted = formatValue(nextValue, min, max, step);
    if (!isControlled) {
      setInnerValue(formatted);
    }
    if (formatted !== actualValue) {
      onChange?.(formatted);
    }
  };

  const getRectFromElement = (e: SliderEvent): Rect | null => {
    const target = e?.currentTarget as unknown as {
      getBoundingClientRect?: () => Partial<Rect> | null;
    };
    if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect();
      if (rect) {
        const width = rect.width ?? 0;
        const height = rect.height ?? 0;
        if (width > 0 || height > 0) {
          return {
            left: rect.left ?? 0,
            top: rect.top ?? 0,
            width,
            height,
          };
        }
      }
    }
    return null;
  };

  const getRect = (e?: SliderEvent): Promise<Rect> => {
    return new Promise((resolve) => {
      const fromElement = e ? getRectFromElement(e) : null;
      if (fromElement) {
        rectRef.current = fromElement;
        resolve(fromElement);
        return;
      }

      const lynxGlobal = (
        globalThis as unknown as {
          lynx?: { createSelectorQuery?: () => unknown };
        }
      ).lynx;
      if (!lynxGlobal?.createSelectorQuery) {
        resolve(rectRef.current);
        return;
      }

      try {
        const query = lynxGlobal.createSelectorQuery();
        (
          query as {
            select: (selector: string) => {
              invoke: (options: {
                method: string;
                success: (rect: Rect) => void;
                fail?: () => void;
              }) => { exec: () => void };
            };
          }
        )
          .select(`#${idRef.current}`)
          .invoke({
            method: 'boundingClientRect',
            success: (rect) => {
              rectRef.current = {
                left: rect?.left ?? 0,
                top: rect?.top ?? 0,
                width: rect?.width ?? 0,
                height: rect?.height ?? 0,
              };
              resolve(rectRef.current);
            },
            fail: () => resolve(rectRef.current),
          })
          .exec();
      } catch {
        resolve(rectRef.current);
      }
    });
  };

  const readPosition = (e: SliderEvent): Position => {
    const detail = e?.detail ?? {};
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0] ?? {};
    return {
      x: detail.x ?? touch.clientX ?? touch.x ?? 0,
      y: detail.y ?? touch.clientY ?? touch.y ?? 0,
    };
  };

  const valueFromPosition = (pos: Position) => {
    const rect = rectRef.current;
    const range = max - min;
    if (range <= 0) return min;

    let ratio: number;
    if (vertical) {
      ratio = rect.height > 0 ? (pos.y - rect.top) / rect.height : 0;
    } else {
      ratio = rect.width > 0 ? (pos.x - rect.left) / rect.width : 0;
    }
    ratio = clamp(ratio, 0, 1);
    return min + ratio * range;
  };

  const handleTap = async (e: SliderEvent) => {
    if (disabled || readonly) return;
    await getRect(e);
    const next = valueFromPosition(readPosition(e));
    updateValue(next);
  };

  const handleTouchStart = async (e: SliderEvent) => {
    if (disabled || readonly) return;
    draggingRef.current = true;
    await getRect(e);
    const next = valueFromPosition(readPosition(e));
    updateValue(next);
    onDragStart?.(actualValue);
  };

  const handleTouchMove = async (e: SliderEvent) => {
    if (!draggingRef.current || disabled || readonly) return;
    const next = valueFromPosition(readPosition(e));
    updateValue(next);
  };

  const handleTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    onDragEnd?.(actualValue);
  };

  const ratio = max > min ? (actualValue - min) / (max - min) : 0;

  const barStyle: CSSProperties = {
    backgroundColor: inactiveColor,
    height: vertical ? '100%' : addUnit(barHeight),
    width: vertical ? addUnit(barHeight) : '100%',
  };

  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
    width: vertical ? '100%' : `${ratio * 100}%`,
    height: vertical ? `${ratio * 100}%` : '100%',
  };

  const buttonStyle: CSSProperties = {
    width: addUnit(buttonSize),
    height: addUnit(buttonSize),
    left: vertical ? '50%' : `${ratio * 100}%`,
    top: vertical ? undefined : '50%',
    bottom: vertical ? `${ratio * 100}%` : undefined,
  };

  return (
    <view
      className={cn(bem({ disabled, readonly, vertical }), className)}
      style={style}
    >
      <view
        id={idRef.current}
        className={bem('bar')}
        style={barStyle}
        bindtap={handleTap}
      >
        <view className={bem('active')} style={activeStyle} />
      </view>
      <view
        className={bem('button')}
        style={buttonStyle}
        bindtouchstart={handleTouchStart}
        bindtouchmove={handleTouchMove}
        bindtouchend={handleTouchEnd}
      />
    </view>
  );
}

export type { SliderProps } from './types';
