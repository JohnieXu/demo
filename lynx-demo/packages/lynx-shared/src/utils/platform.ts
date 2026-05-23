/**
 * Platform detection utilities for Lynx
 */

/**
 * Check if running on Lynx platform
 */
export function isLynx(): boolean {
  return typeof SystemInfo !== 'undefined';
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  if (!isLynx()) return false;
  return SystemInfo.platform === 'iOS';
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  if (!isLynx()) return false;
  return SystemInfo.platform === 'Android';
}

/**
 * Get Lynx version
 */
export function getLynxVersion(): string {
  if (!isLynx()) return '';
  return SystemInfo.lynxSdkVersion || SystemInfo.engineVersion || '';
}
