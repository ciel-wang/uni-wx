<template>
	<view class="homePage">
		<view class="u-rela u-p-30 homePage_top">
			<view class="status_bar"></view>
			<view class="u-flex u-p-t-80 u-row-between">
				<view class="u-flex">
					<u-avatar :src="userInfo.faceUrl && userInfo.faceUrl+'?'+new Date().getTime()" size="140"></u-avatar>
					<view class="u-m-l-30">
						<view v-if="userInfo.bindEmpType == 2" class="u-flex">
							<text class="u-m-r-30 u-font-32">{{userInfo.empName}}</text>
							<u-icon name="star-fill" color="#FFAD89"></u-icon>
							<text style="color: #FFAD89;margin-left: 10rpx;">{{userInfo.empPostName}}</text>
						</view>
						<text class="u-m-r-30 u-font-32" v-else>{{userInfo.empName}}</text>
					  <view v-if="userInfo.bindEmpType == 2" class="u-m-t-20">{{userInfo.empPhone}}</view>
					  <view v-if="userInfo.bindEmpType != 2" class="u-m-t-20">{{userInfo.empCode}}</view>
					  <view 
					  	v-if="!userInfo.bindEmpTypeName" 
					  	class="u-m-t-20"
					  	@click="$u.route('/pages/login/login')">登录/注册</view>
					</view>
				</view>
				
				<view
					class="homePage_identity u-text-center cfff"
					:class="[userInfo.bindEmpType == 1 ? 'bg2' : userInfo.bindEmpType == 2 ? 'bg1' : 'bg3']">{{userInfo.bindEmpTypeName || '游客'}}</view>
			</view>
			
			<view class="homePage_gridclass u-flex u-row-around">
				<view class="u-flex u-row-center u-width-45 bgfff u-borderR-10 u-p-t-40 u-p-b-40" @click="cardItemClick('info')">
					<u-icon name="gerenxinxi" customPrefix="custom-icon" color="rgba(59, 140, 243, 1)" size="54"></u-icon>
					<text class="u-font-28 u-m-l-10 u-m-r-10">个人信息</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view class="u-flex u-row-center u-width-45 bgfff u-borderR-10 u-p-t-40 u-p-b-40" @click="cardItemClick('scan')">
					<u-icon name="saoyisao" customPrefix="custom-icon" color="rgba(59, 140, 243, 1)" size="54"></u-icon>
					<text class="u-font-28 u-m-l-10 u-m-r-10">扫一扫</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
		
		<my-card :bodyStyle="{padding:0}" margin="20rpx">
			<u-cell
				icon="bell-fill" 
				:iconStyle="{fontSize:'36rpx',color:'rgba(46, 127, 255, 1)'}"
				title="我的通知" isLink
				@click="$u.route('/pageZ/my-notification/my-notification')"></u-cell>
			<u-cell
				icon="trash-fill" 
				:iconStyle="{fontSize:'36rpx',color:'rgba(23, 186, 108, 1)'}"
				title="清除缓存" isLink
				@click="modalShow = true;modalContent = '您确定要清除缓存？';btnType = 'clear'"></u-cell>
			<u-cell
				icon="coupon-fill" 
				:iconStyle="{fontSize:'36rpx',color:'rgba(241, 166, 14, 1)'}"
				title="帮助与反馈" isLink
				@click="$u.route('/pageZ/help-feedback/help-feedback')"></u-cell>
			<u-cell
				icon="info-circle-fill" 
				:iconStyle="{fontSize:'36rpx',color:'rgba(46, 127, 255, 1)'}"
				title="联系我们" isLink
				@click="$u.route('/pages/home/contact-us/contact-us')"></u-cell>
			<!-- <u-cell
				icon="info-circle-fill" 
				:iconStyle="{fontSize:'36rpx',color:'rgba(46, 127, 255, 1)'}"
				title="测试" isLink
				@click="$u.route('/pages/home/test/test')"></u-cell> -->
		</my-card>
		
		<u-tabbar :value="1" activeColor="#d81e06" @change="handlerTabbar">
			<u-tabbar-item text="首页" @click="$u.route('/pages/index/index')">
				<u-icon name="home" slot="active-icon" size="48" color="#d81e06"></u-icon>
				<u-icon name="home" slot="inactive-icon" size="48" color="#7d7e80"></u-icon>
			</u-tabbar-item>
			<u-tabbar-item text="我的">
				<u-icon name="account-fill" slot="active-icon" size="48" color="#d81e06"></u-icon>
				<u-icon name="account-fill" slot="inactive-icon" size="48" color="#7d7e80"></u-icon>
			</u-tabbar-item>
		</u-tabbar>
		
		<u-modal :show="modalShow" title="提示" :content='modalContent' showCancelButton @confirm="modalConfirm" @close="modalShow = false" @cancel="modalShow = false"></u-modal>
		<my-countdown-login ref="mycountdownloginRef"></my-countdown-login>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { userInfo,reportloss,lossUnregister,  } from '@/api/home/home.js'
	import { getItemAuth } from '@/utils/index-data.js'
	import { reqWxSignature, qrLogin } from '@/api/common/index.js'
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	
	export default {
		data() {
			return {
				userInfo:{},
				cardTitle:"卡片挂失",
				btnType:"",
				modalShow:false,
				modalContent:""
			}
		},
		onLoad() {
			// #ifdef H5
			let url = window.location.href.split('#')[0];
			reqWxSignature({link:url}).then(r => {
				let data = r.data;
				jweixin.config({
					debug: false,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: [ 'scanQRCode' ]
				});
			})
			// #endif
		},
		onShow() {
			this.initData();
		},
		methods: {
			initData(){
				if(this.vuex_urlobj.token){
					userInfo().then(res => {
						let obj = res.data.data;
						obj.bindEmpTypeName = obj.bindEmpType == 1 ? '学生' : obj.bindEmpType == 2 ? '教职工' : obj.bindEmpType == 3 ? '家长' : ''
						this.cardTitle = obj.cardState == 4 ? '卡片解挂' : '卡片挂失'
						this.userInfo = obj;
					})
				}else{
					this.userInfo = this.vuex_wxInfo;
				}
			},
			modalConfirm(){
				if(this.btnType == 'clear'){
				  uni.removeStorageSync('applyForm_key');
				  uni.removeStorageSync('intervieweesHistory_key');
				  uni.removeStorageSync('visitHistory_key');
				  uni.removeStorageSync('goodsHistory_key');
				  uni.removeStorageSync('vuex_selectMenuKey');
					return;
				}
				if(this.btnType == "LossReport"){
				  reportloss().then(r => {
						this.$refs.uToast.show({ message: r.data.msg, type: "success" });
						this.initData()
				  }).catch(err => {
						this.$refs.uToast.show({ message:err, type: "error" });
					})
					return;
				}
				if(this.btnType == "Unregister"){
				  lossUnregister().then(r => {
						this.$refs.uToast.show({ message: r.data.msg, type: "success" });
						this.initData()
				  }).catch(err => {
						this.$refs.uToast.show({ message:err, type: "error" });
					})
					return;
				}
			},
			cardItemClick(val) {
			  if (!this.vuex_urlobj.token) return this.$refs.mycountdownloginRef.start();
			  if(val === 'info'){
			    uni.navigateTo({ url: './personal/personal' });
			  }
				if(val === 'scan'){
					if(this.userInfo.bindEmpType != 2) return this.$u.toast("此功能暂未开放");
					// #ifdef H5
					jweixin.scanQRCode({
					  needResult: 1,
					  scanType: ["qrCode","barCode"], 
					  success: (res) => {
					    let result = res.resultStr;
							if(result){
								qrLogin({qrcode:result}).then(r => {
									this.$refs.uToast.show({ message: r.data.msg, type: "success" });
								}).catch(err => {
									this.$refs.uToast.show({ message:err, type: "error" });
								})
							}
					  }
					})
					// #endif
					// #ifdef MP-WEIXIN
					wx.scanCode({
						success:({ result }) => {
							if(!result) return this.$refs.uToast.show({ message:'未识别到有效值，请重试！', type: "warning" });
							qrLogin({qrcode:result}).then(r => {
								this.$refs.uToast.show({ message: r.data.msg, type: "success" });
							}).catch(err => {
								this.$refs.uToast.show({ message:err, type: "error" });
							})
						}
					})
					// #endif
				}
				if(val === 'card'){
					let item = getItemAuth('XF_CARD_STATE')
					if(item.enable == 0) return this.$u.toast("此功能暂未开放");
			    if(this.userInfo.cardState == 2){
			      this.modalTitle = "您确定要进行卡片挂失？"
			      this.btnType = "LossReport"
			      this.modalShow = true
			    }else if(this.userInfo.cardState == 4){
			      this.modalTitle = "您确定要进行卡片解挂？"
			      this.btnType = "Unregister"
			      this.modalShow = true
			    }else{
			      this.$refs.uToast.show({ message: '卡片异常，请联系管理员', type: "error" });
			    }
			  }
				if(val === 'account'){
			    let item = getItemAuth('XF_PROPERTY')
			    if(item.enable == 0){
			      this.$u.toast("此功能暂未开放")
			      return;
			    }
			    this.$u.route('/pages/xf/wallet/index',{sourceType:'home'})
			  }
			},
			handlerTabbar(e){
				if(e == this.tabbarIndex) return;
				uni.switchTab({ url:'/pages/index/index' })
			},
		}
	}
</script>

<style lang="scss">
.homePage{
	height: 100%;
	background: url(https://qs.aiwld.com.cn/static/app/loginbg.png) no-repeat;
	background-size: 100%;
	&_top{
		height: 350rpx;
		// background: linear-gradient(180deg, rgba(58, 214, 20, 0.15) 0%, rgba(58, 214, 20, 0) 100%);
		margin-bottom: 120rpx;
	}
	&_identity{
	  border-radius: 30rpx 0 0 30rpx;
	  width: 148rpx;
		height: 56rpx;
		line-height: 56rpx;
		padding: 7px 16px 7px 16px;
		border-radius: 84rpx;
	}
	.bg1{
		background: linear-gradient(269.37deg, rgba(56, 136, 231, 1) 0%, rgba(96, 225, 250, 1) 100%), linear-gradient(138.61deg, rgba(250, 158, 85, 1) 0%, rgba(250, 96, 32, 1) 100%);
	}
	.bg2{
		background: linear-gradient(269.37deg, rgba(17, 204, 167, 1) 0%, rgba(39, 218, 43, 1) 100%), linear-gradient(138.61deg, rgba(250, 158, 85, 1) 0%, rgba(250, 96, 32, 1) 100%);
	}
	.bg3{
		background: linear-gradient(269.37deg, rgba(224, 74, 9, 1) 0%, rgba(245, 163, 87, 1) 100%), linear-gradient(138.61deg, rgba(250, 158, 85, 1) 0%, rgba(250, 96, 32, 1) 100%);
	}
	&_gridclass{
		position: absolute;bottom:-90rpx;left: 0;right: 0;
	}
}
</style>
