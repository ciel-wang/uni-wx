<template>
	<view class="qrcode_page">
		<view class="qrcode_page_body">
			<view class="c000 u-font-36 u-text-center fw700">{{ isVisitorQrCode ? '访客码' : '通行码'}}</view>
			
			<view>
				<view class="u-flex fw700 u-m-t-30">
					<text>诚邀【</text>
					<view class="u-line-1" style="max-width: 70%;">{{ info.visitorName }}</view>
					<text>】到访</text>
				</view>
				
				<view class="u-font-24 u-flex u-m-t-30">
					<view class="u-width-50">
						<view class="u-tips-color">到访区域：</view>
						<view class="c000 u-line-1 fw700 u-m-t-12 u-font-28">{{ info.visitorArea }}</view>
						<view class="u-tips-color u-m-t-12">到访时间：</view>
						<view class="c000 u-line-1 fw700 u-m-t-12 u-font-28">{{ info.visitorTime }}</view>
					</view>
					<view class="u-width-50">
						<view class="u-tips-color">被访人：</view>
						<view class="c000 u-line-1 fw700 u-m-t-12 u-font-28">{{ info.targetEmpName }}</view>
						<view class="u-tips-color u-m-t-12">离访时间：</view>
						<view class="c000 u-line-1 fw700 u-m-t-12 u-font-28">{{ info.levalTime }}</view>
					</view>
				</view>
			</view>
			
			<view>
				<view style="color: #2979ff;" class="u-font-28 u-m-t-30 u-text-center">{{ isVisitorQrCode ? '将访客码对准访客机二维码识别区,完成访客登记' : '将通行码对准通道二维码识别区,出入园区'}}</view>
				<view style="margin: 30rpx auto;text-align: center;border-radius: 10rpx;">
					<tki-qrcode
						ref="qrcode" 
						:val="isVisitorQrCode ? visitorQrCode : visitorCardNum" 
						:size="400" 
						:loadMake="true" 
						:onval="true" />
				</view>
				
				<view style="color: #2979ff;text-align: center;font-weight: 700;" v-if="visitorQrCode">
					<text @click="isVisitorQrCode = !isVisitorQrCode">{{isVisitorQrCode ? '切换通行码' : '切换访客码'}}</text>
				</view>
			</view>
		</view>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { details } from '../api/approval.js';
	
	export default {
		data() {
			return {
				isVisitorQrCode:true,
				empName:"",
				visitorQrCode:'',
				visitorCardNum:'',
				empId:'',
				info:{}
			}
		},
		onLoad(e) {
			this.empId = e.id;
			details({ apId:e.id, visitorNo:e.num }).then(r => {
				let d = r.data.data;
				let { targetEmpName, visitorArea, visitorTime, levalTime, visitorQrCode,visitorCardNum,visitorName } = d;
				this.visitorQrCode = visitorQrCode;
				this.visitorCardNum = visitorCardNum;
				this.info = {
					targetEmpName, visitorArea, 
					visitorTime:e.t === 'date' ? visitorTime && visitorTime.substr(0,10) || '' : visitorTime, 
					levalTime:e.t === 'date' ? levalTime && levalTime.substr(0,10) || '' : levalTime,
					visitorName
				}
			}).catch(err => {
				this.$refs.uToast.show({ message: err || '服务错误，请联系管理员！', type: 'error' });
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.qrcode_page{
	width: 100%;
	height: 100%;
	background: url(http://qs.aiwld.com.cn/static/app/bg11.png) no-repeat;
	background-size: 100% 100%;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	box-sizing: border-box;
	&_body{
		background: url(http://qs.aiwld.com.cn/static/app/bg12.png) no-repeat;
		background-size: 100% 100%;
		width: 100%;
		min-height: 75%;
		max-height: 90%;
		padding: 60rpx 50rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.c000{
		color: #000;
	}
}
</style>
