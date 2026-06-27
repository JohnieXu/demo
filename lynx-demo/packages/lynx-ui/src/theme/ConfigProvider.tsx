import { useMemo } from '@lynx-js/react'
import type { ConfigProviderProps, ThemeMode } from './types'
import { ConfigContext } from './context'

function resolveTheme(theme: ThemeMode): Exclude<ThemeMode, 'auto'> {
  if (theme !== 'auto') {
    return theme
  }

  const globalProps = (globalThis as unknown as { __globalProps?: { theme?: string } })?.__globalProps
  const globalTheme = globalProps?.theme
  if (typeof globalTheme === 'string') {
    const normalized = globalTheme.toLowerCase()
    if (normalized === 'dark' || normalized === 'light') {
      return normalized
    }
  }

  const lynxGlobal = (globalThis as unknown as { lynx?: { __globalProps?: { theme?: string } } })?.lynx
  const lynxTheme = lynxGlobal?.__globalProps?.theme
  if (typeof lynxTheme === 'string') {
    const normalized = lynxTheme.toLowerCase()
    if (normalized === 'dark' || normalized === 'light') {
      return normalized
    }
  }

  return 'light'
}

function flattenThemeVars(
  vars?: Record<string, Record<string, string | undefined> | undefined>,
): Record<string, string> {
  if (!vars) {
    return {}
  }

  const result: Record<string, string> = {}
  Object.entries(vars).forEach(([component, tokens]) => {
    if (!tokens) return
    Object.entries(tokens).forEach(([key, value]) => {
      if (value !== undefined) {
        result[`--lu-${component}-${key}`] = value
      }
    })
  })
  return result
}

export function ConfigProvider(props: ConfigProviderProps) {
  const {
    children,
    theme = 'light',
    themeVars,
    themeVarsDark,
    themeVarsLight,
    themeVarsScope = 'local',
    className,
  } = props

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme])
  const themeClass = `lynx-theme-${resolvedTheme}`

  const cssVars = useMemo(() => {
    const baseVars = resolvedTheme === 'dark' ? themeVarsDark : themeVarsLight
    return {
      ...flattenThemeVars(baseVars),
      ...flattenThemeVars(themeVars),
    }
  }, [resolvedTheme, themeVars, themeVarsDark, themeVarsLight])

  const contextValue = useMemo(
    () => ({
      theme: resolvedTheme,
      themeClass,
    }),
    [resolvedTheme, themeClass],
  )

  const style = themeVarsScope === 'local' ? cssVars : undefined

  return (
    <ConfigContext.Provider value={contextValue}>
      <view className={cn(themeClass, className)} style={style}>
        {children}
      </view>
    </ConfigContext.Provider>
  )
}

function cn(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
