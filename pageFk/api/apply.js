import {req} from "@/utils/request.js"

export const exist = (row) => {
  return req({
    url: '/iot-wx/visitor/check/interviewee/exist',
    method: 'post',
    data:row
  })
}

export const picUpload = (row) => {
  return req({
    url: '/iot-wx/visitor/upload/pic',
    method: 'post',
    data:row
  })
}

export const submit = (row) => {
  return req({
    url: '/iot-wx/visitor/submit',
    method: 'post',
    data:row
  })
}
export const targetInviteSubmit = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/followup/submit',
    method: 'post',
    data:row
  })
}
export const inviteEmpSubmit = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/followup/invitation/submit',
    method: 'post',
    data:row
  })
}
export const reqInviteRecordes = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/followup/list',
    method: 'get',
    data:row
  })
}