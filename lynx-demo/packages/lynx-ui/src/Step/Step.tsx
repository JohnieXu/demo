import { useContext } from '@lynx-js/react'
import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { StepsContext, StepIndexContext } from '../Steps/context'
import type { StepProps } from './types'

const bem = createNamespace('step')

export function Step(props: StepProps) {
  const {
    activeIcon,
    inactiveIcon,
    description,
    children,
    className,
    style,
  } = props

  const steps = useContext(StepsContext)
  const index = useContext(StepIndexContext)

  const active = steps?.active ?? 0
  const isActive = index <= active
  const isProcess = index === active
  const color = isActive ? steps?.activeColor : steps?.inactiveColor

  const renderIcon = () => {
    if (isActive && activeIcon) return activeIcon
    if (!isActive && inactiveIcon) return inactiveIcon
    return (
      <Icon
        svg={isActive ? icons.checked : icons['circle-o']}
        size={20}
        style={{ color }}
      />
    )
  }

  return (
    <view
      className={cn(
        bem({
          active: isActive,
          process: isProcess,
        }),
        className,
      )}
      style={style}
    >
      <view className={bem('icon')}>{renderIcon()}</view>
      <view className={bem('body')}>
        {children && <view className={bem('title')} style={{ color }}>{children}</view>}
        {description && <view className={bem('desc')} style={{ color }}>{description}</view>}
      </view>
    </view>
  )
}

export type { StepProps } from './types'
