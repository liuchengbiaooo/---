import request from '@/utils/request'

export function getLeave(ts,te) {
  return request({
    url: '/api/yy/summary',
    method: 'get',
    params: { ts,te }
  })
}


