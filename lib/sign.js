'use strict'

const assert = require('assert')
const crypto = require('crypto')

module.exports = class {
  constructor (accessKeySecret) {
    this.accessKeySecret = accessKeySecret
  }

  /**
   * @param method {ENUM(GET、POST、PUT、DELETE...)} http method
   * @param headers {JSON} request headers
   * @param URI http所请求资源的URI(统一资源标识符)
   */
  getAuthorization (method, headers, URI) {
    assert(method, 'http method is required')
    assert(URI, 'URI is required')

    let xmnsHeaders = Object.keys(headers)
      .filter(header => header.startsWith('x-mns-'))
      .map(header => `${header.toLowerCase()}:${headers[header]}\n`)
      .sort()
      .join('')

    const DATE = new Date().toGMTString()
    const toSignStr =
      `${method}
      ${headers['Content-MD5'] || ''}
      ${headers['Content-Type'] || ''}
      ${DATE}
      ${xmnsHeaders}
      ${URI}`

    return {
      DATE,
      Authorization: crypto.createHmac('sha1', this.accessKeySecret).update(toSignStr).digest()
    }
  }
}
