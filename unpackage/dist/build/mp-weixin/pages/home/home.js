(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/home/home"],{1007:function(e,n,t){"use strict";t.d(n,"b",(function(){return u})),t.d(n,"c",(function(){return r})),t.d(n,"a",(function(){return o}));var o={uAvatar:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-avatar/u-avatar")]).then(t.bind(null,"b1e7"))},uIcon:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-icon/u-icon")]).then(t.bind(null,"1e79"))},myCard:function(){return t.e("components/my-card").then(t.bind(null,"2227"))},uCell:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-cell/u-cell")]).then(t.bind(null,"0137"))},uTabbar:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-tabbar/u-tabbar")]).then(t.bind(null,"2e5b"))},uTabbarItem:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-tabbar-item/u-tabbar-item")]).then(t.bind(null,"ef6a"))},uModal:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-modal/u-modal")]).then(t.bind(null,"071d"))},myCountdownLogin:function(){return t.e("components/my-countdown-login").then(t.bind(null,"9101"))},uToast:function(){return t.e("uni_modules/uview-ui/components/u-toast/u-toast").then(t.bind(null,"b688"))}},u=function(){var e=this,n=e.$createElement,t=(e._self._c,e.userInfo.faceUrl&&e.userInfo.faceUrl+"?"+(new Date).getTime());e._isMounted||(e.e0=function(n){return e.$u.route("/pages/login/login")},e.e1=function(n){return e.$u.route("/pageZ/my-notification/my-notification")},e.e2=function(n){e.modalShow=!0,e.modalContent="您确定要清除缓存？",e.btnType="clear"},e.e3=function(n){return e.$u.route("/pageZ/help-feedback/help-feedback")},e.e4=function(n){return e.$u.route("/pages/home/contact-us/contact-us")},e.e5=function(n){return e.$u.route("/pages/index/index")},e.e6=function(n){e.modalShow=!1},e.e7=function(n){e.modalShow=!1}),e.$mp.data=Object.assign({},{$root:{g0:t}})},r=[]},"1bb8":function(e,n,t){"use strict";t.r(n);var o=t("1007"),u=t("20c5");for(var r in u)["default"].indexOf(r)<0&&function(e){t.d(n,e,(function(){return u[e]}))}(r);t("32b8");var i=t("f0c5"),a=Object(i["a"])(u["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],void 0);n["default"]=a.exports},"20c5":function(e,n,t){"use strict";t.r(n);var o=t("26a0"),u=t.n(o);for(var r in o)["default"].indexOf(r)<0&&function(e){t.d(n,e,(function(){return o[e]}))}(r);n["default"]=u.a},"26a0":function(e,n,t){"use strict";(function(e,o){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var u=t("55ed"),r=t("38b8"),i=t("25d6"),a={data:function(){return{userInfo:{},cardTitle:"卡片挂失",btnType:"",modalShow:!1,modalContent:""}},onLoad:function(){},onShow:function(){this.initData()},methods:{initData:function(){var e=this;this.vuex_urlobj.token?(0,u.userInfo)().then((function(n){var t=n.data.data;t.bindEmpTypeName=1==t.bindEmpType?"学生":2==t.bindEmpType?"教职工":3==t.bindEmpType?"家长":"",e.cardTitle=4==t.cardState?"卡片解挂":"卡片挂失",e.userInfo=t})):this.userInfo=this.vuex_wxInfo},modalConfirm:function(){var n=this;if("clear"==this.btnType)return e.removeStorageSync("applyForm_key"),e.removeStorageSync("intervieweesHistory_key"),e.removeStorageSync("visitHistory_key"),e.removeStorageSync("goodsHistory_key"),void e.removeStorageSync("vuex_selectMenuKey");"LossReport"!=this.btnType?"Unregister"!=this.btnType||(0,u.lossUnregister)().then((function(e){n.$refs.uToast.show({message:e.data.msg,type:"success"}),n.initData()})).catch((function(e){n.$refs.uToast.show({message:e,type:"error"})})):(0,u.reportloss)().then((function(e){n.$refs.uToast.show({message:e.data.msg,type:"success"}),n.initData()})).catch((function(e){n.$refs.uToast.show({message:e,type:"error"})}))},cardItemClick:function(n){var t=this;if(!this.vuex_urlobj.token)return this.$refs.mycountdownloginRef.start();if("info"===n&&e.navigateTo({url:"./personal/personal"}),"scan"===n){if(2!=this.userInfo.bindEmpType)return this.$u.toast("此功能暂未开放");o.scanCode({success:function(e){var n=e.result;if(!n)return t.$refs.uToast.show({message:"未识别到有效值，请重试！",type:"warning"});(0,i.qrLogin)({qrcode:n}).then((function(e){t.$refs.uToast.show({message:e.data.msg,type:"success"})})).catch((function(e){t.$refs.uToast.show({message:e,type:"error"})}))}})}if("card"===n){var u=(0,r.getItemAuth)("XF_CARD_STATE");if(0==u.enable)return this.$u.toast("此功能暂未开放");2==this.userInfo.cardState?(this.modalTitle="您确定要进行卡片挂失？",this.btnType="LossReport",this.modalShow=!0):4==this.userInfo.cardState?(this.modalTitle="您确定要进行卡片解挂？",this.btnType="Unregister",this.modalShow=!0):this.$refs.uToast.show({message:"卡片异常，请联系管理员",type:"error"})}if("account"===n){var a=(0,r.getItemAuth)("XF_PROPERTY");if(0==a.enable)return void this.$u.toast("此功能暂未开放");this.$u.route("/pages/xf/wallet/index",{sourceType:"home"})}},handlerTabbar:function(n){n!=this.tabbarIndex&&e.switchTab({url:"/pages/index/index"})}}};n.default=a}).call(this,t("543d")["default"],t("bc2e")["default"])},"32b8":function(e,n,t){"use strict";var o=t("66c0"),u=t.n(o);u.a},"66c0":function(e,n,t){},c1ba:function(e,n,t){"use strict";(function(e,n){var o=t("4ea4");t("5495");o(t("66fd"));var u=o(t("1bb8"));e.__webpack_require_UNI_MP_PLUGIN__=t,n(u.default)}).call(this,t("bc2e")["default"],t("543d")["createPage"])}},[["c1ba","common/runtime","common/vendor"]]]);