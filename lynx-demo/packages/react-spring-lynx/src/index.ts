import { createHost } from '@react-spring/animated';
import { primitives } from './primitives';
import { AnimatedStyle } from './AnimatedStyle';

export { useSpring } from '@react-spring/web';

export const { animated } = createHost(primitives, {
  applyAnimatedValues: (node, props) => {
    if (!node || !node.setNativeProps) return false;
    
    // Lynx 节点通过 setNativeProps 同步动画属性
    node.setNativeProps({
      style: props,
    });
  },
  createAnimatedStyle: (style) => {
    return new AnimatedStyle(style);
  },
});
