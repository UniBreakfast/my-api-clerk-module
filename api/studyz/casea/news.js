
module.exports = {
  get(query, response, dataSrc) {
    response.got = { query }
  },
  post_s(query, response, dataSrc) {
    response.posted = { query }
  },
  delete_p(query, response, dataSrc) {
    response.deleted = { query }
  }
}
