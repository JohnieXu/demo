import { useCallback, useState } from '@lynx-js/react'
import { useNavigate } from 'react-router'
import './CountryCodePicker.scss'

type CountryCode = {
  name: string
  code: string
  letter: string
}

/** Placeholder dataset; replace with the full country/region list. */
const COUNTRY_CODES: CountryCode[] = [
  { name: '中国大陆', code: '+86', letter: 'Z' },
  { name: '中国香港', code: '+852', letter: 'X' },
  { name: '中国澳门', code: '+853', letter: 'A' },
  { name: '中国台湾', code: '+886', letter: 'T' },
  { name: '美国', code: '+1', letter: 'M' },
  { name: '日本', code: '+81', letter: 'R' },
  { name: '韩国', code: '+82', letter: 'H' },
  { name: '新加坡', code: '+65', letter: 'X' },
]

/**
 * 手机号归属地选择 (PRD): 搜索 + 字母索引.
 * Shared page opened from every phone-number input; selection is passed
 * back via navigate(-1) + location.state.
 */
export function CountryCodePicker() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const filtered = keyword
    ? COUNTRY_CODES.filter(
        (c) => c.name.includes(keyword) || c.code.includes(keyword),
      )
    : COUNTRY_CODES
  const letters = Array.from(new Set(filtered.map((c) => c.letter))).sort()

  const onSelect = useCallback(
    (item: CountryCode) => {
      'background only'
      // TODO(selection): persist the chosen country code (e.g. a small
      // zustand slice) so the calling page reads it after navigate(-1).
      void item
      navigate(-1)
    },
    [navigate],
  )

  return (
    <view className="page-country-code p-4">
      <view className="search-bar">
        <input
          className="search-input"
          placeholder="搜索国家或地区"
          bindinput={(e) => setKeyword(e.detail.value)}
        />
      </view>
      <view className="list">
        {letters.map((letter) => (
          <view key={letter} className="group">
            <text className="group-letter">{letter}</text>
            {filtered
              .filter((c) => c.letter === letter)
              .map((c) => (
                <view
                  key={c.code + c.name}
                  className="row"
                  bindtap={() => onSelect(c)}
                >
                  <text className="row-name">{c.name}</text>
                  <text className="row-code">{c.code}</text>
                </view>
              ))}
          </view>
        ))}
      </view>
      <view className="letter-index">
        {letters.map((letter) => (
          <text key={letter} className="letter-item">{letter}</text>
        ))}
      </view>
    </view>
  )
}
