import {req} from "@/utils/request.js"

export const visitorList = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/visitor/list',
    method: 'get',
    data:row
  })
}

export const targetvisitorList = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/targetvisitor/list',
    method: 'get',
    data:row
  })
}