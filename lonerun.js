
console.log('Standalone testing of api module...')

const sessions = [{id: 1, token: 'abc'}, {id: 2, token: 'def'}],
      sesClerk = {
        check({ sid, token }) {
          return sessions.find(s => s.id==sid && s.token==token)
        }
      }

require('.')({method: 'POST', url: '/api/user', socket: {_server: {sesClerk}},
  headers: {custom: 'token', ses: '{"sid":2,"token":"def"}'}},
    {payload: 'content'}).then(console.log).catch(console.log)

setTimeout(()=>{}, 1e8)