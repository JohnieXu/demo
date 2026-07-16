import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@lynx-js/react/testing-library';

import { Slider } from './Slider';

function mockRect(
  element: Element,
  rect: { left: number; top: number; width: number; height: number },
): void {
  element.getBoundingClientRect = () => ({
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
    toJSON: () => rect,
  });
}

function tapBar(element: Element, detail: { x: number; y: number }): void {
  fireEvent.tap(element, { detail });
}

describe('Slider', () => {
  it('renders with defaultValue', () => {
    const { container } = render(
      <Slider defaultValue={50} min={0} max={100} />,
    );
    const button = container.querySelector('.lu-slider__button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle('left: 50%');
  });

  it('renders disabled state', () => {
    const { container } = render(<Slider disabled defaultValue={30} />);
    expect(container.firstChild).toHaveClass('lu-slider--disabled');
  });

  it('triggers onChange when bar is tapped', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider defaultValue={0} min={0} max={100} onChange={onChange} />,
    );
    const bar = container.querySelector('.lu-slider__bar');
    expect(bar).toBeInTheDocument();
    mockRect(bar!, { left: 0, top: 0, width: 100, height: 4 });

    tapBar(bar!, { x: 75, y: 2 });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onChange).toHaveBeenCalledWith(75);
  });

  it('does not trigger onChange when disabled', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider disabled defaultValue={0} onChange={onChange} />,
    );
    const bar = container.querySelector('.lu-slider__bar');
    fireEvent.tap(bar!);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not trigger onChange when readonly', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider readonly defaultValue={0} onChange={onChange} />,
    );
    const bar = container.querySelector('.lu-slider__bar');
    fireEvent.tap(bar!);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects step when computing value', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider
        defaultValue={0}
        min={0}
        max={100}
        step={10}
        onChange={onChange}
      />,
    );
    const bar = container.querySelector('.lu-slider__bar');
    mockRect(bar!, { left: 0, top: 0, width: 100, height: 4 });
    tapBar(bar!, { x: 76, y: 2 });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onChange).toHaveBeenCalledWith(80);
  });
});
