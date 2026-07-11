import '@testing-library/jest-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, waitFor } from '@lynx-js/react/testing-library'

import {
  allowMultipleToast,
  closeToast,
  resetToastDefaultOptions,
  resetToastState,
  setToastDefaultOptions,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  showToast,
} from './controller'
import { Toast } from './Toast'
import { ToastProvider } from './ToastProvider'

function setup() {
  return render(<ToastProvider><view /></ToastProvider>)
}

beforeEach(() => {
  resetToastState()
})

describe('Toast', () => {
  it('renders a text toast message', async () => {
    const { getByText } = setup()
    showToast('hello toast')
    await waitFor(() => {
      expect(getByText('hello toast')).toBeInTheDocument()
    })
  })

  it('closes the active toast and unmounts it', async () => {
    const { getByText, queryByText } = setup()
    showToast('closer')
    await waitFor(() => {
      expect(getByText('closer')).toBeInTheDocument()
    })

    closeToast()
    await waitFor(() => {
      expect(queryByText('closer')).not.toBeInTheDocument()
    })
  })

  it('auto-closes after duration', async () => {
    const { getByText, queryByText } = setup()
    showToast({ message: 'timed', duration: 300 })
    await waitFor(() => {
      expect(getByText('timed')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(queryByText('timed')).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('stays open when duration is 0', async () => {
    const { getByText } = setup()
    showToast({ message: 'persistent', duration: 0 })
    await waitFor(() => {
      expect(getByText('persistent')).toBeInTheDocument()
    })

    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(getByText('persistent')).toBeInTheDocument()
  })

  it('closes when content is tapped if closeOnClick is true', async () => {
    const { container, queryByText } = setup()
    showToast({ message: 'tap me', closeOnClick: true })
    await waitFor(() => {
      expect(queryByText('tap me')).toBeInTheDocument()
    })

    const content = container.querySelector('.lu-toast__content')
    expect(content).toBeInTheDocument()
    fireEvent.tap(content!)

    await waitFor(() => {
      expect(queryByText('tap me')).not.toBeInTheDocument()
    })
  })

  it('closes when overlay is tapped if closeOnClickOverlay is true', async () => {
    const { container, queryByText } = setup()
    showToast({ message: 'overlay tap', overlay: true, closeOnClickOverlay: true })
    await waitFor(() => {
      expect(queryByText('overlay tap')).toBeInTheDocument()
    })

    const overlay = container.querySelector('.lu-toast__overlay')
    expect(overlay).toBeInTheDocument()
    fireEvent.tap(overlay!)

    await waitFor(() => {
      expect(queryByText('overlay tap')).not.toBeInTheDocument()
    })
  })

  it('renders a transparent overlay when forbidClick is true', async () => {
    const { container } = setup()
    showToast({ message: 'forbid', forbidClick: true })
    await waitFor(() => {
      const overlays = container.querySelectorAll('.lu-toast__overlay--transparent')
      expect(overlays.length).toBe(1)
    })
  })

  it('supports stacking multiple toasts', async () => {
    const { getByText, queryByText } = setup()
    allowMultipleToast(true)
    showToast({ message: 'first', duration: 0 })
    await waitFor(() => {
      expect(getByText('first')).toBeInTheDocument()
    })

    showToast({ message: 'second', duration: 0 })
    await waitFor(() => {
      expect(getByText('second')).toBeInTheDocument()
    })

    closeToast()
    await waitFor(() => {
      expect(queryByText('first')).not.toBeInTheDocument()
    })
    expect(getByText('second')).toBeInTheDocument()

    closeToast(true)
    await waitFor(() => {
      expect(queryByText('second')).not.toBeInTheDocument()
    })
  })

  it('respects default options', async () => {
    const { container } = setup()
    setToastDefaultOptions({ duration: 0, position: 'top' })
    showToast('defaults')
    await waitFor(() => {
      const content = container.querySelector('.lu-toast__content--top')
      expect(content).toBeInTheDocument()
    })

    resetToastDefaultOptions()
  })

  it('renders loading/success/fail toasts with correct type classes', async () => {
    const { container, queryByText } = setup()

    showLoadingToast('loading')
    await waitFor(() => {
      expect(container.querySelector('.lu-toast__spinner')).toBeInTheDocument()
    })
    closeToast()
    await waitFor(() => expect(queryByText('loading')).not.toBeInTheDocument())

    showSuccessToast('success')
    await waitFor(() => {
      expect(container.querySelector('.lu-toast__icon--success')).toBeInTheDocument()
    })
    closeToast()
    await waitFor(() => expect(queryByText('success')).not.toBeInTheDocument())

    showFailToast('fail')
    await waitFor(() => {
      expect(container.querySelector('.lu-toast__icon--fail')).toBeInTheDocument()
    })
  })

  it('calls onClose and onOpened lifecycle callbacks', async () => {
    setup()
    const onOpened = vi.fn()
    const onClose = vi.fn()

    showToast({ message: 'lifecycle', duration: 0, onOpened, onClose })
    await waitFor(() => {
      expect(onOpened).toHaveBeenCalledTimes(1)
    })

    closeToast()
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('supports declarative usage', async () => {
    function App({ show }: { show: boolean }) {
      return (
        <ToastProvider>
          <Toast show={show} message="declarative" duration={0} />
        </ToastProvider>
      )
    }

    const { getByText, queryByText, rerender } = render(<App show={false} />)
    expect(queryByText('declarative')).not.toBeInTheDocument()

    rerender(<App show={true} />)
    await waitFor(() => {
      expect(getByText('declarative')).toBeInTheDocument()
    })

    rerender(<App show={false} />)
    await waitFor(() => {
      expect(queryByText('declarative')).not.toBeInTheDocument()
    })
  })
})
