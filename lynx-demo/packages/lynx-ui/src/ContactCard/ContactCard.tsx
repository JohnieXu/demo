import { Cell } from '../Cell'
import { Icon } from '../Icon'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { ContactCardProps } from './types'

const bem = createNamespace('contact-card')

const ADD_SQUARE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18 3H6C4.34 3 3 4.34 3 6v12c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3zm-1 11h-4v4h-2v-4H7v-2h4V8h2v4h4v2z"/>
</svg>`

const CONTACT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
</svg>`

export function ContactCard(props: ContactCardProps) {
  const {
    tel,
    name,
    type = 'add',
    addText,
    editable = true,
    className,
    style,
    onClick,
  } = props

  const handleClick = () => {
    if (editable) {
      onClick?.()
    }
  }

  const icon = (
    <Icon
      svg={type === 'edit' ? CONTACT_SVG : ADD_SQUARE_SVG}
      className={bem('icon')}
    />
  )

  const title = type === 'add'
    ? (addText ?? '添加联系人')
    : `姓名：${name ?? ''}`

  const label = type === 'edit'
    ? `电话：${tel ?? ''}`
    : undefined

  return (
    <Cell
      center
      icon={icon}
      title={title}
      label={label}
      className={cn(bem({ [type]: true }), className)}
      border={false}
      isLink={editable}
      titleClass={bem('title')}
      style={style}
      onClick={handleClick}
    />
  )
}

export type { ContactCardProps, ContactCardType } from './types'
