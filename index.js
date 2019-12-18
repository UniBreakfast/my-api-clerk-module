
const
c = console.log, { assign, fromEntries } = Object,

wholeBody = (req, parts=[])=> new Promise((resolve, reject)=>
  req.on('error', reject).on('data', part => parts.push(part))
    .on('end', ()=> resolve(Buffer.concat(parts).toString('utf8')))),

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

handle = async req => {
  const response = {errors: []},
      { url, method, headers } = req,
      [, route, queryString ] = url.match(/\/api\/([\/\w]+)\??(.*$)/),
      apiHandler = api[route] && api[route][method]
  if (!apiHandler)
    response.errors.push(`No route found for ${method} request to ${url}`)
  else {
    const { sesClerk, passClerk, dataSrc } = req.socket._server
    if (apiHandler.ses) {
      if (!headers.ses) response.errors.push('No session to confirm')
      else {
        try { var ses = JSON.parse(headers.ses) }
        catch { response.errors.push('Session header is not a valid JSON') }
      }
      if (!sesClerk) response.errors.push('Session cannot be confirmed')
      else if (!response.errors[0]) sesClerk.check(ses, response)
    }
    if (apiHandler.pass) {
      const { pass } = headers
      if (!pass) response.errors.push('Password required to confirm request')
      if (!passClerk) response.errors.push('Password cannot be confirmed')
      else if (!response.errors[0]) passClerk.check(pass, response)
    }
    if (!response.errors[0]) {
      const query = !queryString ? {} : fromEntries(decodeURI(queryString)
        .split('&').map(pair => pair.split('=')))
      assign(query, JSON.parse(await wholeBody(req) || '{}'))
      apiHandler(query, response, dataSrc)
    }
    delete response.sesuserid
  }
  return response
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

module.exports = {handle}