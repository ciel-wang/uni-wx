import {req} from "../../utils/request.js"
import store from '@/store/index.js'
// const { appId } = store.state.vuex_urlobj;

// 扫码登录
export const qrLogin = (row) => {
  return req({
    url: '/iot-wx/scan/qrcode/login-pc',
    method: 'get',
		data:row
  })
}
// 获取签名
export const reqWxSignature = (row) => {
  return req({
    url: '/iot-wx/jsapi/'+store.state.vuex_urlobj.appId+'/getJsapiSignature',
    method: 'get',
		data:row
  })
}
export const reqBasicInfo = () => {
  return req({
    url: '/iot-wx/index/data',
    method: 'get'
  })
}

/**
 * 充值
 */
export const recharge = (d) => {
  return req({
    url: '/iot-wx/recharge',
    method: 'post',
    data:d
  })
}

export const signPackage = () => {
  return req({
    url: `/iot-wx/common/${store.state.vuex_urlobj.appId}/signPackage`,
    method: 'get'
  })
}
export const register = (d) => {
  return req({
    url: '/iot-wx/user/bind',
    method: 'post',
    data:d
  })
}
export const getMunuAuth = () => {
  return req({
    url: '/iot-wx/user/menu/auth',
    method: 'get'
  })
}

// 根据code获取openid等小程序信息
export const getWxInfo = (data) => {
	return req({
	  url: `/iot-wx/mauser/${store.state.vuex_urlobj.appId}/login`,
	  method: 'get',
		data
	})
}

// 获取绑定后的token
export const getToken = (data) => {
	return req({
	  url: `/iot-wx/user/get-token`,
	  method: 'get',
		data
	})
}

// 获取所有学校数据
export const getSchoolList = (data) => {
	return req({
	  url: `/iot-app/schools`,
	  method: 'get',
		data
	})
}
// 获取钱包自定义名称
export const getWalletName = (row) => {
  return req({
    url: '/iot-wx/xf/wallet/info',
    method: 'get',
    data:row
  })
}
// 获取年班级数据
export const getGradeClassData = (row) => {
  return req({
    url: '/iot-wx/dorm/statistics/monitor/grade/class/list',
    method: 'get',
    data:row
  })
}
// 获取访客配置数据
export const initFkCfg = (row) => {
  return req({
    url: '/iot-wx/visitor/appointment/initdata',
    method: 'get',
    data:row
  })
}