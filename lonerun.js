
console.log('Standalone testing of api module...')

const sessions = [{id: 1, token: 'abc'}, {id: 2, token: 'def'}],
      sesClerk = {
        check({ sid, token }, response) {
          if (!sessions.find(s => s.id==sid && s.token==token))
            response.errors.push('Session confirmation failed')
        }
      },
      passClerk = {
        check(pass, response) {
          if (pass!='jeronimo')
            response.errors.push('Incorrect password')
        }
      },
    { assign } = Object,
      req = new (require('events')),
      ses = '{"sid":2,"token":"def"}',
      pass = 'jeronimo',
      apiClerk = require('.')

assign(req, {method: 'DELETE', url: encodeURI('/api/studym/cased/news?a=1 2&x=7'), socket: {_server: {sesClerk, passClerk}}, headers: {pass, ses}})

apiClerk.handle(req).then(console.log).catch(console.log)

req.emit('data', Buffer.from(JSON.stringify({x:1, y:2})))
req.emit('end', '')


setTimeout(()=> {
  apiClerk.handle(req).then(console.log).catch(console.log)
  req.emit('data', Buffer.from(JSON.stringify({x:1, y:2})))
  req.emit('end', '')
}, 1e3)
setTimeout(()=>{}, 1e8)