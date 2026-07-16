import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, waitFor } from '@lynx-js/react/testing-library'

import { Tabs } from './Tabs'
import { Tab } from '../Tab/Tab'

describe('Tabs', () => {
  it('switches active panel and calls onChange when a tab is tapped', async () => {
    const onChange = vi.fn()
    const { container, findByText, queryByText } = render(
      <Tabs onChange={onChange}>
        <Tab title="Tab A" name="a">Content A</Tab>
        <Tab title="Tab B" name="b">Content B</Tab>
      </Tabs>,
    )

    await findByText('Content A')
    expect(queryByText('Content B')).not.toBeInTheDocument()

    const tabs = container.querySelectorAll('.lu-tabs__tab')
    expect(tabs[0]).toHaveClass('lu-tabs__tab--active')

    fireEvent.tap(tabs[1]!)

    await findByText('Content B')
    expect(queryByText('Content A')).not.toBeInTheDocument()
    expect(tabs[1]).toHaveClass('lu-tabs__tab--active')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('b', 'Tab B')
  })

  it('does not switch when the tab is disabled', async () => {
    const onChange = vi.fn()
    const { container, findByText, getByText, queryByText } = render(
      <Tabs onChange={onChange}>
        <Tab title="Tab A" name="a">Content A</Tab>
        <Tab title="Tab B" name="b" disabled>Content B</Tab>
      </Tabs>,
    )

    await findByText('Content A')

    const tabs = container.querySelectorAll('.lu-tabs__tab')
    expect(tabs[1]).toHaveClass('lu-tabs__tab--disabled')
    fireEvent.tap(tabs[1]!)

    await waitFor(() => {
      expect(queryByText('Content B')).not.toBeInTheDocument()
    })
    expect(getByText('Content A')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })
})
