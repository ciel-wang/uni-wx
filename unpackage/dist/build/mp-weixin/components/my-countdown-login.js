(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-countdown-login"],{"7dee":function(n,e,t){"use strict";t.r(e);var u=t("948c"),o=t.n(u);for(var i in u)["default"].indexOf(i)<0&&function(n){t.d(e,n,(function(){return u[n]}))}(i);e["default"]=o.a},9101:function(n,e,t){"use strict";t.r(e);var u=t("ed8c"),o=t("7dee");for(var i in o)["default"].indexOf(i)<0&&function(n){t.d(e,n,(function(){return o[n]}))}(i);var r=t("f0c5"),a=Object(r["a"])(o["default"],u["b"],u["c"],!1,null,null,null,!1,u["a"],void 0);e["default"]=a.exports},"948c":function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t={name:"my-countdown-login",data:function(){return{show:!1,timer:null,dateTime:3}},destroyed:function(){clearInterval(this.timer)},methods:{start:function(){var e=this;this.show=!0,this.dateTime=3;var t=setInterval((function(){e.dateTime<=1?(n.redirectTo({url:"/pages/login/login"}),e.show=!1,clearInterval(t)):e.dateTime-=1}),1e3)}}};e.default=t}).call(this,t("543d")["default"])},ed8c:function(n,e,t){"use strict";t.d(e,"b",(function(){return o})),t.d(e,"c",(function(){return i})),t.d(e,"a",(function(){return u}));var u={uPopup:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-popup/u-popup")]).then(t.bind(null,"3d93"))}},o=function(){var n=this.$createElement;this._self._c},i=[]}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-countdown-login-create-component',
    {
        'components/my-countdown-login-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("9101"))
        })
    },
    [['components/my-countdown-login-create-component']]
]);
