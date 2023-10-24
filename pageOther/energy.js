import {req} from "../utils/request.js"

export const reqBill = (row) => {
  return req({
    url: '/iot-wx/sdctrl/data/person/details',
    method: 'get',
    data:row
  })
}

export const recharge = (row) => {
  return req({
    url: '/iot-wx/sdctrl/wallet/transfer',
    method: 'post',
    data:row
  })
}
export const transferXf = (row) => {
  return req({
    url: '/iot-wx/sdctrl/wallet/transfer-xf',
    method: 'post',
    data:row
  })
}