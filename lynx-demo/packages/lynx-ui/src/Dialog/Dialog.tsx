import { Button } from '../Button'
import { Popup } from '../Popup'
import { cn } from '../theme/cn'
import { addUnit, createNamespace } from '../utils'
import type { CSSProperties } from '@lynx-js/types'
import type { DialogProps } from './types'

const bem = createNamespace('dialog')

export function Dialog(props: DialogProps) {
  const {
    show = false,
    title,
    message,
    theme = 'default',
    width,
    className,
    style,
    overlay = true,
    closeOnClickOverlay = true,
    confirmButtonText = '确认',
    cancelButtonText = '取消',
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonDisabled,
    cancelButtonDisabled,
    showConfirmButton = true,
    showCancelButton = false,
    onConfirm,
    onCancel,
    onClose,
    onOpened,
    onClosed,
    onClickOverlay,
    onShowChange,
    children,
  } = props

  const isRound = theme === 'round-button'

  const handleConfirm = () => {
    onConfirm?.()
    onShowChange?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onShowChange?.(false)
  }

  const rootStyle: CSSProperties = { ...style }
  if (width !== undefined) {
    rootStyle.width = addUnit(width)
  }

  const renderHeader = () => {
    if (!title) {
      return null
    }

    return (
      <view className={bem('header')}>
        <text>{title}</text>
      </view>
    )
  }

  const renderContent = () => {
    if (!message && !children) {
      return null
    }

    return (
      <view className={cn(bem('content'), bem({ 'has-title': !!title }))}>
        {children ?? <text className={bem('message')}>{message}</text>}
      </view>
    )
  }

  const renderFooter = () => {
    if (!showConfirmButton && !showCancelButton) {
      return null
    }

    if (isRound) {
      return (
        <view className={bem('footer')}>
          {showConfirmButton && (
            <view className={bem('confirm')} key="confirm">
              <Button
                type="primary"
                block
                round
                text={confirmButtonText}
                color={confirmButtonColor}
                disabled={confirmButtonDisabled}
                onClick={handleConfirm}
              />
            </view>
          )}
          {showCancelButton && (
            <view className={bem('cancel')} key="cancel">
              <Button
                type="default"
                plain
                block
                round
                text={cancelButtonText}
                color={cancelButtonColor}
                disabled={cancelButtonDisabled}
                onClick={handleCancel}
              />
            </view>
          )}
        </view>
      )
    }

    return (
      <view className={bem('footer')}>
        {showCancelButton && (
          <view className={bem('cancel')} key="cancel">
            <Button
              type="default"
              plain
              block
              text={cancelButtonText}
              color={cancelButtonColor}
              disabled={cancelButtonDisabled}
              onClick={handleCancel}
            />
          </view>
        )}
        {showConfirmButton && (
          <view className={bem('confirm')} key="confirm">
            <Button
              type="primary"
              block
              text={confirmButtonText}
              color={confirmButtonColor}
              disabled={confirmButtonDisabled}
              onClick={handleConfirm}
            />
          </view>
        )}
      </view>
    )
  }

  return (
    <Popup
      show={show}
      position="center"
      overlay={overlay}
      closeOnClickOverlay={closeOnClickOverlay}
      round
      className={cn('lu-dialog-popup', className)}
      onClose={onClose}
      onOpened={onOpened}
      onClosed={onClosed}
      onClickOverlay={onClickOverlay}
      onShowChange={onShowChange}
    >
      <view className={cn(bem({ 'round-button': isRound }))} style={rootStyle}>
        {renderHeader()}
        {renderContent()}
        {renderFooter()}
      </view>
    </Popup>
  )
}
