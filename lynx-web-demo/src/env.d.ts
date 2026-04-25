/// <reference types="@rsbuild/core/types" />

import type { CSSProperties } from '@lynx-js/web-elements';

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

/**
 * Lynx Web View component type declarations
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lynx-view': {
        key?: string;
        style?: CSSProperties;
        url?: string;
        class?: string;
        className?: string;
        [key: string]: unknown;
      };
    }
  }
}
