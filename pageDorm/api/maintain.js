import {req} from "@/utils/request.js"

export const getFloorZtree = (row) => {
  return req({
    url: '/iot-wx/dorm/floor/tree',
    method: 'get',
    data:row
  })
}
export const submit = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/submit',
    method: 'post',
    data:row
  })
}
export const getRecords = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/list',
    method: 'get',
    data:row
  })
}
export const getRecordsDetails = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/details',
    method: 'get',
    data:row
  })
}
export const cancel = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/cancel',
    method: 'post',
    data:row
  })
}
export const reject = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/reject',
    method: 'post',
    data:row
  })
}
export const agree = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/handling',
    method: 'post',
    data:row
  })
}
export const finish = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/finish',
    method: 'post',
    data:row
  })
}
export const repeat = (row) => {
  return req({
    url: '/iot-wx/dorm/repair/repeat/submit',
    method: 'post',
    data:row
  })
}