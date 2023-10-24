<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
			<record-item ref="recordItem2" sourcePage="targetInvite"></record-item>
    </movable-area>
  </view>
</template>

<script>
  import recordItem from '../record-item.vue'
	export default{
		components:{ recordItem },
		onReady() {
			this.$refs.recordItem2.switchItem();
		},
		onBackPress(e) {
		  this.$refs.recordItem2.switchItem();
		},
		methods:{
			backClick() {
			  uni.switchTab({ url:'/pages/index/index' })
			},
		}
	}

</script>