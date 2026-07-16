import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Row } from './Row'
import { Col } from '../Col'

describe('Row', () => {
  it('renders with BEM classes and modifiers', () => {
    const { container } = render(
      <Row align="center" justify="end" wrap={false}>
        <Col span={12}>A</Col>
      </Row>,
    )
    const row = container.firstChild
    expect(row).toHaveClass('lu-row')
    expect(row).toHaveClass('lu-row--align-center')
    expect(row).toHaveClass('lu-row--justify-end')
    expect(row).toHaveClass('lu-row--nowrap')
  })

  it('distributes gutter spacing to Col children', () => {
    const { container } = render(
      <Row gutter={24}>
        <Col span={12}>A</Col>
        <Col span={12}>B</Col>
      </Row>,
    )
    const cols = container.querySelectorAll('.lu-col')
    expect(cols[0]).toHaveStyle({ paddingRight: '12px' })
    expect(cols[1]).toHaveStyle({ paddingLeft: '12px' })
  })
})
