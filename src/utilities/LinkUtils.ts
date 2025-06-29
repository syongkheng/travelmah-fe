export class UrlUtils {
  static updateUrlEnding(currentUrl: string, newEnding: string): string {
    const url = new URL(currentUrl)

    const pathSegments = url.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      pathSegments[pathSegments.length - 1] = newEnding
    } else {
      pathSegments.push(newEnding)
    }
    url.pathname = pathSegments.join('/')

    url.search = ''

    return url.toString()
  }
}
