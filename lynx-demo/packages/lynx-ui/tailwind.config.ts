import type { Config } from 'tailwindcss'
import lynxPreset from '@lynx-js/tailwind-preset'

const config: Config = {
  presets: [lynxPreset],
  content: [
    './packages/lynx-ui/src/**/*.{ts,tsx}',
    './src/apps/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--lu-color-primary)',
        'primary-pressed': 'var(--lu-color-primary-pressed)',
        'primary-subtle': 'var(--lu-color-primary-subtle)',
        background: 'var(--lu-color-background)',
        surface: 'var(--lu-color-surface)',
        'surface-elevated': 'var(--lu-color-surface-elevated)',
        'surface-overlay': 'var(--lu-color-surface-overlay)',
        'text-primary': 'var(--lu-color-text-primary)',
        'text-secondary': 'var(--lu-color-text-secondary)',
        'text-tertiary': 'var(--lu-color-text-tertiary)',
        'text-inverse': 'var(--lu-color-text-inverse)',
        'text-disabled': 'var(--lu-color-text-disabled)',
        border: 'var(--lu-color-border)',
        'border-subtle': 'var(--lu-color-border-subtle)',
        'border-inverse': 'var(--lu-color-border-inverse)',
        danger: 'var(--lu-color-danger)',
        success: 'var(--lu-color-success)',
        warning: 'var(--lu-color-warning)',
        info: 'var(--lu-color-info)',
        disabled: 'var(--lu-color-disabled)',
        'disabled-bg': 'var(--lu-color-disabled-bg)',
        mask: 'var(--lu-color-mask)',
      },
      spacing: {
        xs: 'var(--lu-space-xs)',
        sm: 'var(--lu-space-sm)',
        md: 'var(--lu-space-md)',
        lg: 'var(--lu-space-lg)',
        xl: 'var(--lu-space-xl)',
        '2xl': 'var(--lu-space-2xl)',
        '3xl': 'var(--lu-space-3xl)',
      },
      borderRadius: {
        sm: 'var(--lu-radius-sm)',
        md: 'var(--lu-radius-md)',
        lg: 'var(--lu-radius-lg)',
        xl: 'var(--lu-radius-xl)',
        '2xl': 'var(--lu-radius-2xl)',
        full: 'var(--lu-radius-full)',
      },
      fontSize: {
        xs: ['var(--lu-font-size-xs)', 'var(--lu-line-height-tight)'],
        sm: ['var(--lu-font-size-sm)', 'var(--lu-line-height-normal)'],
        base: ['var(--lu-font-size-base)', 'var(--lu-line-height-normal)'],
        lg: ['var(--lu-font-size-lg)', 'var(--lu-line-height-normal)'],
        xl: ['var(--lu-font-size-xl)', 'var(--lu-line-height-normal)'],
        '2xl': ['var(--lu-font-size-2xl)', 'var(--lu-line-height-relaxed)'],
        '3xl': ['var(--lu-font-size-3xl)', 'var(--lu-line-height-relaxed)'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        sm: 'var(--lu-shadow-sm)',
        md: 'var(--lu-shadow-md)',
      },
      zIndex: {
        dropdown: '100',
        sticky: '200',
        modal: '300',
        popover: '400',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('ui-active', '&.ui-active')
      addVariant('ui-disabled', '&.ui-disabled')
      addVariant('ui-checked', '&.ui-checked')
    },
  ],
  corePlugins: {
    container: false,
    float: false,
    clear: false,
    objectFit: false,
    objectPosition: false,
  },
}

export default config
