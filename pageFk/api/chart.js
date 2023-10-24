import {req} from "@/utils/request.js"

export const getData = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/statistics',
    method: 'get',
    data:row
  })
}
export const getOverNoLeaveData = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/statistics/timeout/noleave',
    method: 'get',
    data:row
  })
}