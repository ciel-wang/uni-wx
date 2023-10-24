<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
    	<movable-view direction="all" :out-of-bounds="false">
    		<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
    	</movable-view>
      
      <view class="erweimaPage">
        <my-card padding="20rpx" margin="20rpx 0" border-radius="30" showHead headBorderBottom>
					<view slot="head" class="u-flex">
						<u-icon name="shuxian" custom-prefix="custom-icon"></u-icon>
						<text class="fw700">向商家付款</text>
					</view>
					<view class="u-font-30 u-p-t-80 u-p-b-80 u-text-center" v-if="erweimaVal.length<=0">您暂未开通二维码支付，请先开通</view>
					<view v-else>
						<view @click="maskShow = true" class="u-text-center">
							<tki-qrcode
								ref="qrcode"
								cid="xfqrcode"
								:val="erweimaVal"
								:size="360"
								@result="erweimaR"
								:loadMake="true"
								:onval="true" />
						</view>
						<view class="u-m-t-30 u-font-24 u-light-color u-flex u-row-center">一码通自动
							<text style="color: #007AFF;" class="u-m-l-10 u-font-28" @click="pay">刷新</text>
						</view>
					</view>
        </my-card>
        <view class="u-flex u-col-center u-text-center bgfff u-borderR-30 u-p-t-30 u-p-b-30">
          <view @click="$u.route('/pageXf/bill/bill?sourceType=erweima')" class="u-border-right u-width-50 u-flex-col u-row-center u-col-center">
            <u-icon name="zhangdan" custom-prefix="custom-icon" size="40"></u-icon>
            <view class="u-m-t-10">账单</view>
          </view>
          <view @click="$u.route('/pageXf/wallet/index?sourceType=erweima')" class="u-width-50 u-text-center u-flex-col u-row-center u-col-center">
            <u-icon name="yue" custom-prefix="custom-icon" size="40"></u-icon>
            <view class="u-m-t-10">余额</view>
          </view>
        </view>
      </view>
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
  import {payQrcode} from "../xf.js"
  
  export default {
		components: { tkiQrcode },
    data() {
      return {
        erweimaVal:"123",
        erweimaImage:"",
        maskShow:false
      }
    },
    onShow() {
    	// this.pay();
    },
    methods: {
      pay(){
      	payQrcode().then(res => {
      		if(res.data.code == 200){
      			this.erweimaVal = res.data.data.qrcode;
      		}
      	})
      },
      erweimaR(v){
      	this.erweimaImage = v;
      },
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
</script>

<style lang="scss">
  .erweimaPage{
    background: url(http://qs.aiwld.com.cn/static/app/bg3.png) no-repeat center 0;
    background-size: 100%;
    padding: 240rpx 20rpx 0;
  }
</style>
