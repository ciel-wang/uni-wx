import {req} from "../utils/request.js"

export const payQrcode = (row) => {
  return req({
    url: '/iot-wx/xf/emp/pay/qrcode',
    method: 'get',
    data:row
  })
}
export const empWalletAmount = (row) => {
  return req({
    url: '/iot-wx/xf/emp/wallet/amount',
    method: 'get',
    data:row
  })
}
export const empAccountBill = (row) => {
  return req({
    url: '/iot-wx/xf/emp/account/bill',
    method: 'get',
    data:row
  })
}
export const empAccountBillDetails = (row) => {
  return req({
    url: '/iot-wx/xf/emp/account/bill/details',
    method: 'get',
    data:row
  })
}
export const getXfStatistics = (row) => {
  return req({
    url: '/iot-wx/xf/statistics',
    method: 'get',
    data:row
  })
}
export const getXfIncomeStatistics = (row) => {
  return req({
    url: '/iot-wx/xf/emp/income/statistics',
    method: 'get',
    data:row
  })
}
export const getXfOutcomeStatistics = (row) => {
  return req({
    url: '/iot-wx/xf/emp/outcome/statistics',
    method: 'get',
    data:row
  })
}

// 提现
export const sendWithdraw = (row) => {
  return req({
    url: '/iot-wx/cash-withdrawal/submit',
    method: 'post',
    data:row
  })
}
// 提现页面初始化接口
export const getWithdrawInfo = (row) => {
  return req({
    url: '/iot-wx/cash-withdrawal/initdata',
    method: 'get',
    data:row
  })
}
export const getWithdrawList = (row) => {
  return req({
    url: '/iot-wx/cash-withdrawal/list',
    method: 'get',
    data:row
  })
}
export const getWithdrawDetails = (row) => {
  return req({
    url: '/iot-wx/cash-withdrawal/details',
    method: 'get',
    data:row
  })
}