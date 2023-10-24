	import store from '@/store/index.js'
	import bg1 from '@/static/images/iconbg/1.png'
	import bg2 from '@/static/images/iconbg/2.png'
	import bg3 from '@/static/images/iconbg/3.png'
	import bg4 from '@/static/images/iconbg/4.png'
	import bg5 from '@/static/images/iconbg/5.png'
	
	export const iconArr = [bg4,bg1,bg2,bg3,bg5,bg2,bg1,bg4,bg1,bg4,bg5];
	
	export const allApplicate = {
		visitorArrLabel:'访客',
		ApprovalFlowArrLabel:'审批流',
		xfArrLabel:'消费',
		PassageArrLabel:'通行',
		dormArrLabel:'宿舍',
		energyArrLabel:'节能',
		libraryArrLabel:'图书馆',
		visitorArr:[
			{
				id:1,
				icon: 'custom-icon custom-icon-yuyueshenqing',
				name: '访客预约',
				url:'/pageFk/apply/apply',
				key:"FK_APPOINTMENT",
				display:true,
				bgIndex:bg1
			},
			{
				id:2,
				icon: 'custom-icon custom-icon-fk-yaoyue',
				name: '教职工邀约',
				url:'/pageFk/apply/apply',
				key:"FK_INVITATION",
				display:true,
				bgIndex:bg3
			},
			{
				id:3,
				icon: 'custom-icon custom-icon-yuyuejilu',
				name: '预约单据',
				url:'/pageFk/appointmentrecord/appointmentrecord',
				key:"FK_RESERVATION_RECORD",
				display:true,
				bgIndex:bg5
			},
			{
				id:4,
				icon: 'custom-icon custom-icon-yuyuejilu',
				name: '邀约单据',
				url:'/pageFk/inviteRecord/inviteRecord',
				key:"FK_INVITATION_RECORD",
				display:true,
				bgIndex:bg2
			},
			{
				id:5,
				icon: 'custom-icon custom-icon-shujufenxi',
				name: '图表分析',
				url:'/pageFk/visitor-chart/visitor-chart',
				key:"FK_CHART_ANALYSIS",
				display:true,
				bgIndex:bg3
			},
		],
		ApprovalFlowArr:[
			{
				id:10,
				icon: 'custom-icon custom-icon-icon-leave',
				name: '请假',
				key:"SP_VACATE",
				url:'/pageKq/leave/leave?type=1',
				display:true,
				bgIndex:bg1
			},
			{
				id:11,
				icon: 'custom-icon custom-icon-chuchashenqing',
				name: '出差',
				key:"SP_EVECTION",
				url:'/pageKq/leave/leave?type=2',
				display:true,
				bgIndex:bg4
			},
			{
				id:12,
				icon: 'custom-icon custom-icon-jiabantaojian',
				name: '加班',
				key:"SP_OVERTIME",
				url:'/pageKq/leave/leave?type=3',
				display:true,
				bgIndex:bg3
			},
			{
				id:13,
				icon: 'custom-icon custom-icon-icon-cardReissue',
				name: '补卡',
				key:"SP_RETROACTIVE_RECORD",
				url:'/pageKq/leave/leave?type=4',
				display:true,
				bgIndex:bg1
			},
			{
				id:14,
				icon:'custom-icon custom-icon-danju',
				name:"OA单据",
				url:"/pageKq/oabills/oabills",
				key:"SP_OABILLS",
				display:true,
				bgIndex:bg5
			},
			{
				id:15,
				icon: 'custom-icon custom-icon-paiban',
				name: '排班结果',
				key:"KQ_SCHEDULING_RESULTS",
				url:"/pageKq/mykq/mykq",
				display:true,
				bgIndex:bg2
			}
		],
		xfArr:[
			{
				id:20,
				icon: 'custom-icon custom-icon-zichan',
				name: '钱包',
				key:"XF_PROPERTY",
				url:"/pageXf/wallet/wallet",
				display:true,
				bgIndex:bg4
			},
			{
				id:21,
				icon: 'custom-icon custom-icon-chongzhi',
				name: '充值',
				key:"XF_RECHARGE",
				url:"/pageXf/recharge/recharge",
				display:true,
				bgIndex:bg3
			},
			{
				id:22,
				icon: 'custom-icon custom-icon-tixian',
				name: '提现',
				key:"XF_WITHDRAW",
				url:"/pageXf/withdraw-deposit/withdraw-deposit",
				display:true,
				bgIndex:bg5
			},
			{
				id:23,
				icon: 'custom-icon custom-icon-zhangdan',
				name: '账单',
				key:"XF_BILL",
				url:"/pageXf/bill/bill",
				display:true,
				bgIndex:bg1
			},
			{
				id:24,
				icon: 'custom-icon custom-icon-xiaofeima',
				name: '消费码',
				key:"XF_CONSUMER_CODE",
				url:'/pageXf/xf-erweima/xf-erweima',
				display:true,
				bgIndex:bg3
			},
			{
				id:25,
				icon: 'custom-icon custom-icon-yikatongxiaofeifenxi',
				name: '图表分析',
				key:"XF_CHART_ANALYSIS",
				url:"/pageXf/chart-analysis/chart-analysis",
				display:true,
				bgIndex:bg2
			},
			{
				id:26,
				icon: 'custom-icon custom-icon-qiapian',
				name: '卡片挂失解挂',
				key:"XF_CARD_STATE",
				url:"",
				display:false,
				bgIndex:bg5
			}
		],
		PassageArr:[
			{
				id:30,
				icon: 'custom-icon custom-icon-quanxian',
				name: '授权',
				key:"TX_ACCREDIT",
				url:"/pageMj/auth/auth",
				display:true,
				bgIndex:bg2
			},
			{
				id:31,
				icon: 'custom-icon custom-icon-tonghangjilu',
				name: '通行记录',
				key:"TX_ACCESS_RECORDS",
				url:'/pageMj/inOutRecord/inOutRecord',
				display:true,
				bgIndex:bg4
			},
			{
				id:32,
				icon: 'custom-icon custom-icon-tonghangma',
				name: '通行码',
				key:"TX_PASSPHRASE",
				url:"/pageMj/passage-erweima/passage-erweima",
				display:true,
				bgIndex:bg1
			},
			{
				id:33,
				icon: 'custom-icon custom-icon-RectangleCopy',
				name: '图表分析',
				key:"TX_CHART_ANALYSIS",
				url:"/pageMj/chart-analysis/chart-analysis",
				display:true,
				bgIndex:bg3
			}
		],
		dormArr:[
			{
				id:40,
				icon: 'custom-icon custom-icon-weixiudan',
				name: '维修申请',
				url:"/pageDorm/maintain-apply/maintain-apply",
				key:"SS_MAIN_APP",
				display:true,
				bgIndex:bg3
			},
			{
				id:41,
				icon: 'custom-icon custom-icon-jindu',
				name: '维修单据',
				url:"/pageDorm/maintain-records/maintain-records",
				key:"SS_MAIN_RECORD",
				display:true,
				bgIndex:bg1
			},
			{
				id:42,
				icon:'custom-icon custom-icon-kanban',
				name:"在寝监控",
				url:"/pageDorm/indorm-monitor/indorm-monitor",
				key:"SS_ANOMALY",
				display:true,
				bgIndex:bg4
			}
		],
		energyArr:[
			{
				id:50,
				icon: 'custom-icon custom-icon-zichan',
				name: '节能钱包',
				key:"ENERGY_wallet",
				url:"/pageOther/energy-wallet/energy-wallet",
				display:true,
				bgIndex:bg5
			},
			{
				id:51,
				icon: 'custom-icon custom-icon-chongzhi',
				name: '节能充值',
				key:"ENERGY_RECHARGE",
				url:"/pageOther/energy-recharge/energy-recharge",
				display:true,
				bgIndex:bg1
			},
			{
				id:52,
				icon: 'custom-icon custom-icon-zhangdan',
				name: '节能账单',
				key:"ENERGY_BILL",
				url:"/pageOther/energy-bill/energy-bill",
				display:true,
				bgIndex:bg2
			}
		],
		libraryArr:[
			{
				id:60,
				icon: 'custom-icon custom-icon-weibiaoti--',
				name: '书目检索',
				key:"TS_BRS",
				url:"/pageOther/books-periodical-info/books-periodical-info",
				display:true,
				bgIndex:bg1
			},
			{
				id:61,
				icon: 'custom-icon custom-icon-jiarushujiayizaishujia',
				name: '借阅清单',
				key:"TS_BORROWLIST",
				url:"/pageOther/borrow-record/borrow-record",
				display:true,
				bgIndex:bg3
			},
			{
				id:62,
				icon: 'custom-icon custom-icon-weibiaoti--1',
				name: '借阅证',
				key:"TS_BORROWCARD",
				url:"/pageOther/borrow-card/borrow-card",
				display:true,
				bgIndex:bg5
			}
		]
	}
	
	export const filterApplicate = (arr = []) => {
		if(arr.length === 0) return [];
		const result = [];
		// 遍历对象的所有键
		for (const key in allApplicate) {
			const value = allApplicate[key];
			// 如果值是数组类型，则遍历数组的每个元素
			if (Array.isArray(value)) {
				value.forEach((item) => {
					// 如果数组元素是对象且包含 key 属性，则判断 key 值是否在 arr 中
					if (typeof item === "object" && item.hasOwnProperty("key") && arr.includes(item.key)) {
						result.push(item);
					}
				});
			}
		}
		return result;
	}

	export const getItemAuth = function(val,arr = store.state.vuex_menuAuth){
		if(!Array.isArray(arr) || arr.length === 0) return null;
		let item = arr.find(v => v.key === val)
		return item
	}