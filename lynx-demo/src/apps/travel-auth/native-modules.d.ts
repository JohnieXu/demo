/**
 * Type declarations for native modules used by travel-auth.
 *
 * Cross-bundle navigation goes through the host's ExplorerModule, which is
 * built into LynxExplorer. Production hosts must register an equivalent
 * module. Pattern follows the official lynx explorer `homepage/typing.d.ts`.
 */

export {}

declare global {
  interface NativeModulesMap {
    ExplorerModule: {
      /**
       * Opens a Lynx bundle URL in a new native container.
       * e.g. `file://lynx?local://travel-auth.lynx.bundle?from=/booking`
       */
      openSchema(url: string): void
    }
  }

  declare let NativeModules: NativeModulesMap
}
