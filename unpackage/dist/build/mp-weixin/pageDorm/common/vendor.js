(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pageDorm/common/vendor"],{a0dc:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getTeacherGradeData=e.getStudentmonitorDetails=e.getStatic=e.getFloorReceiptDetails=e.getFloorErrDetails=e.getClassmonitorDetails=void 0;var o=r("058c");e.getStatic=function(t){return(0,o.req)({url:"/iot-wx/dorm/statistics/monitor/data",method:"get",data:t})};e.getTeacherGradeData=function(t){return(0,o.req)({url:"/iot-wx/dorm/statistics/monitor/data/list",method:"get",data:t})};e.getStudentmonitorDetails=function(t){return(0,o.req)({url:"/iot-wx/dorm/statistics/monitor/stu/details/list",method:"get",data:t})};e.getClassmonitorDetails=function(t){return(0,o.req)({url:"/iot-wx/dorm/statistics/monitor/class/details/list",method:"get",data:t})};e.getFloorReceiptDetails=function(t){return(0,o.req)({url:"/iot-wx/dorm/statistics/monitor/floor/receipt/details/list",method:"get",data:t})};e.getFloorErrDetails=function(t){return(0,o.req)({url:"/iot-wx/dorm/statistics/monitor/floor/erremp/details/list",method:"get",data:t})}},fea9:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.submit=e.repeat=e.reject=e.getRecordsDetails=e.getRecords=e.getFloorZtree=e.finish=e.cancel=e.agree=void 0;var o=r("058c");e.getFloorZtree=function(t){return(0,o.req)({url:"/iot-wx/dorm/floor/tree",method:"get",data:t})};e.submit=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/submit",method:"post",data:t})};e.getRecords=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/list",method:"get",data:t})};e.getRecordsDetails=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/details",method:"get",data:t})};e.cancel=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/cancel",method:"post",data:t})};e.reject=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/reject",method:"post",data:t})};e.agree=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/handling",method:"post",data:t})};e.finish=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/finish",method:"post",data:t})};e.repeat=function(t){return(0,o.req)({url:"/iot-wx/dorm/repair/repeat/submit",method:"post",data:t})}}}]);