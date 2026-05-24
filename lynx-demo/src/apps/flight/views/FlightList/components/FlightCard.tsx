import { useState, useMemo, useCallback } from '@lynx-js/react'
import { clsx } from 'clsx'
import type { Flight } from 'travel-domain'
import './FlightCard.scss'

interface FlightCardProps {
  flight: Flight
  selectedDate: string
  isMultiPeople: boolean
  isB2C: boolean
  onClick: (flight: Flight) => void
}

function getAirlineColorClass(airlineName: string): string {
  const map: Record<string, string> = {
    '国航': 'airline-ca',
    '南航': 'airline-cz',
    '东航': 'airline-mu',
    '海航': 'airline-hu',
    '吉祥': 'airline-ho',
    '厦航': 'airline-mf',
  }
  return map[airlineName] || 'airline-default'
}

function readClickedCache(): { date: string; ids: string[] } {
  try {
    const raw = (lynx as any).getStorageSync?.('clicked_flight_card')
    if (raw) {
      return JSON.parse(raw as string)
    }
  } catch {
    // ignore
  }
  return { date: '', ids: [] }
}

function writeClickedCache(date: string, ids: string[]) {
  try {
    ;(lynx as any).setStorageSync?.('clicked_flight_card', JSON.stringify({ date, ids }))
  } catch {
    // ignore
  }
}

export function FlightCard({
  flight,
  selectedDate,
  isMultiPeople,
  isB2C,
  onClick,
}: FlightCardProps) {
  const [isShareInfoShow, setIsShareInfoShow] = useState(false)

  const isHighlighted = useMemo(() => {
    const cache = readClickedCache()
    const currentId = `${flight.flightNumber}_${flight.depTime}`
    return cache.date === selectedDate && cache.ids.includes(currentId)
  }, [flight.flightNumber, flight.depTime, selectedDate])

  const handleClick = useCallback(() => {
    const currentId = `${flight.flightNumber}_${flight.depTime}`
    const cache = readClickedCache()
    const ids = cache.date === selectedDate ? [...cache.ids] : []
    if (!ids.includes(currentId)) {
      ids.push(currentId)
    }
    writeClickedCache(selectedDate, ids)
    onClick(flight)
  }, [flight, selectedDate, onClick])

  const airlineColorClass = getAirlineColorClass(flight.airline.name)
  const displayPrice = isMultiPeople
    ? Math.round(flight.price / (isMultiPeople ? 2 : 1))
    : flight.price

  return (
    <view
      className={clsx('flight-card', {
        'flight-card--highlighted': isHighlighted,
      })}
      bindtap={handleClick}
    >
      <view className="flight-card__inner">
        {isB2C && (
          <text className="flight-card__b2c-tag">疗养专享</text>
        )}

        {/* Schedule row */}
        <view className="flight-card__schedule">
          {/* Departure */}
          <view className="flight-card__departure">
            <text className="flight-card__time">{flight.depTime}</text>
            <text className="flight-card__terminal">
              {flight.depAirport}
              {flight.depTerminal ? ` ${flight.depTerminal}` : ''}
            </text>
          </view>

          {/* Duration & route */}
          <view className="flight-card__duration-block">
            <text className="flight-card__duration">{flight.duration}</text>
            <view
              className={clsx('flight-card__route', {
                'flight-card__route--stopover': flight.isStop,
              })}
            >
              <view className="flight-card__route-line" />
              {flight.isStop ? (
                <text className="flight-card__stop-tag">经停</text>
              ) : null}
            </view>
          </view>

          {/* Arrival + Price */}
          <view className="flight-card__arrival-block">
            <view className="flight-card__arrival">
              <view className="flight-card__arrival-row">
                <text className="flight-card__time">{flight.arrTime}</text>
                {flight.intervalDay > 0 && (
                  <text className="flight-card__next-day">
                    +{flight.intervalDay}
                  </text>
                )}
              </view>
              <text className="flight-card__terminal">
                {flight.arrAirport}
                {flight.arrTerminal ? ` ${flight.arrTerminal}` : ''}
              </text>
            </view>

            <view className="flight-card__price-block">
              <view className="flight-card__price-row">
                {isMultiPeople && (
                  <text className="flight-card__per-capita">人均</text>
                )}
                <text className="flight-card__price-symbol">¥</text>
                <text className="flight-card__price-value">{displayPrice}</text>
              </view>
              {flight.discount > 0 && (
                <view className="flight-card__cabin">
                  <text className="flight-card__cabin-name">
                    {flight.cabinName}
                  </text>
                  <text className="flight-card__cabin-discount">
                    {flight.discount}折
                  </text>
                </view>
              )}
            </view>
          </view>
        </view>

        {/* Meta row */}
        <view className="flight-card__meta">
          {flight.logo ? (
            <image
              src={flight.logo}
              className="flight-card__airline-logo"
            />
          ) : (
            <view
              className={clsx(
                'flight-card__airline-dot',
                airlineColorClass
              )}
            />
          )}
          <text className="flight-card__airline-name">
            {flight.airline.name}
          </text>
          <text className="flight-card__meta-divider">|</text>
          <text className="flight-card__flight-no">
            {flight.flightNumber}
          </text>
          <text className="flight-card__meta-divider">|</text>
          <text className="flight-card__model">
            {flight.model}
          </text>
          {flight.meal === 1 && (
            <>
              <text className="flight-card__meta-divider">|</text>
              <text className="flight-card__meal">🍽</text>
            </>
          )}
        </view>

        {/* Share flight info */}
        {flight.isShare ? (
          <view
            className="flight-card__share-toggle"
            bindtap={(e: any) => {
              e.stopPropagation()
              setIsShareInfoShow((prev) => !prev)
            }}
          >
            <text className="flight-card__share-text">
              {isShareInfoShow ? '收起' : '共享航班信息'}
            </text>
          </view>
        ) : null}

        {flight.isShare && isShareInfoShow ? (
          <view className="flight-card__share-info">
            <text className="flight-card__share-label">
              实际承运：{flight.shareFlight || flight.airline.name}{' '}
              {flight.shareFlyNo || flight.flightNumber}
            </text>
          </view>
        ) : null}
      </view>
    </view>
  )
}
