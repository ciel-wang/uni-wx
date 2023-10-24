import config from '../config/index.js'
import store from '@/store/index.js'

const BASE_URL = config.baseUrl;

export const req = (opt) => {
  const { token,appId,openid,sid } = store.state.vuex_urlobj;
  
	return new Promise((resolve, reject) => {
		uni.request({
      url:`${BASE_URL}${opt.url}`,
			method:opt.method || 'GET',
			data:opt.data || {},
			header:{
				token:token || "",
        appId:appId || 'wx53a0acf99c897586',
        openid:openid || '',
				sid:sid
			},
			success(res) {
        if(res.data.msg == 'NO_REGISTER_USER'){
          uni.showToast({
            title: '请先注册',
            duration: 2000,
            icon:"error",
            success() {
              setTimeout(() => {
                uni.reLaunch({ url:'/pages/login/login' })
              },2000)
            }
          });
          reject(res.data.msg)
        }
				if(res.data.code != 200){
					reject(res.data.msg)
				}
				resolve(res)
			},
			fail(err) {
				reject(err)
			},
		})
	});
}
