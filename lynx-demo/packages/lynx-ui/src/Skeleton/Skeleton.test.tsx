import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Skeleton } from './Skeleton'
import { SkeletonTitle } from '../SkeletonTitle'
import { SkeletonAvatar } from '../SkeletonAvatar'
import { SkeletonParagraph } from '../SkeletonParagraph'
import { SkeletonImage } from '../SkeletonImage'

describe('Skeleton', () => {
  it('renders loading state with BEM classes', () => {
    const { container } = render(
      <Skeleton row={2} title avatar />,
    )
    expect(container.firstChild).toHaveClass('lu-skeleton')
    expect(container.firstChild).toHaveClass('lu-skeleton--animate')
    expect(container.querySelector('.lu-skeleton-title')).toBeInTheDocument()
    expect(container.querySelector('.lu-skeleton-avatar')).toBeInTheDocument()
    expect(container.querySelectorAll('.lu-skeleton-paragraph')).toHaveLength(2)
  })

  it('renders children when not loading', () => {
    const { container } = render(
      <Skeleton loading={false}><text>Loaded</text></Skeleton>,
    )
    expect(container.firstChild).toHaveTextContent('Loaded')
  })

  it('subcomponents render their BEM classes', () => {
    const { container } = render(
      <>
        <SkeletonTitle titleWidth={100} />
        <SkeletonAvatar />
        <SkeletonParagraph />
        <SkeletonImage />
      </>,
    )
    expect(container.querySelector('.lu-skeleton-title')).toBeInTheDocument()
    expect(container.querySelector('.lu-skeleton-avatar')).toBeInTheDocument()
    expect(container.querySelector('.lu-skeleton-paragraph')).toBeInTheDocument()
    expect(container.querySelector('.lu-skeleton-image')).toBeInTheDocument()
  })
})
