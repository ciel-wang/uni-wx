require('../common/vendor.js');(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pageXf/statistics/statistics"],{"0d7c":function(e,t,a){"use strict";a.d(t,"b",(function(){return o})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){return n}));var n={uIcon:function(){return Promise.all([a.e("common/vendor"),a.e("uni_modules/uview-ui/components/u-icon/u-icon")]).then(a.bind(null,"1e79"))},qiunDataCharts:function(){return Promise.all([a.e("common/vendor"),a.e("uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts")]).then(a.bind(null,"4ab8"))},uDatetimePicker:function(){return Promise.all([a.e("common/vendor"),a.e("uni_modules/uview-ui/components/u-datetime-picker/u-datetime-picker")]).then(a.bind(null,"2990"))}},o=function(){var e=this,t=e.$createElement,a=(e._self._c,e.$u.guid()),n=e.$u.guid(),o=e.$u.guid(),i=(new Date).getTime();e._isMounted||(e.e0=function(t){e.pickerShow=!0},e.e1=function(t){e.activeName=1,e.initData()},e.e2=function(t){e.activeName=2,e.initData()},e.e3=function(t){e.pickerShow=!1}),e.$mp.data=Object.assign({},{$root:{a0:{xAxis:{format:"monthXaxis",marginTop:10},yAxis:{disabled:!0,disableGrid:!0}},g0:a,a1:{legend:{position:"right"},dataLabel:!1,padding:[5,35,5,5]},g1:n,g2:o,g3:i}})},i=[]},"11af":function(e,t,a){"use strict";a.r(t);var n=a("0d7c"),o=a("c28c");for(var i in o)["default"].indexOf(i)<0&&function(e){a.d(t,e,(function(){return o[e]}))}(i);a("2876");var c=a("f0c5"),l=Object(c["a"])(o["default"],n["b"],n["c"],!1,null,"55a5dfe0",null,!1,n["a"],void 0);t["default"]=l.exports},"1f6a":function(e,t,a){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a("07de"),o={data:function(){return{AccTransTime:e.$u.timeFormat(new Date,"yyyy年mm月"),date:e.$u.timeFormat(new Date,"yyyy-mm"),pickerShow:!1,activeName:1,localdata:[],chartData:{},xfCount:0,xfTotalMoney:0,devXfDatas:[],chartData2:{}}},onLoad:function(){this.initData()},methods:{initData:function(){var e=this;this.localdata=[],1==this.activeName?(0,n.getXfIncomeStatistics)({date:this.date}).then((function(t){if(200==t.data.code){var a=t.data.data;e.xfTotalMoney=a.inComeData.rechargeTotalMoney,e.xfCount=a.inComeData.rechargeCount;var n=a.monthStatisticsData.map((function(e){return{value:1*e.inComeTotalMoney,text:e.month}})),o=[{value:1*a.inComeData.personRechargeMoney==0?0:1*a.inComeData.personRechargeMoney,name:"个人充值(".concat(1*a.inComeData.personRechargeMoney==0?0:1*a.inComeData.personRechargeMoney,")")},{value:1*a.inComeData.subsidyRechargeMoney,name:"补贴充值(".concat(1*a.inComeData.subsidyRechargeMoney,")")},{value:1*a.inComeData.otherRechargeMoney,name:"第三方充值(".concat(1*a.inComeData.otherRechargeMoney,")")},{value:1*a.inComeData.dkjcMoney,name:"消费退款(".concat(1*a.inComeData.dkjcMoney,")")}];e.localdata=n.reverse(),e.chartData={series:[{data:o}]}}else e.localdata=[],e.chartData={series:[{data:[{value:0,name:"个人充值"},{value:0,name:"补贴充值"},{value:0,name:"第三方充值"},{value:0,name:"消费退款"}]}]}})):(0,n.getXfOutcomeStatistics)({date:this.date}).then((function(t){if(200==t.data.code){var a=t.data.data;e.xfTotalMoney=(1*a.outComeData.xfTotalMoney+1*a.outComeData.mngMoney).toFixed(2),e.xfCount=a.outComeData.xfCount;var n=[];a.monthStatisticsData.forEach((function(e){n.push({value:1*e.outComeTotalMoney,text:e.month})})),e.localdata=n.reverse(),a.typeStatisticsData.forEach((function(e){4==e.type&&(e.iconName="xfzhangdan-canting",e.iconColor="#F42C2F"),9==e.type&&(e.iconName="xfzhangdan-tixian",e.iconColor="#DC9E52",e.name="节能钱包转出"),5!=e.type&&6!=e.type&&8!=e.type&&10!=e.type&&"glf"!=e.type&&12!=e.type||(e.iconName="xfzhangdan-gongsi",e.iconColor="#1BBB71",5==e.type?e.name="个人钱包退款":6==e.type?e.name="销户退款":8==e.type?e.name="补贴清零":10==e.type?e.name="补贴退款":"glf"==e.type?e.name="管理费":12==e.type&&(e.name="第三方提现"))})),e.devXfDatas=a.typeStatisticsData;var o=a.zcStatisticsData,i=1*o.btMoneyTotal+1*o.btqlMoneyTotal+1*o.mngMoneyTotal+1*o.txMoneyTotal+1*o.xfMoneyTotal+1*o.xhMoneyTotal+1*o.dsftxMoneyTotal+1*o.zzMoneyTotal,c=[{value:1*o.btMoneyTotal,name:"补贴退款",legendText:"补贴退款(".concat(i>0&&o.btMoneyTotal>0?(100*o.btMoneyTotal/i).toFixed(1):0,"%)")},{value:1*o.btqlMoneyTotal,name:"补贴清零",legendText:"补贴清零(".concat(i>0&&o.btqlMoneyTotal>0?(100*o.btqlMoneyTotal/i).toFixed(1):0,"%)")},{value:1*o.mngMoneyTotal,name:"管理费",legendText:"管理费(".concat(i>0&&o.mngMoneyTotal>0?(100*o.mngMoneyTotal/i).toFixed(1):0,"%)")},{value:1*o.txMoneyTotal,name:"提现",legendText:"提现(".concat(i>0&&o.txMoneyTotal>0?(100*o.txMoneyTotal/i).toFixed(1):0,"%)")},{value:1*o.xfMoneyTotal,name:"消费",legendText:"消费(".concat(i>0&&o.xfMoneyTotal>0?(100*o.xfMoneyTotal/i).toFixed(1):0,"%)")},{value:1*o.xhMoneyTotal,name:"销户退款",legendText:"销户退款(".concat(i>0&&o.xhMoneyTotal>0?(100*o.xhMoneyTotal/i).toFixed(1):0,"%)")},{value:1*o.dsftxMoneyTotal,name:"第三方提现",legendText:"第三方提现(".concat(i>0&&o.dsftxMoneyTotal>0?(100*o.dsftxMoneyTotal/i).toFixed(1):0,"%)")},{value:1*o.zzMoneyTotal,name:"节能钱包转出",legendText:"节能钱包转出(".concat(i>0&&o.zzMoneyTotal>0?(100*o.zzMoneyTotal/i).toFixed(1):0,"%)")}];e.chartData2={series:[{data:c}]}}else e.localdata=[],e.devXfDatas=[]}))},getChartItem:function(e){var t=e.currentIndex,a=e.opts,n=t.index;if(n>=0){var o=a.categories,i=o[n].split("-");this.AccTransTime=i[0]+"年"+i[1]+"月",this.date=o[n],this.initData()}},pickerConfirm:function(t){this.AccTransTime=e.$u.timeFormat(t.value,"yyyy年mm月"),this.date=e.$u.timeFormat(t.value,"yyyy-mm"),this.initData()},backClick:function(){e.redirectTo({url:"../bill/bill"})}}};t.default=o}).call(this,a("543d")["default"])},2876:function(e,t,a){"use strict";var n=a("df5e"),o=a.n(n);o.a},7329:function(e,t,a){"use strict";(function(e,t){var n=a("4ea4");a("5495");n(a("66fd"));var o=n(a("11af"));e.__webpack_require_UNI_MP_PLUGIN__=a,t(o.default)}).call(this,a("bc2e")["default"],a("543d")["createPage"])},c28c:function(e,t,a){"use strict";a.r(t);var n=a("1f6a"),o=a.n(n);for(var i in n)["default"].indexOf(i)<0&&function(e){a.d(t,e,(function(){return n[e]}))}(i);t["default"]=o.a},df5e:function(e,t,a){}},[["7329","common/runtime","common/vendor","pageXf/common/vendor"]]]);