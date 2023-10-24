import {req} from "../../utils/request.js"

export const reqVoiceInfo = (row) => {
  return req({
    url: '/iot-wx/smart/voice/recognition',
    method: 'get',
    data:row
  })
}
export const getCfg = (row) => {
  return req({
    url: '/iot-wx/dict/code',
    method: 'get',
    data:row
  })
}
export const getCarShape = (row) => {
  return req({
    url: '/iot-wx/car/shape/list',
    method: 'get',
    data:row
  })
}
export const addPlatenum = (row) => {
  return req({
    url: '/iot-wx/user/add/platenum',
    method: 'post',
    data:row
  })
}
export const getCarDetails = (row) => {
  return req({
    url: '/iot-wx/user/car/details',
    method: 'get',
    data:row
  })
}
export const updatePlatenum = (row) => {
  return req({
    url: '/iot-wx/user/update/platenum',
    method: 'post',
    data:row
  })
}
export const removePlatenum = (row) => {
  return req({
    url: '/iot-wx/user/remove/platenum',
    method: 'post',
    data:row
  })
}

export const uploadFaceimg = (row) => {
  return req({
    url: '/iot-wx/user/upload/faceimg',
    method: 'post',
    data:row
  })
}

export const userInfo = (row) => {
  return req({
    url: '/iot-wx/user/info',
    method: 'get',
    data:row
  })
}

export const updateCarnum = (row) => {
  return req({
    url: '/iot-wx/user/update/carnum',
    method: 'post',
    data:row
  })
}

export const userUnbind = (row) => {
  return req({
    url: '/iot-wx/user/unbind',
    method: 'post',
    data:row
  })
}
export const reportloss = (row) => {
  return req({
    url: '/iot-wx/user/card/reportloss',
    method: 'get',
    data:row
  })
}
export const lossUnregister = (row) => {
  return req({
    url: '/iot-wx/user/card/lift-reportloss',
    method: 'get',
    data:row
  })
}
export const getStudentList = (row) => {
  return req({
    url: '/iot-wx/user/stulist',
    method: 'get',
    data:row
  })
}
export const searchParent = (row) => {
  return req({
    url: '/iot-wx/user/stu/parents',
    method: 'get',
    data:row
  })
}
export const getUserIdentity = (row) => {
  return req({
    url: '/iot-wx/user/wx/bind/identity',
    method: 'get',
    data:row
  })
}
export const getPhoneCode = (row) => {
  return req({
    url: '/iot-wx/sms/sendcode',
    method: 'post',
    data:row
  })
}
export const sendPhone = (row) => {
  return req({
    url: '/iot-wx/user/update/phone',
    method: 'post',
    data:row
  })
}