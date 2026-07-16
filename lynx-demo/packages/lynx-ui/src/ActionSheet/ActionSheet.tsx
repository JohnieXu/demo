import { useCallback, useMemo } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { Loading } from '../Loading'
import { Popup } from '../Popup'
import { cn } from '../theme/cn'
import { createNamespace, isDef } from '../utils'
import type { ActionSheetAction, ActionSheetProps } from './types'

const bem = createNamespace('action-sheet')

export function ActionSheet(props: ActionSheetProps) {
  const {
    show = false,
    actions = [],
    title,
    description,
    cancelText,
    closeOnClickAction = true,
    closeOnClickOverlay = true,
    overlay = true,
    onSelect,
    onCancel,
    onClose,
    onOpened,
    onClosed,
    onClickOverlay,
    onShowChange,
    className,
    style,
  } = props

  const hasTitle = isDef(title)

  const close = useCallback(() => {
    onShowChange?.(false)
  }, [onShowChange])

  const handleCloseIconTap = useCallback(() => {
    close()
  }, [close])

  const handleActionTap = useCallback((action: ActionSheetAction, index: number) => {
    if (action.disabled || action.loading) {
      return
    }
    onSelect?.(action, index)
    if (closeOnClickAction) {
      close()
    }
  }, [onSelect, closeOnClickAction, close])

  const handleCancelTap = useCallback(() => {
    onCancel?.()
    close()
  }, [onCancel, close])

  const popupStyle: CSSProperties = useMemo(() => ({
    ...style,
  }), [style])

  const renderHeader = () => {
    if (!hasTitle) return null
    return (
      <view className={bem('header')}>
        <text className={bem('title')}>{title}</text>
        <view className={bem('close')} bindtap={handleCloseIconTap}>
          <Icon svg={icons.close} size={22} />
        </view>
      </view>
    )
  }

  const renderDescription = () => {
    if (!isDef(description)) return null
    return (
      <view className={bem('description')}>
        <text>{description}</text>
      </view>
    )
  }

  const renderAction = (action: ActionSheetAction, index: number) => {
    const itemStyle: CSSProperties = {}
    if (action.color && !action.disabled && !action.loading) {
      itemStyle.color = action.color
    }

    return (
      <view
        key={index}
        className={cn(
          bem('item', { disabled: !!action.disabled, loading: !!action.loading }),
        )}
        style={itemStyle}
        bindtap={() => handleActionTap(action, index)}
      >
        {action.loading ? (
          <Loading size={22} />
        ) : (
          <>
            <text className={bem('name')}>{action.name}</text>
            {isDef(action.subname) && (
              <text className={bem('subname')}>{action.subname}</text>
            )}
          </>
        )}
      </view>
    )
  }

  return (
    <Popup
      show={show}
      position="bottom"
      round
      safeAreaInsetBottom
      overlay={overlay}
      closeOnClickOverlay={closeOnClickOverlay}
      onClose={onClose}
      onOpened={onOpened}
      onClosed={onClosed}
      onClickOverlay={onClickOverlay}
      onShowChange={onShowChange}
      className={cn(bem({ 'with-title': hasTitle }), className)}
      style={popupStyle}
    >
      {renderHeader()}
      {renderDescription()}
      <view className={bem('actions')}>
        {actions.map(renderAction)}
      </view>
      {isDef(cancelText) && (
        <>
          <view className={bem('gap')} />
          <view className={bem('cancel')} bindtap={handleCancelTap}>
            <text>{cancelText}</text>
          </view>
        </>
      )}
    </Popup>
  )
}

export type { ActionSheetAction, ActionSheetProps } from './types'
