import '@testing-library/jest-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@lynx-js/react/testing-library'

import {
  closeNotify,
  resetNotifyDefaultOptions,
  resetNotifyState,
  setNotifyDefaultOptions,
  showNotify,
} from './controller'
import { NotifyProvider } from './NotifyProvider'

function setup() {
  return render(
    <NotifyProvider>
      <view />
    </NotifyProvider>,
  )
}

beforeEach(() => {
  resetNotifyState()
})

describe('Notify', () => {
  it('renders a notify message', async () => {
    const { getByText } = setup()
    showNotify('hello notify')
    await waitFor(() => {
      expect(getByText('hello notify')).toBeInTheDocument()
    })
  })

  it('closes the active notify and unmounts it', async () => {
    const { getByText, queryByText } = setup()
    showNotify('closer')
    await waitFor(() => {
      expect(getByText('closer')).toBeInTheDocument()
    })

    closeNotify()
    await waitFor(() => {
      expect(queryByText('closer')).not.toBeInTheDocument()
    })
  })

  it('auto-closes after duration and calls onClose', async () => {
    const onClose = vi.fn()
    const { getByText, queryByText } = setup()
    showNotify({ message: 'timed', duration: 300, onClose })
    await waitFor(() => {
      expect(getByText('timed')).toBeInTheDocument()
    })

    await waitFor(
      () => {
        expect(queryByText('timed')).not.toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('stays open when duration is 0', async () => {
    const { getByText } = setup()
    showNotify({ message: 'persistent', duration: 0 })
    await waitFor(() => {
      expect(getByText('persistent')).toBeInTheDocument()
    })

    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(getByText('persistent')).toBeInTheDocument()
  })

  it('respects default options', async () => {
    const { container } = setup()
    setNotifyDefaultOptions({ duration: 0, position: 'bottom' })
    showNotify('defaults')
    await waitFor(() => {
      const content = container.querySelector('.lu-popup__content--bottom')
      expect(content).toBeInTheDocument()
    })

    resetNotifyDefaultOptions()
  })

  it('calls onOpened lifecycle callback', async () => {
    setup()
    const onOpened = vi.fn()
    showNotify({ message: 'lifecycle', duration: 0, onOpened })
    await waitFor(() => {
      expect(onOpened).toHaveBeenCalledTimes(1)
    })
  })
})
