import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@lynx-js/react'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, isDef } from '../utils'
import { TabsContext } from './context'
import type { TabsProps } from './types'

const bem = createNamespace('tabs')

export function Tabs(props: TabsProps) {
  const {
    active,
    defaultActive,
    type = 'line',
    color = 'var(--lu-color-primary)',
    background,
    lineWidth = '40px',
    lineHeight = '3px',
    animated = false,
    sticky = false,
    onChange,
    className,
    style,
    children,
  } = props

  const isControlled = isDef(active)
  const [innerActive, setInnerActive] = useState<string | number | undefined>(
    defaultActive,
  )
  const actualActive = isControlled ? active : innerActive

  const [tabs, setTabs] = useState<
    Array<{ id: number; name: string | number; title: string; disabled: boolean }>
  >([])
  const nextIdRef = useRef(0)

  // When no active value is set, fall back to `defaultActive` or the first tab.
  useEffect(() => {
    if (!isDef(actualActive) && tabs.length > 0) {
      const next = isDef(defaultActive) ? defaultActive : tabs[0].name
      if (!isControlled) {
        setInnerActive(next)
      }
    }
  }, [actualActive, tabs, defaultActive, isControlled])

  const register = useCallback(
    (tab: { title: string; name?: string | number; disabled?: boolean }) => {
      const id = ++nextIdRef.current
      const name = isDef(tab.name) ? tab.name : id
      setTabs((prev) => [...prev, { id, name, title: tab.title, disabled: !!tab.disabled }])
      return { id, name }
    },
    [],
  )

  const unregister = useCallback((id: number) => {
    setTabs((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const setActive = useCallback(
    (name: string | number, title: string) => {
      const tab = tabs.find((t) => t.name === name)
      if (!tab || tab.disabled) return
      if (name === actualActive) return
      if (!isControlled) {
        setInnerActive(name)
      }
      onChange?.(name, title)
    },
    [tabs, actualActive, isControlled, onChange],
  )

  const contextValue = useMemo(
    () => ({ active: actualActive, register, unregister }),
    [actualActive, register, unregister],
  )

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.name === actualActive))

  const renderNav = () => {
    return (
      <view
        className={bem('wrap')}
        style={background ? { backgroundColor: background } : undefined}
      >
        <view className={bem('nav')}>
          {tabs.map((tab) => {
            const isActive = tab.name === actualActive
            const activeStyle =
              type === 'line'
                ? { color }
                : { backgroundColor: color, color: 'var(--lu-color-text-inverse)' }

            return (
              <view
                key={tab.id}
                className={cn(
                  bem('tab', { active: isActive, disabled: tab.disabled }),
                )}
                style={isActive ? activeStyle : undefined}
                bindtap={() => setActive(tab.name, tab.title)}
              >
                <text>{tab.title}</text>
              </view>
            )
          })}
          {type === 'line' && (
            <view
              className={bem('line')}
              style={{
                width: addUnit(lineWidth),
                height: addUnit(lineHeight),
                backgroundColor: color,
                left: tabs.length > 0 ? `${(activeIndex + 0.5) * (100 / tabs.length)}%` : '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </view>
      </view>
    )
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <view
        className={cn(
          bem({ line: type === 'line', card: type === 'card', sticky }),
          className,
        )}
        style={style}
      >
        {renderNav()}
        <view className={bem('content', { animated })}>
          {children}
        </view>
      </view>
    </TabsContext.Provider>
  )
}

export type { TabsProps } from './types'
