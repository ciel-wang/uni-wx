import {req} from "@/utils/request.js"

export const getInitdata = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment/initdata',
    method: 'get',
    data:row
  })
}
export const getSearchList = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment/appointment/list',
    method: 'get',
    data:row
  })
}
export const applySubmit = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment/appointment',
    method: 'post',
    data:row
  })
}
export const getApplyList = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment/appointments',
    method: 'get',
    data:row
  })
}
export const cancel = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment/appointment/cancel',
    method: 'post',
    data:row
  })
}
export const reject = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment/appointment/reject',
    method: 'post',
    data:row
  })
}
export const agree = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment//appointment/audit',
    method: 'post',
    data:row
  })
}
export const repeat = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment//appointment/repeat/submit',
    method: 'post',
    data:row
  })
}
export const details = (row) => {
  return req({
    url: '/iot-wx/dorm/apartment/appointment/details',
    method: 'get',
    data:row
  })
}