import {req} from "@/utils/request.js"

export const details = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/details',
    method: 'post',
    data:row
  })
}
export const auditConsent = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/audit/consent',
    method: 'post',
    data:row
  })
}
export const auditReject = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/audit/reject',
    method: 'post',
    data:row
  })
}
export const cancel = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/cancel',
    method: 'post',
    data:row
  })
}
export const resubmit = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/resubmit',
    method: 'post',
    data:row
  })
}
// 访客直接提交单据
export const immediateSubmit = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/immediately/submit',
    method: 'post',
    data:row
  })
}
// 随行人员提交信息
export const retinueSubmit = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/invitation/submit',
    method: 'post',
    data:row
  })
}
// 删除随行人员
export const retinueRemove = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/invitation/remove/record',
    method: 'post',
    data:row
  })
}
// 根据区域id获取线路
export const reqLines = (row) => {
  return req({
    url: '/iot-wx/visitor/lineroutes',
    method: 'get',
    data:row
  })
}