export function compareMonth(date1: Date, date2: Date): -1 | 0 | 1 {
  const year1 = date1.getFullYear()
  const year2 = date2.getFullYear()
  if (year1 !== year2) {
    return year1 > year2 ? 1 : -1
  }
  const month1 = date1.getMonth()
  const month2 = date2.getMonth()
  return month1 === month2 ? 0 : month1 > month2 ? 1 : -1
}

export function compareDay(day1: Date, day2: Date): -1 | 0 | 1 {
  const monthCompare = compareMonth(day1, day2)
  if (monthCompare !== 0) {
    return monthCompare
  }
  const date1 = day1.getDate()
  const date2 = day2.getDate()
  return date1 === date2 ? 0 : date1 > date2 ? 1 : -1
}

export const cloneDate = (date: Date) => new Date(date)

export const cloneDates = (dates: Date | Date[]) =>
  Array.isArray(dates) ? dates.map(cloneDate) : cloneDate(dates)

export function getDayByOffset(date: Date, offset: number): Date {
  const cloned = cloneDate(date)
  cloned.setDate(cloned.getDate() + offset)
  return cloned
}

export function getMonthByOffset(date: Date, offset: number): Date {
  const cloned = cloneDate(date)
  cloned.setMonth(cloned.getMonth() + offset)
  if (cloned.getDate() !== date.getDate()) {
    cloned.setDate(0)
  }
  return cloned
}

export function getYearByOffset(date: Date, offset: number): Date {
  const cloned = cloneDate(date)
  cloned.setFullYear(cloned.getFullYear() + offset)
  if (cloned.getDate() !== date.getDate()) {
    cloned.setDate(0)
  }
  return cloned
}

export const getPrevDay = (date: Date) => getDayByOffset(date, -1)
export const getNextDay = (date: Date) => getDayByOffset(date, 1)
export const getPrevMonth = (date: Date) => getMonthByOffset(date, -1)
export const getNextMonth = (date: Date) => getMonthByOffset(date, 1)
export const getPrevYear = (date: Date) => getYearByOffset(date, -1)
export const getNextYear = (date: Date) => getYearByOffset(date, 1)

export const getToday = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export function calcDateNum(date: [Date, Date]): number {
  return (date[1].getTime() - date[0].getTime()) / (1000 * 60 * 60 * 24) + 1
}

export function getMonthEndDay(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function isLastRowInMonth(date: Date, offset: number = 0): boolean {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const currentPos = offset + date.getDate() - 1
  const lastDayPos = offset + lastDay.getDate() - 1
  return Math.floor(currentPos / 7) === Math.floor(lastDayPos / 7)
}

export function formatMonthTitle(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

export function getMonthDayOffset(monthDate: Date, firstDayOfWeek: number): number {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  return (firstDay.getDay() - firstDayOfWeek + 7) % 7
}

export function getEstimatedMonthHeight(
  monthDate: Date,
  rowHeight: number | string,
  firstDayOfWeek: number,
): number {
  const offset = getMonthDayOffset(monthDate, firstDayOfWeek)
  const totalDays = getMonthEndDay(monthDate.getFullYear(), monthDate.getMonth() + 1)
  const rows = Math.ceil((offset + totalDays) / 7)
  const height = typeof rowHeight === 'number' ? rowHeight : parseInt(rowHeight, 10)
  return rows * height
}

export function getMonthScrollOffset(
  monthIndex: number,
  months: Date[],
  rowHeight: number | string,
  firstDayOfWeek: number,
): number {
  let offset = 0
  for (let i = 0; i < monthIndex; i++) {
    offset += getEstimatedMonthHeight(months[i], rowHeight, firstDayOfWeek)
  }
  return offset
}

export function getDayRowOffset(
  targetDate: Date,
  monthDate: Date,
  rowHeight: number | string,
  firstDayOfWeek: number,
): number {
  const offset = getMonthDayOffset(monthDate, firstDayOfWeek)
  const row = Math.floor((offset + targetDate.getDate() - 1) / 7)
  const height = typeof rowHeight === 'number' ? rowHeight : parseInt(rowHeight, 10)
  return row * height
}

export function joinClass(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function parseSize(size: number | string): number {
  return typeof size === 'number' ? size : parseInt(size, 10)
}

export function toCSSSize(size: number | string): string {
  return `${parseSize(size)}px`
}
