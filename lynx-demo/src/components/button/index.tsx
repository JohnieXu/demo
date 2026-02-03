import type { FC, ReactNode } from "@lynx-js/react";
import './index.scss';
import type { CSSProperties } from "@lynx-js/types";
import { clsx } from "clsx";

export interface ButtonProps {
  label?: string;
  onClick?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

const Button: FC<ButtonProps> = (props) => {
  return (
    <view className={clsx('c-button', props.className)} style={props.style} bindtap={props.onClick}>
      {props.children ? props.children : <text class="c-button__label">{props.label}</text>}
    </view>
  );
}

export default Button;
