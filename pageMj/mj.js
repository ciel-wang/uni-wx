import {req} from "../utils/request.js"

export const mjList = (row) => {
  return req({
    url: '/iot-wx/door/init/data',
    method: 'get',
    data:row
  })
}

export const schemaMonitorData = (row) => {
  return req({
    url: '/iot-wx/door/schema/monitor/data',
    method: 'get',
    data:row
  })
}

export const doorAuthList = (row) => {
  return req({
    url: '/iot-wx/door/list',
    method: 'get',
    data:row
  })
}

export const remoteOpen = (row) => {
  return req({
    url: '/iot-wx/door/remote/open',
    method: 'post',
    data:row
  })
}

export const empAuthList = (row) => {
  return req({
    url: '/iot-wx/door/auth/emplist',
    method: 'get',
    data:row
  })
}

export const updateEmpAuth = (row) => {
  return req({
    url: '/iot-wx/door/auth/update',
    method: 'post',
    data:row
  })
}
export const studentInOutData = (row) => {
  return req({
    url: '/iot-wx/area/door/student/inout/mjdata',
    method: 'get',
    data:row
  })
}
export const teacherInOutData = (row) => {
  return req({
    url: '/iot-wx/area/door/teacher/inout/mjdata',
    method: 'get',
    data:row
  })
}
export const teacherMjStatic = (row) => {
  return req({
    url: '/iot-wx/area/door/teacher/mjdata/statistics',
    method: 'get',
    data:row
  })
}
export const classInOutData = (row) => {
  return req({
    url: '/iot-wx/area/door/teacher/mjdata/class/statistics',
    method: 'get',
    data:row
  })
}
export const teacherInOutDetailsData = (row) => {
  return req({
    url: '/iot-wx/area/door/teacher/mjdata/class/student/inout/list',
    method: 'get',
    data:row
  })
}
export const teacherQjDetailsData = (row) => {
  return req({
    url: '/iot-wx/area/door/teacher/mjdata/class/student/receipt/list',
    method: 'get',
    data:row
  })
}