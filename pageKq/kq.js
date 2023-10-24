import {req} from "@/utils/request.js"

export const everydayKqData = (row) => {
  return req({
    url: '/iot-wx/kq/daysts/everyday/collect',
    method: 'get',
    data:row
  })
}

export const summaryData = (row) => {
  return req({
    url: '/iot-wx/kq/daysts/range/details',
    method: 'get',
    data:row
  })
}



export const receiptTyperolelist = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/typeroles',
    method: 'get',
    data:row
  })
}

export const limitTime = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/initdata',
    method: 'get',
    data:row
  })
}

export const getDeptList = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/dept/emps',
    method: 'get',
    data:row
  })
}

export const getDuration = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/compute/working/betweentime',
    method: 'post',
    data:row
  })
}

export const getAuditData = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/audit/emps',
    method: 'get',
    data:row
  })
}

export const searchEmp = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/dept/search/emp',
    method: 'get',
    data:row
  })
}

export const sendForm = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/generate',
    method: 'post',
    data:row
  })
}

export const myReceiptList = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/submit/list',
    method: 'get',
    data:row
  })
}

export const receiptDetails = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/details',
    method: 'get',
    data:row
  })
}

export const receiptCopyDetails = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/copy/list',
    method: 'get',
    data:row
  })
}

export const receiptAuditDetails = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/audit/list',
    method: 'get',
    data:row
  })
}

export const receiptCancel = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/cancel',
    method: 'post',
    data:row
  })
}

export const receiptReject = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/reject',
    method: 'post',
    data:row
  })
}

export const receiptAgree = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/consent',
    method: 'post',
    data:row
  })
}

export const updateForm = (row) => {
  return req({
    url: '/iot-wx/kq/receipt/update',
    method: 'post',
    data:row
  })
}
export const getSchoolData = (row) => {
  return req({
    url: '/iot-wx/common/schools',
    method: 'get',
    data:row
  })
}