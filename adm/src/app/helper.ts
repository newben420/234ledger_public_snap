export class Helper {
  static cookiesEnabled = (): boolean => {
    if (navigator.cookieEnabled) {
      return true;
    }
    return false;
  }
}
