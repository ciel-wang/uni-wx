<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
      <view class="erweimaPage">
        <my-card margin="20rpx" padding="20rpx" border-radius="30" showHead headBorderBottom>
					<view slot="head" class="u-flex">
						<u-icon name="shuxian" custom-prefix="custom-icon"></u-icon>
						<text class="fw700">通行码</text>
					</view>
					
          <view class="u-font-30 u-p-t-80 u-p-b-80 u-text-center" v-if="erweimaVal.length <= 0">您暂未开通二维码，请联系管理员</view>
          
          <view @click="maskShow = true" v-else class="u-m-b-68 u-text-center">
						<tki-qrcode ref="qrcode" cid="mjqrcode" :val="erweimaVal" :size="360" @result="erweimaR" :loadMake="true" :onval="true" />
            <view class="u-m-t-30 u-font-36">请将二维码对准摄像头</view>
          </view>
        </my-card>
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
  import { mjList } from '../mj.js';
  
  export default{
		components: { tkiQrcode },
    data(){
      return{
        maskShow:false,
        erweimaVal:'',
        erweimaImage:""
      }
    },
    onLoad() {
      this.initData()
    },
    methods: {
      initData() {
        mjList().then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            this.erweimaVal = data.mjQrcode;
          }
        });
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

<style lang="scss" scoped>
  .erweimaPage{
    background: url(http://qs.aiwld.com.cn/static/app/bg7%20%281%29.png) no-repeat center 0;
    background-size: 100%;
    padding-top: 240rpx;
  }
</style>
