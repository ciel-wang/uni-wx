<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			
			<view class="wrap">
				<u-tabs ref="tabs" :list="list" :activeStyle="{color:'#f29100'}" :current="current" :scrollable="false" @change="change"></u-tabs>
				<swiper class="swiper-box" :current="swiperCurrent" @change="swiperChange">
				  <swiper-item class="swiper-item" item-id="0">
				    <details-item ref="detailsItem1" :dayDate="dayDate" :classId="classId" :schemaCode="schemaCode"></details-item>
				  </swiper-item>
				  
				  <swiper-item class="swiper-item" item-id="1">
				    <details-item ref="detailsItem2" :dayDate="dayDate" :classId="classId" :schemaCode="schemaCode"></details-item>
				  </swiper-item>
				  
				  <swiper-item class="swiper-item" item-id="2">
				    <details-item ref="detailsItem3" :dayDate="dayDate" :classId="classId" :schemaCode="schemaCode"></details-item>
				  </swiper-item>
				</swiper>
				
			</view>
		</movable-area>
	</view>
</template>

<script>
	import detailsItem from '../details-item.vue'
	export default {
		components:{ detailsItem },
		data() {
			return {
				list:[{name:"不在校"},{name:"请假"},{name:"在校"}],
				current: 0,
				swiperCurrent:0,
				dayDate:'',
				classId:'',
				schemaCode:""
			}
		},
		onLoad(options) {
		  this.dayDate = options.dayDate;
		  this.classId = options.classId;
		  this.schemaCode = options.schemaCode;
		  if(options.sourceType){
		    let sourceType = options.sourceType;
		    this.current = sourceType == 'out' ? 0 : sourceType == 'in' ? 2 : 1
		    this.swiperCurrent = this.current;
		  }
		  this.$nextTick(function(){
		    if(this.current == 0){
		      this.$refs.detailsItem1.switchItem(this.current)
		    }else if(this.current == 1){
		      this.$refs.detailsItem2.switchItem(this.current)
		    }else{
		      this.$refs.detailsItem3.switchItem(this.current)
		    }
		  })
		},
		methods: {
			change({index}){
				this.swiperCurrent = index;
			},
			swiperChange({ detail: { current } }){
				if(current == this.current) return;
				this.current = current;
				if(current == 0){
				  this.$refs.detailsItem1.switchItem(current)
				}else if(current == 1){
				  this.$refs.detailsItem2.switchItem(current)
				}else{
				  this.$refs.detailsItem3.switchItem(current)
				}
			},
			backClick(){
				uni.redirectTo({ url:"../chart-analysis/chart-analysis" })
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
}
.swiper-item {
	height: 100%;
}
</style>
