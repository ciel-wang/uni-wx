<template>
	<view class="u-time-axis">
		<view class="u-time-axis__node" :style="[nodeStyle]">
			<view>
				<slot name="node">
					<view class="u-time-axis__dot"></view>
				</slot>
			</view>
			<view v-if="isShowLine" class="u-time-axis__line"></view>
		</view>
		
		<view class="u-time-axis__content">
			<slot name="content" />
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-time-axis",
		props: {
			// 节点的背景颜色
			bgColor: {
				type: String,
				default: "#ffffff"
			},
			// 节点左边图标绝对定位的top值
			nodeTop: {
				type: [String, Number],
				default: ""
			},
			isShowLine:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				
			};
		},
		computed: {
			nodeStyle() {
				let style = {
					backgroundColor: this.bgColor,
				};
				if (this.nodeTop != "") style.marginTop = this.nodeTop + 'rpx';
				return style;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-time-axis {
		display: flex;
		width: 100%;
		position: relative;
		&__node{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			font-size: 24rpx;
			margin-right: 20rpx;
			margin-top: -20rpx;
		}
		&__line{
			height: 100%;
			width: 1px;
			border-left: 1px solid #ddd;
		}
		&__dot{
			height: 16rpx;
			width: 16rpx;
			border-radius: 100rpx;
			background: #ddd;
		}
		&__content{
			display: flex;
			flex-direction: column;
			flex: 1;
			margin-bottom: 30rpx;
		}
	}
</style>