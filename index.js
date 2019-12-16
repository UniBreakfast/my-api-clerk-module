const c = console.log

module.exports = async ({method, url, socket, headers}, body, dev)=> {
  const { _server: { sesClerk }={} } = socket || {}

  console.log({method, url, headers, body})

  url = url.slice(5)

  if (url == 'guest') return [{x: 2, y: 4}, {x: 7, y: 11}]

  if (url == 'user') {
    const ses = JSON.parse(headers.session)


    if (sesClerk.check(ses))
      return {personal: "info"}

  }


  // return {response: 'from api'}
  throw 'no such api'
}