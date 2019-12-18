
const
{ assign } = Object,
fsp = require('fs').promises,
api = {},

gather = async path => {
  const
  dir = await fsp.readdir(path),
  objs = await Promise.all(dir.map(async name => {
    const
    next = path+'/'+name
    thing = await fsp.stat(next)
    if (thing.isDirectory()) return {[name]: await gather(next)}
    if (name.match(/\.js$/)) return {[name.split(/.js$/)[0]]: require(next)}
    return {}
  }))
  return assign({},...objs)
},

flatten =(obj, path)=> {
  for (const key in obj) {
    if (typeof obj[key] == 'function')
      api[path] = assign(api[path] || {}, {[key]: obj[key]})
    else if (typeof obj[key] == 'object')
      flatten(obj[key], (path? path+'/':'')+key)
  }
},

cleanup =()=> {
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
}

gather(process.cwd()+'/api').then(flatten).then(cleanup)

module.exports = api
