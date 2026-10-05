/**
 * Utility for Website Links, URL Detection, and Safe Clipboard Copying
 */

export const SHARED_APP_URL = 'https://ais-pre-75mfyxblkokjbe6d2cvarx-354013746416.asia-east1.run.app';
export const DEV_APP_URL = 'https://ais-dev-75mfyxblkokjbe6d2cvarx-354013746416.asia-east1.run.app';

/**
 * Returns the best active URL for this application.
 * Uses current browser origin if valid, otherwise defaults to the shared production URL.
 */
export const getActiveAppUrl = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    if (origin && origin !== 'null' && (origin.startsWith('http://') || origin.startsWith('https://'))) {
      return origin;
    }
  }
  return SHARED_APP_URL;
};

/**
 * Robust copy to clipboard with fallback for iframes and older browsers
 */
export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  // 1. Try modern Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // 2. Fallback using document.execCommand('copy')
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) return true;
    } catch {
      // Continue to prompt fallback
    }
  }

  return false;
};
