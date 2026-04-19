import { createHost } from '@react-spring/animated';
import { primitives } from './primitives';
import { AnimatedStyle } from './AnimatedStyle';
import { Lookup } from '@react-spring/types';
import { NodesRef } from '@lynx-js/types';

export * from '@react-spring/core';

type Instance = NodesRef;

function applyAnimatedValues(node: Instance, props: Lookup) {
  if (!node || !node.setNativeProps) return false;
  
  // Lynx 节点通过 setNativeProps 同步动画属性
  node.setNativeProps(props);
}

export const { animated } = createHost(primitives, {
  applyAnimatedValues,
  createAnimatedStyle: (style) => {
    return new AnimatedStyle(style);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getComponentProps: ({ scrollTop, scrollLeft, ...props }) => props
});
