import request from '../server'

const getList = data =>
  request('/home/getList', {
    method: 'get',
    params: data,
  })

export default {
  getList
}
