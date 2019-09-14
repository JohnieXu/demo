import queryString from 'query-string'
const timeout = (time = 5000) => (fn) => {
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('网络超时，请重试'))
      }, time)
    }),
    // eslint-disable-next-line
    typeof fn === 'function' ? fn.apply(this, arguments) : Promise.resolve()
  ])
}

class Request {
  @timeout(5000)
  get(url, options = {}) {
    const { body } = options
    const query = body ? `?${queryString.stringify(body)}` : ''
    return fetch(`${url}${query}`, { ...options, method: 'GET' }).then((res) =>
      res.json()
    )
  }
  @timeout(5000)
  post(url, options = {}) {
    let { body = {} } = options
    body = JSON.stringify(body)
    return fetch(url, { ...options, body, method: 'POST' }).then((res) =>
      res.json()
    )
  }
}

export { timeout, Request }
export default { timeout, Request }
