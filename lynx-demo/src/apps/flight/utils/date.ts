import dayjs from './dayjs'

export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function formatYyyyMmDd(date: Date | dayjs.Dayjs | string): string {
  return dayjs(date).format('YYYY-MM-DD')
}

export function parseYyyyMmDd(dateStr: string): dayjs.Dayjs {
  return dayjs(dateStr, 'YYYY-MM-DD', true)
}

export function formatDateDisplay(dateStr: string): { dateText: string; weekday: string } {
  const date = parseYyyyMmDd(dateStr)
  return {
    dateText: date.format('M月D日'),
    weekday: WEEKDAYS[date.day()],
  }
}

export function getDefaultDates(): { departureDate: string; arrivalDate: string } {
  const today = dayjs()
  const arrival = today.add(2, 'day')
  return {
    departureDate: today.format('YYYY-MM-DD'),
    arrivalDate: arrival.format('YYYY-MM-DD'),
  }
}
