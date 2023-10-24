<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "./static/iconfont/iconfont.css";
	@import "@/uni_modules/uview-ui/index.scss";
	@import "./static/common.scss";
	page{
		background-color: $uni-bg-color-grey;
		width: 100%;
		height: 100%;
		font-size: 32rpx;
		>view{
			height: 100%;
			>movable-area{
				height: 100%;
				>movable-view{
					height: 90rpx;
					width: 90rpx;
					// position: fixed;
					z-index: 1000;
					top: 80%;
					left: 70%;
				}
			}
		}
		
		/deep/.u-form-item{
			margin-bottom: 20rpx !important;
		}
	}
</style>
