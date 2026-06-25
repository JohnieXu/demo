import type { CSSProperties } from '@lynx-js/types'

export const CALENDAR_DEFAULTS = {
  background: '#fff',
  textColor: '#333',
  secondaryTextColor: '#666',
  disabledColor: '#ccc',
  weekdayColor: '#999',
  primaryColor: '#ff5712',
  rangeEdgeColor: '#fff',
  rangeMiddleBgOpacity: 0.1,

  headerTitleHeight: 44,
  headerTitleFontSize: 16,
  headerSubtitleHeight: 44,
  headerSubtitleFontSize: 16,
  headerActionSize: 20,
  headerActionColor: '#333',
  headerActionDisabledColor: '#ccc',

  weekdayHeight: 30,
  weekdayFontSize: 12,

  monthTitleHeight: 44,
  monthTitleFontSize: 14,
  monthMarkColor: 'rgba(242, 243, 245, 0.8)',
  monthMarkFontSize: 160,

  dayHeight: 64,
  dayFontSize: 16,
  dayMarginBottom: 4,
  selectedDaySize: 54,
  selectedDayColor: '#fff',
  infoFontSize: 10,
  infoLineHeight: 14,

  confirmButtonHeight: 44,
  confirmButtonMargin: '8px 16px',
  confirmButtonBorderRadius: 22,

  borderRadius: 8,
  popupBorderRadius: 16,
  paddingMd: 16,
}

export const CALENDAR_TEXTS = {
  title: '日期选择',
  confirm: '确定',
  start: '开始',
  end: '结束',
  today: '今天',
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  monthTitle: (year: number, month: number) => `${year}年${month}月`,
  rangePrompt: (maxRange: number | string) => `最多选择 ${maxRange} 天`,
}

export const POPUP_STYLES: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    position: 'relative',
    backgroundColor: CALENDAR_DEFAULTS.background,
    borderRadius: `${CALENDAR_DEFAULTS.popupBorderRadius}px ${CALENDAR_DEFAULTS.popupBorderRadius}px 0 0`,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85%',
    overflow: 'hidden',
  },
}
