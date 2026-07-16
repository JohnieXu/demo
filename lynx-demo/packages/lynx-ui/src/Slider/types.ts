import type { CSSProperties } from '@lynx-js/types';
import type { Numeric } from '../utils';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readonly?: boolean;
  vertical?: boolean;
  barHeight?: Numeric;
  buttonSize?: Numeric;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  style?: CSSProperties;
  onChange?: (value: number) => void;
  onDragStart?: (value: number) => void;
  onDragEnd?: (value: number) => void;
}
