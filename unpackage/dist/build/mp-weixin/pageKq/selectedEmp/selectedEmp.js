require('../common/vendor.js');(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pageKq/selectedEmp/selectedEmp"],{"482e":function(e,t,i){"use strict";(function(e){var a=i("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=a(i("448a")),o=i("25b0"),c={data:function(){return{come:"",moreParamQuery:"",deptDataList:[],breadcrumbList:[1],scrollLeft:999,isCheck:!0,newCheckList:[],deptName:"",receiptsForm:{},current:1,pageCount:1,loadStatus:"loading",isre:!1,maskShow:!1,details:{},parentId:0,schoolId:"",gradeId:"",classId:"",empType:"DEPT",empTypeLabel:"教师",empTypeList:[{value:"DEPT",name:"教师"},{value:"GRADE",name:"学生"}],empTypeShow:!1,btnDisplay:"flex",sourceType:""}},onLoad:function(t){var i=this;if(this.current=1,this.pageCount=1,this.deptDataList=[],t.mykq&&(this.mykq=t.mykq),this.sourceType=t.sourceType,this.type=t.type,this.come=t.come,this.receiptsForm=e.getStorageSync("receiptsForm_key"),"empId"==t.come||"duplicateEmpIds"==t.come||"together"==t.come?(t.parentId?this.parentId=t.parentId:this.parentId=0,this.schoolData()):"auditEmpIds"==t.come?(0,o.getAuditData)({empId:this.receiptsForm.empId,typeRoleId:this.receiptsForm.typeRoleId}).then((function(e){if(200==e.data.code){var t=e.data.data.auditEmps;t.forEach((function(e){e.label=e.empName+" "+e.empCode,e.value=e.auditEmpId})),i.deptDataList=t,i.isChecked()}})):"details"==t.come&&(this.details=JSON.parse(t.form),(0,o.getAuditData)({empId:this.details.empId,typeRoleId:this.details.typeRoleId}).then((function(e){if(200==e.data.code){var t=e.data.data.auditEmps;t.forEach((function(e){e.label=e.empName+" "+e.empCode,e.value=e.auditEmpId})),i.deptDataList=t,i.isChecked()}}))),this.receiptsForm){if("empId"==t.come){var a=this.receiptsForm;this.newCheckList=[{empName:a.empName,id:a.empId,value:a.empId}]}if("duplicateEmpIds"==t.come&&(this.receiptsForm.duplicateEmpList?this.newCheckList=this.receiptsForm.duplicateEmpList:this.newCheckList=[]),"together"==t.come){var s=this.receiptsForm;s.receiptTogether?this.newCheckList=s.receiptTogether:this.newCheckList=[]}if("auditEmpIds"==t.come){var c=this.receiptsForm;this.newCheckList=[{auditEmpName:c.auditEmpName,value:c.auditEmpIds}]}this.isChecked()}else this.receiptsForm={}},methods:{schoolData:function(){var e=this;this.deptDataList=[],(0,o.getSchoolData)().then((function(t){t.data.data.forEach((function(e){e.label=e.schoolName,e.value=e.id,e.count=e.count||""})),e.deptDataList=t.data.data}))},submit:function(){if(this.newCheckList.length<=0)this.$refs.uToast.show({message:"请选择一条数据",type:"error"});else{var t=(0,s.default)(this.newCheckList);if("empId"==this.come&&(this.receiptsForm.empName=t[0].empName,this.receiptsForm.empId=t[0].value,t[0].deptName?this.receiptsForm.deptName=t[0].deptName:this.receiptsForm.deptName=this.deptName,this.receiptsForm.empType="DEPT"==this.empType?2:1),"duplicateEmpIds"==this.come){this.receiptsForm.duplicateEmpList=t;var i=[];t.forEach((function(e){i.push(e.value)})),this.receiptsForm["duplicateEmpIds"]=i.join(",")}"together"==this.come&&(this.receiptsForm.receiptTogether=t),"auditEmpIds"==this.come&&(this.receiptsForm.auditEmpName=t[0].empName,this.receiptsForm.auditEmpIds=t[0].auditEmpId),"details"==this.come?e.redirectTo({url:"../receiptDetail/receiptDetail?who=".concat(this.details.who,"&id=").concat(this.details.id,"&form=").concat(JSON.stringify(t))}):(e.setStorageSync("receiptsForm_key",this.receiptsForm),e.redirectTo({url:"../leave/leave?type=".concat(this.type,"&come=").concat(this.mykq,"&sourceType=").concat(this.sourceType)}))}},initData:function(){var e=this;this.deptDataList=[];var t={};t["moreParamQuery"]=this.moreParamQuery,t["parentId"]=this.parentId,t["schoolId"]=this.schoolId,t["sourceType"]=this.empType,t["gradeId"]=this.gradeId,t["classId"]=this.classId,(0,o.getDeptList)(t).then((function(t){if(200==t.data.code){var i=t.data.data;"GRADE"==e.empType?(i.grades&&(i.grades.forEach((function(e){e.label=e.gcName,e.value=e.gradeId,e.count=e.classCount||0})),e.deptDataList=i.grades),i.classs&&(i.classs.forEach((function(e){e.label=e.gcName,e.value=e.classId,e.count=e.empCount||0})),e.deptDataList=i.classs),i.emps&&(i.emps.forEach((function(e){e.label=e.empName,e.value=e.empId})),e.deptDataList=i.emps)):(i.depts.forEach((function(e){e.label=e.deptName,e.value=e.deptId,e.count=e.deptEmpCount||0})),i.emps.forEach((function(e){e.label=e.empName+" "+e.empCode,e.value=e.id})),i.depts.length||(e.deptDataList=i.emps),i.emps.length||(e.deptDataList=i.depts),i.depts.length&&i.emps.length&&(e.deptDataList=i.depts.concat(i.emps))),console.log(e.deptDataList),e.isChecked()}}))},search:function(){var e=this;1==this.current&&(this.deptDataList=[]);var t=this.breadcrumbList.filter((function(e){return"搜索结果"==e.label}));t.length||this.breadcrumbList.push({label:"搜索结果"}),this.isre=!0;var i={};i["moreParamQuery"]=this.moreParamQuery,i["parentId"]=this.parentId,i["schoolId"]=this.schoolId,i["sourceType"]=this.empType,i["gradeId"]=this.gradeId,i["classId"]=this.classId,i["current"]=this.current,i["size"]=20,this.loadStatus="loading",this.maskShow=!0,(0,o.searchEmp)(i).then((function(t){if(e.maskShow=!1,200==t.data.code){var i=t.data.data;e.pageCount=i.pages,i.records.forEach((function(e){e.label=e.empName+" "+e.empCode,e.value=e.id,e.deptName=e.deptName?e.deptName:e.gradeName+e.className})),e.deptDataList=[].concat((0,s.default)(e.deptDataList),(0,s.default)(i.records)),e.isChecked()}})).catch((function(t){e.maskShow=!1,e.$refs.uToast.show({message:t,type:"error"})}))},scrolltolower:function(){this.current>=this.pageCount?this.loadStatus="nomore":(this.current=++this.current,this.search())},backTree:function(e,t){var i=this;if(-1==t)return this.isre=!1,this.current=1,this.parentId="",this.schoolData(),i.breadcrumbList.splice(1,6666),void(this.moreParamQuery="");this.current=1,i.breadcrumbList.forEach((function(e,a){a>t&&i.breadcrumbList.splice(a,6666)})),e.schoolName&&(this.schoolId=e.id,this.gradeId="",this.classId="",this.parentId=0,this.initData()),2==e.gctype&&(this.classId="",this.gradeId=e.gradeId,this.initData())},checkbox:function(e,t){var i=this,a=this,s=!a.deptDataList[t].checked;if(a.$set(a.deptDataList[t],"checked",s),"empId"!=this.come&&"auditEmpIds"!=this.come&&"details"!=this.come||(a.newCheckList=[a.deptDataList[t]],this.deptDataList.forEach((function(e,s){e.value!=i.deptDataList[t].value&&a.$set(a.deptDataList[s],"checked",!1)}))),"duplicateEmpIds"==this.come||"together"==this.come)if(s)a.newCheckList.push(e);else{var o=[];a.newCheckList.forEach((function(t){t.value!=e.value&&o.push(t)})),a.newCheckList=o}},isChecked:function(){for(var e=0,t=this.deptDataList.length;e<t;e++)for(var i=0,a=this.newCheckList.length;i<a;i++){if(this.newCheckList[i].value==this.deptDataList[e].value){this.$set(this.deptDataList[e],"checked",!0);break}this.$set(this.deptDataList[e],"checked",!1)}},deptCellClick:function(e){e.schoolName&&(this.schoolId=e.id,"DEPT"==this.empType&&(this.parentId=0),this.initData()),2==e.gctype&&(this.gradeId=e.gradeId,this.initData()),1==e.gctype&&(this.classId=e.classId,this.deptName=e.gcName,this.initData()),e.deptId&&(this.deptName=e.deptName,this.parentId=e.deptId,this.initData()),e.empName||this.breadcrumbList.push(e)},backClick:function(){"details"==this.come?e.redirectTo({url:"../receiptDetail/receiptDetail?id=".concat(this.details.id,"&who=").concat(this.details.who)}):e.redirectTo({url:"../leave/leave?type=".concat(this.type,"&sourceType=").concat(this.sourceType)})},empTypeConfirm:function(e){this.empType=e.value,this.empTypeLabel=e.name,this.breadcrumbList=[1],this.schoolData(),this.btnDisplay="flex"}}};t.default=c}).call(this,i("543d")["default"])},"5acf":function(e,t,i){},"73b7":function(e,t,i){"use strict";i.r(t);var a=i("482e"),s=i.n(a);for(var o in a)["default"].indexOf(o)<0&&function(e){i.d(t,e,(function(){return a[e]}))}(o);t["default"]=s.a},a7e3:function(e,t,i){"use strict";i.d(t,"b",(function(){return s})),i.d(t,"c",(function(){return o})),i.d(t,"a",(function(){return a}));var a={uIcon:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-icon/u-icon")]).then(i.bind(null,"1e79"))},uSearch:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-search/u-search")]).then(i.bind(null,"424e"))},uEmpty:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-empty/u-empty")]).then(i.bind(null,"cf37"))},myCard:function(){return i.e("components/my-card").then(i.bind(null,"2227"))},uCellGroup:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-cell-group/u-cell-group")]).then(i.bind(null,"f7ef"))},uCell:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-cell/u-cell")]).then(i.bind(null,"0137"))},myButton:function(){return i.e("components/my-button").then(i.bind(null,"e84c"))},uActionSheet:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-action-sheet/u-action-sheet")]).then(i.bind(null,"ff2a"))},uOverlay:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-overlay/u-overlay")]).then(i.bind(null,"3776"))},uToast:function(){return i.e("uni_modules/uview-ui/components/u-toast/u-toast").then(i.bind(null,"b688"))}},s=function(){var e=this,t=e.$createElement,i=(e._self._c,e.__map(e.breadcrumbList,(function(t,i){var a=e.__get_orig(t),s=0==i?e.breadcrumbList.length:null,o=0!=i?e.breadcrumbList.length:null;return{$orig:a,g0:s,g1:o}}))),a=e.deptDataList.length,s=0!=a?e.__map(e.deptDataList,(function(t,i){var a=e.__get_orig(t);return{$orig:a,a0:{"text-align":"left","margin-left":"10rpx"}}})):null,o=e.deptDataList.length;e._isMounted||(e.e0=function(t){e.empTypeShow=!0,e.btnDisplay="none"},e.e1=function(t){e.empTypeShow=!1}),e.$mp.data=Object.assign({},{$root:{l0:i,g2:a,l1:s,g3:o}})},o=[]},bc8b:function(e,t,i){"use strict";(function(e,t){var a=i("4ea4");i("5495");a(i("66fd"));var s=a(i("e2df"));e.__webpack_require_UNI_MP_PLUGIN__=i,t(s.default)}).call(this,i("bc2e")["default"],i("543d")["createPage"])},e2d4:function(e,t,i){"use strict";var a=i("5acf"),s=i.n(a);s.a},e2df:function(e,t,i){"use strict";i.r(t);var a=i("a7e3"),s=i("73b7");for(var o in s)["default"].indexOf(o)<0&&function(e){i.d(t,e,(function(){return s[e]}))}(o);i("e2d4");var c=i("f0c5"),n=Object(c["a"])(s["default"],a["b"],a["c"],!1,null,"1ad58a53",null,!1,a["a"],void 0);t["default"]=n.exports}},[["bc8b","common/runtime","common/vendor","pageKq/common/vendor"]]]);