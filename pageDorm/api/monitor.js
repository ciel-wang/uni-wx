import {req} from "@/utils/request.js"

export const getStatic = (row) => {
  return req({
    url: '/iot-wx/dorm/statistics/monitor/data',
    method: 'get',
    data:row
  })
}
export const getTeacherGradeData = (row) => {
  return req({
    url: '/iot-wx/dorm/statistics/monitor/data/list',
    method: 'get',
    data:row
  })
}
export const getStudentmonitorDetails = (row) => {
  return req({
    url: '/iot-wx/dorm/statistics/monitor/stu/details/list',
    method: 'get',
    data:row
  })
}
export const getClassmonitorDetails = (row) => {
  return req({
    url: '/iot-wx/dorm/statistics/monitor/class/details/list',
    method: 'get',
    data:row
  })
}
export const getFloorReceiptDetails = (row) => {
  return req({
    url: '/iot-wx/dorm/statistics/monitor/floor/receipt/details/list',
    method: 'get',
    data:row
  })
}
export const getFloorErrDetails = (row) => {
  return req({
    url: '/iot-wx/dorm/statistics/monitor/floor/erremp/details/list',
    method: 'get',
    data:row
  })
}