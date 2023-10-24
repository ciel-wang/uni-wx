<template>
	<view class="infoPage">
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<u-gap height="30" bgColor="#f8f8f8"></u-gap>
				
				<my-card 
					:showHead="false" padding="0" margin="0 30rpx 30rpx" 
					v-for="(item,index) in visitorEmpArr" :key="item.id">
					<view class="u-p-20 u-p-l-30 u-p-r-30">
						<view class="u-p-l-10 u-m-t-10 u-flex u-row-between">
							<view class="u-flex" style="max-width: calc(100% - 70rpx);">
								<u-avatar
									:src="staticPrefix + item.visitorImgUrl2" 
									size="100" 
									@click="imgClick(item.visitorImgUrl2)"></u-avatar>
								<view class="u-p-l-20">
								  <text class="fw700">{{ item.visitorName }}</text>
								  <view class="u-primary u-m-t-10" @click="phoneClick(item.visitorPhone)"> {{ item.visitorPhone }} </view>
								</view>
							</view>
							<view @click="qrcodeClick(item)" v-if="item.visitorCardNum">
								<tki-qrcode
									ref="qrcode1" 
									cid="qrcode1"
									:val="item.visitorCardNum" 
									:size="60" 
									:loadMake="true" 
									:onval="true" />
							</view>
						</view>
						<u-cell-group :border="false" customStyle="margin-top:20rpx;">
							<u-cell
								:title="item.certificateType ? item.certificateType+':' : '身份证号:'"
								:border="false"
								:value="item.visitorCertificateCode"></u-cell>
						  <u-cell title="来访公司:" :border="false" :value="item.visitorCompany"></u-cell>
						  <u-cell title="车牌号码:" :border="false" :value="item.visitorCarNum"></u-cell>
							<u-cell title="来源地:" :border="false" v-if="isShowSourceAddr" :value="item.sourceAddress"></u-cell>
						  <u-cell title="携带物品:" :border="false" :value="item.visitorGoods"></u-cell>
							<view class="u-flex u-m-b-10 u-m-t-12 u-flex-wrap u-p-l-16 u-p-r-16 img_class">
							  <view v-for="v in item.visitorGoodImgs" :key="v" @click="imgClick(v)">
							    <u-image borderRadius="10" width="180rpx" height="180rpx" :src="staticPrefix + v"></u-image>
							  </view>
							</view>
							<view @click="imgClick(item.certificateUrl)" v-if="item.certificateUrl && isShowCertificate">
								<view class="u-m-b-10" style="width: 150rpx;text-align: center;">证件照片:</view>
							  <u-image borderRadius="10" width="180rpx" height="180rpx" :src="staticPrefix + item.certificateUrl"></u-image>
							</view>
						</u-cell-group>
					</view>
					<view 
						slot="foot" 
						class="u-flex u-flex-wrap u-text-center u-p-20 u-p-l-46 u-p-r-46 img_class" 
						v-if="(item.healthCode && isShowHealthCode) || (item.tourCode && isShowRunCode)">
						<view @click="imgClick(item.healthCode)" v-if="item.healthCode && isShowHealthCode">
							<view class="u-m-b-10">健康码</view>
						  <u-image borderRadius="10" width="180rpx" height="180rpx" :src="staticPrefix + item.healthCode"></u-image>
						</view>
						<view @click="imgClick(item.tourCode)" v-if="item.tourCode && isShowRunCode">
							<view class="u-m-b-10">行程码</view>
						  <u-image borderRadius="10" width="180rpx" height="180rpx" :src="staticPrefix + item.tourCode"></u-image>
						</view>
					</view>
				</my-card>
			</scroll-view>
		</movable-area>
		
		<u-popup :show="qrcodeShow" mode="center" round="10" width="80%" @close="qrcodeShow = false">
			<my-card margin="0" showHead headBorderBottom>
				<template slot="head">
					<view class="u-flex">
						<u-icon name="grid" color="#2979ff"></u-icon>
						<view class="u-flex u-m-l-10 fw700">
							<text>{{ isVisitorQrCode ? '访客码' : '通行码'}}【</text>
							<view class="u-line-1" style="max-width: 70%;">{{ visitorName }}</view>
							<text>】</text>
						</view>
					</view>
				</template>
				<view style="margin: 50rpx auto;text-align: center;" v-if="qrcodeShow">
					<tki-qrcode
						ref="qrcode2" 
						cid="qrcode2"
						:val="isVisitorQrCode ? visitorQrCode : visitorCardNum" 
						:size="460" 
						:loadMake="true" 
						:onval="true" />
				</view>
				
				<view style="color: #2979ff;text-align: center;font-weight: 700;" class="u-flex u-row-center u-p-b-30">
					<text class="u-m-r-60" @click="isVisitorQrCode = !isVisitorQrCode">{{isVisitorQrCode ? '切换通行码' : '切换访客码'}}</text>
					<!-- #ifdef H5 -->
					<view @click="copyQrcode">复制二维码链接</view>
					<!-- #endif -->
					
					<!-- #ifdef MP-WEIXIN -->
					<button open-type="share" class="u-reset-button u-m-0">分享二维码链接</button>
					<!-- #endif -->
				</view>
			</my-card>
		</u-popup>
	</view>
</template>

<script>
	import { details } from '../api/approval.js';
	import uniCopy from '@/components/xb-copy/uni-copy.js'
	import config from '@/config/index.js'
	
	export default {
		data() {
			return {
				visitorEmpArr:[],
				staticPrefix:"",
				isShowHealthCode:false,
				isShowRunCode:false,
				isShowCertificate:false,
				isShowSourceAddr:false,
				qrcodeShow:false,
				visitorName:"",
				visitorId:"",
				visitorNo:"",
				isVisitorQrCode:true,
				visitorQrCode:"",
				visitorCardNum:"",
				isShowQrcode:false
			}
		},
		onLoad(option) {
			this.isShowHealthCode = this.vuex_cfg.isShowHealthCode == 1 ? true : false;
			this.isShowRunCode = this.vuex_cfg.isShowRunCode == 1 ? true : false;
			this.isShowCertificate = this.vuex_cfg.isShowCertificate == 1 ? true : false;
			this.isShowSourceAddr = this.vuex_cfg.isShowSourceAddr == 1 ? true : false;
			this.isShowQrcode = option.isShowQrcode == 1 ? true : false;
			const visitorNo = option.visitorNo;
			details({ visitorNo }).then(r => {
				if(r.data.code === 200){
					let d = r.data.data;
					this.visitorNo = d.visitorNo;
					this.staticPrefix = d.staticPrefix;
					let arr = d.visitors.filter(v => v.visitorCertificateCode);
					this.visitorEmpArr = arr.map(v => ({visitorCompany:d.visitorCompany,...v,visitorGoodImgs:v.visitorGoodImgs && v.visitorGoodImgs.split(',')}))
				}
			})
		},
		onShareAppMessage(res){
			let path = `/pageFk/qrcode-link/qrcode-link?id=${this.visitorId}&num=${this.visitorNo}&t=${this.vuex_cfg.dateType}&sid=${this.vuex_urlobj.sid}`
			return {
				title: '自定义分享标题',
				path: path,
			}
		},
		methods: {
			copyQrcode(){
				let url = `${config.linkUrl}/#/pageFk/qrcode-link/qrcode-link?id=${this.visitorId}&num=${this.visitorNo}&t=${this.vuex_cfg.dateType}&sid=${this.vuex_urlobj.sid}`
				uniCopy({
					content:url,
					success:(res)=>{
						uni.showToast({ title: "复制成功", icon: 'success',duration:3000 })
					},
					error:(e)=>{
						uni.showToast({ title: "复制失败", icon: 'error', duration:3000 })
					}
				})
			},
			qrcodeClick(item){
				this.qrcodeShow = true;
				this.visitorId = item.id;
				this.visitorCardNum = item.visitorCardNum;
				this.visitorQrCode = item.visitorQrCode;
				this.visitorName = item.visitorName;
			},
			imgClick(img){
				uni.previewImage({urls:[this.staticPrefix+img]})
			},
			phoneClick(phone){
				uni.makePhoneCall({ phoneNumber: phone });
			},
			backClick(){
				uni.navigateBack({ delta:1 })
			}
		}
	}
</script>

<style lang="scss">
.infoPage{
	/deep/.u-cell__value {
	  color: #303333 !important;
	  font-size: 28rpx;
		text-align: left;
		padding-left: 16rpx;
		font-weight: 700;
		word-break: break-all;;
	}
	/deep/.u-cell {
	  align-items: flex-start;
		line-height: 48rpx;
	}
	/deep/.u-cell__body{
		padding: 10rpx 16rpx !important;
	}
	/deep/.u-cell_title {
	  font-size: 28rpx;
		width: 120rpx !important;
	}
	.img_class{
		&>view:nth-child(2){
			margin: 0 calc((100% - 540rpx)/2);
		}
	}
}
</style>
