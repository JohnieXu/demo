import * as Lynx from "@lynx-js/types"

declare module "@lynx-js/types" {
  interface IntrinsicElements extends Lynx.IntrinsicElements {
   svg: {
    className?: string;
    src?: string;
    content?: string;
   }
  }
}