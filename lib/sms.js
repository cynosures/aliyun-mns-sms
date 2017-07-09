'use strict'

const Sign = require('./sign')
const axios = require('axios')

const BASE_URL = 'https://mns.aliyuncs.com/doc/v1'
const PUBLIC_HEADER_PARAMS = {
  'Content-Type': 'text/xml',
  'x-mns-version': '2015-06-06'
}

class SMS {
  /**
   * @param accessKeyId accessKeySecret 阿里云API的密钥对
   * @param endPoint 访问MNS的接入地址 传入公网地址
   */
  constructor(accessKeyId, accessKeySecret, endPoint, signName, region = 'hangzhou') {
    this.accessKeyId = accessKeyId
    this.accessKeySecret = accessKeySecret
    this.endPoint = endPoint
    this.topic = `sms.topic-cn-${region}`
    this.sign = new Sign(accessKeySecret)
    this.signName = signName
  }

  request () {
    return axios.create({
      baseURL: BASE_URL,
      headers: Object.assign({
        'x-mns-version': '2015-06-06'
      }, PUBLIC_HEADER_PARAMS)
    })
  }
  /**
   * 发布消息
   * @param signName
   * @param templateCode
   * @param type
   * @param phone
   * @param smsParams
   */
  publish ({ signName = this.signName, templateCode, type = 'singleContent', phone, smsParams }) {
    const URI = `/topics/${this.topic}/messages`
    const request = this.request()
    const { DATE, Authorization } = this.sign.getAuthorization('POST', request.headers, URI)
    return request
      .post(URI)

  }
}

const noop = () => false

module.exports = SMS