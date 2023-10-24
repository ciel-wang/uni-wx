<template>
  <view class="contactusPage bgfff">
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
      <view class="u-p-t-60">
        <view class="contactusPage_top">
          <view class="u-flex u-row-center">
            <u-image src="/static/images/wxerweima.png" :width="297*1.5" :height="306*1.5"></u-image>
          </view>
          <view class="u-m-t-10 u-tips-color">技术咨询可添加微信</view>
        </view>
        
        <view class="u-p-l-60 u-flex u-col-center">
          <u-icon name="server-fill" size="40" customStyle="margin-left:4rpx"></u-icon>技术支持:
          <text class="u-m-r-30 u-m-l-20 c007AFF" @click="phoneClick('15353510079')">15353510079</text>
          <text class="c007AFF" @click="phoneClick('13720614891')">13720614891</text>
        </view>
      </view>
    </movable-area>
  </view>
</template>

<script>
  export default {
    methods: {
      phoneClick(phone) {
        uni.makePhoneCall({ phoneNumber: phone });
      },
      backClick(){
        uni.switchTab({ url:'../home' })
      }
    }
  }
</script>

<style lang="scss">
.contactusPage{
  &_top{
    padding: 30rpx;
    margin: 0 60rpx 60rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    border-radius: 30rpx;
  }
  .c007AFF{
    color: #007AFF;
  }
}
</style>
