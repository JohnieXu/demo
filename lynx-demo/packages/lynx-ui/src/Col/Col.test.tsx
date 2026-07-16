import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Row } from '../Row'
import { Col } from './Col'

describe('Col', () => {
  it('renders span and offset classes', () => {
    const { container } = render(
      <Row>
        <Col span={8} offset={4}>Content</Col>
      </Row>,
    )
    const col = container.querySelector('.lu-col')
    expect(col).toHaveClass('lu-col--8')
    expect(col).toHaveClass('lu-col--offset-4')
  })

  it('inherits gutter padding from Row', () => {
    const { container } = render(
      <Row gutter={16}>
        <Col span={12}>A</Col>
        <Col span={12}>B</Col>
      </Row>,
    )
    const col = container.querySelector('.lu-col')
    expect(col).toHaveStyle({ paddingRight: '8px' })
  })
})
