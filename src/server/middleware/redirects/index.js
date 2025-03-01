const { getRedirect } = require('../../../../src/utils/redirects')
const { parse } = require('url')
const { stringify } = require('querystring')
const { isProduction } = require('../../utils')

const OLD_BLOG_URL_REGEXP = /dataversioncontrol\.com/

module.exports = (req, res, next) => {
  const parsedUrl = parse(req.url, true)
  const host = req.headers.host
  let pathname = parsedUrl.pathname

  // Remove invisible emoji from URL. It's was an old medium blog
  if (OLD_BLOG_URL_REGEXP.test(host)) {
    pathname = pathname.replace(/%EF%B8%8F/, '')
  }

  const [code, location] = getRedirect(host, pathname, {
    req,
    dev: !isProduction
  })

  if (location) {
    // HTTP redirects
    let redirectLocation = location

    const queryStr = stringify(parsedUrl.query)
    if (queryStr) {
      redirectLocation += '?' + queryStr
    }
    res.writeHead(code, {
      Location: redirectLocation
    })

    res.end()

    return
  }

  next()
}
