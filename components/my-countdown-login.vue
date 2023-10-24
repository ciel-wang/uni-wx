<template>
	<view>
		<u-popup :show="show" mode="center" round="10">
		  <view class="u-p-30 u-p-t-40 u-p-b-40 u-text-center">
		    <view class="u-m-b-20">请先登录</view>
		    <view>
		      <text style="color: red;margin-right: 10rpx;">{{ dateTime }}</text>
		      秒后将跳转到登录页面
		    </view>
		  </view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"my-countdown-login",
		data() {
			return {
				show:false,
				timer:null,
				dateTime:3
			};
		},
		destroyed() {
			clearInterval(this.timer);
		},
		methods:{
			start(){
				this.show = true;
				this.dateTime = 3;
				var timer = setInterval(() => {
				  if (this.dateTime <= 1) {
				    uni.redirectTo({ url:'/pages/login/login' });
				    this.show = false;
				    clearInterval(timer);
				  } else {
				    this.dateTime -= 1;
				  }
				}, 1000);
			}
		}
	}
</script>

<style>

</style>