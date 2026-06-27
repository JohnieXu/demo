import type { ReactNode } from '@lynx-js/react'

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeTokens {
  color: {
    primary: string
    'primary-pressed': string
    'primary-subtle': string
    background: string
    surface: string
    'surface-elevated': string
    'surface-overlay': string
    'text-primary': string
    'text-secondary': string
    'text-tertiary': string
    'text-inverse': string
    'text-disabled': string
    border: string
    'border-subtle': string
    'border-inverse': string
    danger: string
    success: string
    warning: string
    info: string
    disabled: string
    'disabled-bg': string
    mask: string
  }
  space: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    full: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
}

export interface ComponentThemeVars {
  [component: string]: Record<string, string | undefined> | undefined
  calendar?: {
    primaryColor?: string
    background?: string
    textColor?: string
    weekdayColor?: string
    disabledColor?: string
    selectedDayColor?: string
    rangeMiddleOpacity?: string
    monthMarkColor?: string
    headerTitleHeight?: string
    headerSubtitleHeight?: string
    weekdayHeight?: string
    monthTitleHeight?: string
    dayHeight?: string
    dayFontSize?: string
    confirmButtonHeight?: string
    confirmButtonBorderRadius?: string
    popupBorderRadius?: string
    borderRadius?: string
  }
  button?: {
    primaryBackground?: string
    primaryColor?: string
    disabledBackground?: string
    borderRadius?: string
    heightSm?: string
    heightMd?: string
    heightLg?: string
  }
}

export interface ConfigProviderProps {
  children: ReactNode
  theme?: ThemeMode
  themeVars?: ComponentThemeVars
  themeVarsDark?: ComponentThemeVars
  themeVarsLight?: ComponentThemeVars
  themeVarsScope?: 'local' | 'global'
  className?: string
}

export interface ConfigContextValue {
  theme: Exclude<ThemeMode, 'auto'>
  themeClass: string
}
