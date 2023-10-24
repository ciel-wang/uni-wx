<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="my_notice"></view>
		</movable-area>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			backClick(){
				uni.switchTab({ url:'/pages/home/home' })
			}
		}
	}
</script>

<style>
.my_notice{
	height: 400rpx;
	background: linear-gradient(180deg, rgba(58, 214, 20, 0.15) 0%, rgba(58, 214, 20, 0) 100%);
}
</style>
