import {req} from "@/utils/request.js"

export const reqHot = (row) => {
  return req({
    url: '/iot-wx/lb/book/hot',
    method: 'get',
    data:row
  })
}
export const reqSearchBook = (row) => {
  return req({
    url: '/iot-wx/lb/book/search',
    method: 'get',
    data:row
  })
}
export const reqBookDetails = (row) => {
  return req({
    url: '/iot-wx/lb/book/details',
    method: 'get',
    data:row
  })
}
export const sendCollectBook = (row) => {
  return req({
    url: '/iot-wx/lb/book/collect',
    method: 'post',
    data:row
  })
}
export const reqBorrowList = (row) => {
  return req({
    url: '/iot-wx/lb/book/my-borrow/list',
    method: 'get',
    data:row
  })
}
export const reqCollectList = (row) => {
  return req({
    url: '/iot-wx/lb/book/collect',
    method: 'get',
    data:row
  })
}
export const reqBorrowBookDetails = (row) => {
  return req({
    url: '/iot-wx/lb/book/my-borrow/details',
    method: 'get',
    data:row
  })
}
export const sendRenewBook = (row) => {
  return req({
    url: '/iot-wx/lb/book/continue/borrow',
    method: 'post',
    data:row
  })
}
export const reqMyCardInfo = (row) => {
  return req({
    url: '/iot-wx/lb/book/my-certificate',
    method: 'get',
    data:row
  })
}