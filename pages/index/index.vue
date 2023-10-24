<template>
	<view class="indexPage">
		<view
			class="Voice_class bgfff"
			@touchstart="voiceTouchstart"
			@touchend="voiceTouchend">
			<u-icon name="mic" size="80"></u-icon>
		</view>
		<view class="u-rela" style="height: 600rpx;">
			<u-image :src="topImg" height="500rpx" width="100%"></u-image>
			<view style="background-color: rgba(0, 0, 0, 0.5);padding: 0 30rpx 60rpx;position: absolute;bottom: 100rpx;left: 0;right: 0;height: 170rpx;" class="u-flex cfff">
				<u--image :src="slogo" shape="circle" width="88rpx" height="88rpx"></u--image>
				<view class="u-font-40 u-m-l-30 u-line-1" @click="schoolChange">{{ schoolName || '请选择学校'}}</view>
			</view>
			<view 
				class="u-m-20 bgfff u-abso" 
				style="bottom: 0;left: 0;right: 0;padding: 30rpx 60rpx;border-radius:30rpx 30rpx 26rpx 26rpx;box-shadow: 0px 12px 16px 10px rgba(111, 226, 115, 0.06);">
				<view class="u-font-36">{{ empName || '游客' }}，{{ isAM ? '上午好！' : '下午好！'}}</view>
				<view class="u-font-26 u-m-t-16">欢迎使用智慧校园系统</view>
			</view>
		</view>
		
		<my-card margin="0 20rpx">
			<view class="u-flex">
				<u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
				<text class="u-font-30 fw700 u-m-l-10">常用应用</text>
			</view>
			<u-grid :border="false" :col="4" customStyle="margin-top: 20rpx;" @click="urlItemClick">
				<u-grid-item 
					customStyle="margin-bottom: 20rpx;width:25%;" 
					v-for="(listItem,listIndex) in applicationList" :key="listIndex" :name="listItem.key">
					<view 
						class="icon_class u-flex u-row-center cfff " 
						:style="{'background': `url(${iconArr[listIndex]}) no-repeat center`}">
						<i :class="[listItem.icon]" class="u-font-32"></i>
					</view>
					<text class="u-font-26">{{ listItem.name }}</text>
				</u-grid-item>
				<u-grid-item customStyle="margin-bottom: 20rpx;width:25%;" name="all">
					<view class="icon_class u-flex u-row-center">
						<u-icon name="grid-fill" size="32" color="#fff"></u-icon>
					</view>
					<text class="u-font-26">全部应用</text>
				</u-grid-item>
			</u-grid>
		</my-card>
		
		<my-card margin="20rpx">
			<view class="u-flex u-row-between">
				<view class="u-flex">
					<u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
					<text class="u-font-30 fw700 u-m-l-10">最近消息</text>
				</view>
				<view class="u-flex">
					<u-badge isDot type="error" v-if="noticeList.length"></u-badge>
					<text class="u-m-l-10 u-m-r-10 u-tips-color" v-show="noticeList.length">新消息</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view v-if="!noticeList.length" class="u-p-t-40 u-p-b-10 u-text-center">
				<view>暂无消息</view>
				<view class="u-p-t-20 u-font-24">您还没有收到任何消息哦~</view>
			</view>
			<view v-else class="u-p-t-20 u-tips-color" v-for="(item,index) in noticeList" :key="index">有消息提醒</view>
		</my-card>
		
		<my-card margin="0 20rpx 20rpx">
			<view class="u-flex">
				<u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
				<text class="u-font-30 fw700 u-m-l-10">校园头条</text>
			</view>
			<view class="u-text-center u-m-t-20 u-flex-col u-row-center u-col-center" v-if="!news">
				<u--image src="/static/images/nodata/1.png" width="150rpx" height="104rpx" :fade="false"></u--image>
				<view class="u-m-t-20">暂无新闻</view>
			</view>
			<view class="u-m-t-20" v-else>{{ news }}</view>
		</my-card>
		
		<u-popup 
			:show="selectSchoolShow" 
			closeable round="10" customStyle="padding:30rpx 20rpx;" 
			@close="selectSchoolShow = false">
			<view class="u-m-b-30 u-text-center">学校选择</view>
			<u-search placeholder="输入学校名称查询" v-model.trim="schoolName" height="70rpx" :showAction="false" :searchIconSize="44"></u-search>
			<u-list height="600rpx" customStyle="margin-top:20rpx;">
				<u-list-item v-for="(item, index) in schoolList" :key="item.sid">
					<u-cell :title="item.sname" @click="schoolListClick(item)" :icon="item.slog"></u-cell>
				</u-list-item>
			</u-list>
		</u-popup>
		
		<my-countdown-login ref="mycountdownloginRef"></my-countdown-login>
		
		<u-overlay :show="voiceModalShow">
			<view class="w-overlay">
				<view class="voice_box">
					<view class="voice_arrow"></view>
					<text class="voice_item" v-for="(item,index) in 10" :key="item" :class="['hr'+item]"></text>
				</view>
			</view>
		</u-overlay>
			
		<u-tabbar :value="0" activeColor="#d81e06" @change="handlerTabbar">
			<u-tabbar-item text="首页">
				<u-icon name="home" slot="active-icon" size="48" color="#d81e06"></u-icon>
				<u-icon name="home" slot="inactive-icon" size="48" color="#7d7e80"></u-icon>
			</u-tabbar-item>
			<u-tabbar-item text="我的">
				<u-icon name="account-fill" slot="active-icon" size="48" color="#d81e06"></u-icon>
				<u-icon name="account-fill" slot="inactive-icon" size="48" color="#7d7e80"></u-icon>
			</u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	import { reqBasicInfo, getMunuAuth, reqWxSignature, getSchoolList, getToken, getWxInfo, initFkCfg } from '@/api/common/index.js';
	import { getUserIdentity,userInfo, reqVoiceInfo } from '@/api/home/home.js'
	import { filterApplicate, getItemAuth, iconArr } from '@/utils/index-data.js'
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	
	export default {
		data() {
			return {
				topImg:'',
				empName:"",
				isAM:true,
				noticeList:[],
				news:"",
				selectSchoolShow:false,
				schoolName:"",
				slogo:"",
				sid:"",
				schoolList:[],
				isBind: '',
				applicationList:[],
				applicateKey:[],
				voiceModalShow:false,
				iconArr
			}
		},
		onLoad() {
			this.$u.vuex('vuex_windowHeight',uni.getSystemInfoSync().windowHeight);
			this.applicateKey = this.vuex_selectMenuKey || [];
			this.applicationList = filterApplicate(this.applicateKey);
			// #ifdef H5
			const url = window.location.href;
			const search = this.getUrlParams(url);
			if(Object.keys(search).length && search.appId){
				this.isBind = search.isBind || 0;
				this.$u.vuex('vuex_urlobj.token', search.token);
				this.$u.vuex('vuex_urlobj.isBind', search.isBind || 0);
				this.$u.vuex('vuex_urlobj.appId', search.appId);
				this.$u.vuex('vuex_urlobj.openid', search.openid);
			}
			let link = url.split('#')[0];
			reqWxSignature({ link }).then(r => {
				let data = r.data;
				jweixin.config({
					debug: false,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: [ 'startRecord','stopRecord','translateVoice' ]
				});
			}).catch(err => {
				uni.$u.toast(err)
			})
			// #endif
			getSchoolList().then(r => {
				let d = r.data.data;
				this.schoolList = d;
				if(this.vuex_urlobj.sid){
					let item = d.filter(v => v.sid == this.vuex_urlobj.sid);
					this.schoolName = item.length && item[0].sname || '';
					this.slogo = item.length && item[0].slogo || '';
					this.sid = item.length && item[0].sid || '';
				}
				if(!this.schoolName && d.length === 1){
					let { sname, sid, slogo } = d[0];
					this.schoolName = sname;
					this.slogo = slogo;
					this.sid = sid;
					this.$u.vuex('vuex_urlobj.sid', sid);
				}
				this.initPage();
			})
			
		},
		onShow() {
			this.isBind = this.vuex_urlobj.isBind || 0;
			this.isAM = new Date().getHours() < 12 ? true : false;
			this.empName = this.vuex_useInfo?.empName || '';
			if(this.vuex_urlobj.isBind == 1) this.showFun();
			console.log('indexpage______onshow');
		},
		methods: {
			voiceTouchstart(){
				this.voiceModalShow = true;
				// #ifdef H5
				jweixin.startRecord();
				// #endif
				// #ifdef MP-WEIXIN
				const recorderManager = wx.getRecorderManager();
				recorderManager.start();
				// #endif
			},
			voiceTouchend(){
				this.voiceModalShow = false;
				// #ifdef H5
				jweixin.stopRecord({
				  success: (res) => {
						let localId = res.localId;
						jweixin.translateVoice({
						  localId: localId, 
						  isShowProgressTips: 1, 
						  success: (r) => this.getVoiceData(r.translateResult)
						})
				  }
				})
				// #endif
				// #ifdef MP-WEIXIN
				const recorderManager = wx.getRecorderManager();
				recorderManager.onStop({
					success:({ tempFilePath }) => {
						
					}
				})
				// #endif
			},
			getVoiceData(val){
				reqVoiceInfo({ content:val }).then(r => {
					let {executeScript,pagePath,menuKey} = r.data.data;
					let url = executeScript ? (pagePath + (pagePath.indexOf('?') < 0 ? '?' : '&') + 'executeScript='+executeScript) : pagePath;
					this.urlItemClick(menuKey,url);
				}).catch(err => this.$u.toast(err))
			},
			getMenuAuthData(){
			  return new Promise((resolve,reject) => {
			    getMunuAuth().then(r => {
			      let d = r.data.data.map(v => ({ key:v.menu_key, display:v.display, enable:v.enable, type:v.menu_type}));
			      this.$u.vuex('vuex_menuAuth',d);
			      if(!this.applicateKey.length){
			      	let arr = d.filter(v => v.enable && v.display);
			      	this.applicateKey = arr.map(v => v.key).slice(0,11);
			      	this.applicationList = filterApplicate(this.applicateKey);
			      	this.$u.vuex('vuex_selectMenuKey',this.applicateKey)
			      }
			      resolve()
			    }).catch(err => {
						this.$u.vuex('vuex_menuAuth',[]);
						uni.$u.toast(err)
						resolve()
					})
			  })
			},
			schoolListClick(item){
				let { sname, sid, slogo } = item;
				this.schoolName = sname;
				this.slogo = slogo;
				this.sid = sid;
				uni.removeStorageSync('vuex_cfg');
				uni.removeStorageSync('vuex_useInfo');
				uni.removeStorageSync('vuex_menuAuth');
				this.$u.vuex('vuex_urlobj.sid', sid);
				this.selectSchoolShow = false;
				this.initPage()
			},
			schoolChange(){
				if(this.schoolList.length === 1) return;
				this.selectSchoolShow = true;
			},
			async initPage(){
				reqBasicInfo().then(r => {
					let d = r.data.data;
					let arr = d.banners && d.banners.split(',') || [];
					this.topImg = arr.length && arr[0];
					d.empInfo.faceUrl = d.empInfo.avatarUrl;
					this.$u.vuex("vuex_wxInfo",d.empInfo);
					this.$u.vuex('vuex_cfg.subsidy1',r.data.data.WALLET_SUBSIDY1_START);
					this.$u.vuex('vuex_cfg.subsidy2',r.data.data.WALLET_SUBSIDY2_START);
					this.$u.vuex('vuex_cfg.subsidy3',r.data.data.WALLET_SUBSIDY3_START);
					this.$u.vuex('vuex_cfg.czMax',r.data.data.CZ_SIGNLE_MAX_MONEY);
					this.$u.vuex('vuex_cfg.personWallet',r.data.data.WALLET_PERSONAL_START);
				});
				if(!this.vuex_urlobj.openid){
					let code = await this.wxLogin();
					await getWxInfo({ code }).then(r => {
						let d = r.data.data;
						this.$u.vuex('vuex_urlobj.openid', d.openid);
						this.$u.vuex('vuex_urlobj.sessionKey', d.sessionKey);
					})
				}
				let r = await getToken({ wxId:this.vuex_urlobj.bindWxId || 0 }).catch((err) => {
					this.$u.vuex('vuex_urlobj.token', '');
					this.$u.vuex('vuex_urlobj.isBind', 0);
					this.isBind = 0;
					uni.$u.toast(err)
				});
				if(r?.data?.code == 200){
					this.$u.vuex('vuex_urlobj.token', r.data.data.accessToken);
					this.$u.vuex('vuex_urlobj.isBind', 1);
					this.isBind = 1;
				}
				initFkCfg().then(res => {
					if(res.data.code == 200){
						this.$u.vuex('vuex_cfg.dateType', res.data.data.FK_YUYUE_DATE_OR_DATETIME_OPTIONS || 'date');
						this.$u.vuex('vuex_cfg.isShowSourceAddr', res.data.data.VISITOR_IS_START_SOURCE_ADDRESS || 1);
						this.$u.vuex('vuex_cfg.isShowCertificate', res.data.data.VISITOR_IS_UPLOAD_CERTIFICATE || 0);
					}
				})
				this.showFun();
			},
			async showFun(){
				await this.getMenuAuthData();
				if(this.vuex_urlobj.token){
					userInfo().then(r => {
					  let d = r.data.data;
						this.empName = d.empName;
						this.$u.vuex('vuex_urlobj.bindWxId', d.wxId);
					  this.$u.vuex('vuex_useInfo', d);
					}).catch(() => {
						this.$u.vuex('vuex_useInfo', {});
						this.empName = '';
					})
				}else{
					this.empName = '';
					this.$u.vuex('vuex_useInfo', {});
				}
			},
			wxLogin(){
				return new Promise((resolve, reject) => {
					wx.login({
						success: ({ code }) => resolve(code),
						fail: err => reject(err)
					});
				});
			},
			getUrlParams(url) {
			  const hashIndex = url.indexOf("?");
			    if (hashIndex !== -1) url = url.slice(hashIndex + 1);
			    const params = new URLSearchParams(url);
			    const paramsObj = {};
			    for (let [key, value] of params) {
			      paramsObj[key] = value;
			    }
			    return paramsObj;
			},
			handlerTabbar(e){
				if(e == this.tabbarIndex) return;
				uni.switchTab({ url:'/pages/home/home' })
			},
			urlItemClick(key,url = ''){
				if(key === 'all'){
					uni.redirectTo({ url:'/pages/home/app-manager/app-manager' })
					return;
				}
				if(!this.sid){
					this.$u.toast("请先选择学校");
					this.selectSchoolShow = true;
					return;
				}
				let item = getItemAuth(key);
				if(!item || item.enable == 0) return this.$u.toast("此功能暂未开放");
				let objArr = filterApplicate([key]);
				if(objArr.length) item.url = objArr[0].url;
				if(item && url) item.url = url;
				console.log(item,this.isBind,this.vuex_urlobj.isBind);
				let arr = ['FK_APPOINTMENT','FK_RESERVATION_RECORD']
				if(arr.includes(key)){
				  if(item.key === 'FK_APPOINTMENT' && this.isBind == 1 && this.vuex_useInfo.bindEmpType == 2) return this.$u.toast("此功能暂未开放");
					return this.$u.route(item.url);
				}
				if(this.isBind == 0) return this.$refs.mycountdownloginRef.start();
				let arr2 = ['FK_INVITATION','FK_INVITATION_RECORD','SP_EVECTION','SP_OVERTIME','SP_RETROACTIVE_RECORD']
				if((arr2.includes(key)) && this.vuex_useInfo.bindEmpType != 2) return this.$u.toast("此功能暂未开放");
				this.$u.route(item.url)
			}
		}
	}
</script>

<style lang="scss">
  .indexPage{
		.Voice_class{
			width: 120rpx;height: 120rpx;border-radius: 120rpx;margin: 30rpx 0;
			display: flex;align-items: center;justify-content: center;
			position: fixed;bottom: 0;left: 50%;z-index: 1000;
			transform: translateX(-50%);
			box-shadow: 0 0 18rpx #a4a4a4;
		}
    .icon_class{
			background:url(/static/images/iconbg/2.png) no-repeat center;
			background-size: 100% 100% !important;
			width: 64rpx;
			height: 70rpx;
		}
		.voice_box{
			width: 320rpx;height: 160rpx;border-radius: 30rpx;line-height: 140rpx;
			text-align: center;
			position: relative;
			background-color: #1fbcb5;
			.voice_arrow{
				border: 20rpx solid;
				position: absolute;
				bottom: -40rpx;left: 50%;
				transform: translateX(-50%);
				border-color: #1fbcb5 transparent transparent transparent !important;
			}
		}
		.voice_item{
			background-color: #fff;
			width: 3px;
			height: 6px;
			margin: 0 6rpx;
			display: inline-block;
			border: none;
			animation: note 0.4s ease-in-out;
			animation-iteration-count: infinite;
			animation-direction: alternate;
		}
		.hr1 {
			animation-delay: -0.3s;
		}
		.hr2 {
			animation-delay: -0.5s;
		}
		.hr3 {
			animation-delay: -0.7s;
		}
		.hr4 {
			animation-delay: -0.8s;
		}
		.hr5 {
			animation-delay: -0.9s;
		}
		.hr6 {
			animation-delay: -0.8s;
		}
		.hr7 {
			animation-delay: -0.7s;
		}
		.hr8 {
			animation-delay: -0.5s;
		}
		.hr9 {
			animation-delay: -0.3s;
		}
		.hr10 {
			animation-delay: -0.1s;
		}
		@keyframes note {
			from {
				transform: scaleY(1);
			}
			to {
				transform: scaleY(5);
			}
		}
  }
</style>