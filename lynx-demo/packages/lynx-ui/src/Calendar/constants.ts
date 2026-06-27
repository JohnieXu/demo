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
