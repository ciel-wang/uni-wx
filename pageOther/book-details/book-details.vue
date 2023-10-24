<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			<book-details-item ref="bookDetailsItemRef"></book-details-item>
		</movable-area>
	</view>
</template>

<script>
	import bookDetailsItem from '../book-details-item.vue'
	
	export default {
		components:{ bookDetailsItem },
		data() {
			return {
				
			}
		},
		onLoad(options) {
			let { id } = options;
			this.$nextTick(() => {
				this.$refs.bookDetailsItemRef.openComponts(id);
			})
		},
		methods: {
			backClick(){
				uni.navigateBack({ delta:1 })
			}
		}
	}
</script>
