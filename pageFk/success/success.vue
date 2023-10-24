<template>
	<view style="height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;">
		<u-image src="http://qs.aiwld.com.cn/static/app/success.png" width="300rpx" height="280rpx"></u-image>
		<view class="u-m-t-30 u-m-b-20 u-tips-color">提交成功，单据审核通过后即可进入园区</view>
		<view class="u-tips-color">{{diffTime}}分钟后可重新扫码查看单据状态</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				diffTime:0
			}
		},
		onLoad(option) {
			this.diffTime = option.diffTime || 0;
		}
	}
</script>
