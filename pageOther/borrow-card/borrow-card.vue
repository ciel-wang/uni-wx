<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<view class="u-p-t-30"></view>
				<my-card padding="0" margin="0 30rpx">
					<view class="info_body_class">
						<view class="fw700 u-font-38">{{cardInfo.empName}}</view>
						<view class="u-m-t-30 u-m-b-50">No. {{cardInfo.empCode}}</view>
						<view class="u-flex u-row-between">
							<view>
								<view class="u-flex">累计借书 <text class="u-m-l-20">{{cardInfo.accumulationTotal}} 本</text></view>
								<view class="u-flex u-m-t-20 u-m-b-20">到期应还 <text class="u-m-l-20">{{cardInfo.expireCount}} 本</text></view>
								<view class="u-flex">逾期未还 <text class="u-m-l-20">{{cardInfo.overdueCount}} 本</text></view>
							</view>
							
							<view class="bgfff u-p-20" @click="maskShow = true" style="border-radius: 16rpx;">
								<tki-qrcode
									ref="qrcode" cid="borrowCardQrcode" 
									:loadMake="true" :onval="true"
									:size="100" 
									:val="erweimaVal"
									@result="erweimaR" />
							</view>
						</view>
					</view>
				</my-card>
				
				<view class="u-p-30">
					<u-parse :content="rulesDesc"></u-parse>
				</view>
			</scroll-view>
		</movable-area>
		
		<u-overlay :show="maskShow" @click="maskShow = false" customStyle="backgroundColor:#fff;">
			<view class="w-overlay">
				<u-image :src="erweimaImage" width="500rpx" height="500rpx"></u-image>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import { reqMyCardInfo } from '../library.js'
	
	export default {
		components: { tkiQrcode },
		data() {
			return {
				erweimaVal:"123456789",
				maskShow:false,
				erweimaImage:"",
				cardInfo:{},
				rulesDesc:""
			}
		},
		onLoad() {
			reqMyCardInfo().then(r => {
				this.cardInfo = r.data.data || {}
				this.rulesDesc = r.data.data.desc;
			})
		},
		methods: {
			erweimaR(val){
				this.erweimaImage = val;
			},
			backClick(){
				uni.navigateBack({ delta:1 })
			}
		}
	}
</script>

<style scoped>
.info_body_class{
	background: url(http://qs.aiwld.com.cn/static/app/bg1.png) no-repeat center center;
	background-size: 100% 100%;
	padding: 30rpx;
	color: #fff;
}
</style>
