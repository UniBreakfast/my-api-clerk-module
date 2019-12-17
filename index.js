
const
c = console.log,

api = {
  'projectx/sub/news': {
    get(query, response, dataSrc) {
      response.got = {query}
    },
    post_s(query, response, dataSrc) {
      response.posted = {query}
    },
    delete_p(query, response, dataSrc) {
      response.deleted = {query}
    }
  }
},

findHandler =(method, route)=>

handle = async req => {
  const response = {errors: []},
      { url, method, headers } = req,
      [, route, queryString ] = url.match(/\/api\/([\/\w]+)\??(.*$)/),
      apiHandler = api[route] && api[route][method]
  if (!apiHandler) response.errors.push('No api found at '+url)
  else {
    const { sesClerk, passClerk, dataClerk } = req.socket._server
    if (apiHandler.ses) {
      if (!headers.ses) response.errors.push('No session to confirm')
      else {
        try { var ses = JSON.parse(headers.ses) }
        catch { response.errors.push('Session header is not a valid JSON') }
      }
      ////////////////////////////////
    }
  }
}

for (const route in api) {
  const handlers = api[route]
  for (const key in handlers) {
    const [, method, ses, pass] = key.match(/([^_]+)_?(s)?(p)?/),
          handler = handlers[method.toUpperCase()] = handlers[key]
    if (pass) handler.pass = handler.ses = true
    else if (ses) handler.ses = true
    delete handlers[key]
  }
}
debugger
module.exports = async ({method, url, socket, headers}, body, dev)=> {
  const { _server: { sesClerk }={} } = socket || {}

  console.log({method, url, headers, body})

  url = url.slice(5)

  if (url == 'guest') return [{x: 2, y: 4}, {x: 7, y: 11}]

  if (url == 'user') {
    const ses = JSON.parse(headers.ses)


    if (sesClerk.check(ses))
      return {personal: "info"}

  }


  // return {response: 'from api'}
  throw 'no such api'
}