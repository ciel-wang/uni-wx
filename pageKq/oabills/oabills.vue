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
				    <receipt-records ref="recordsRef1"></receipt-records>
				  </swiper-item>
				  
				  <swiper-item class="swiper-item" item-id="1">
				    <receipt-records ref="recordsRef2"></receipt-records>
				  </swiper-item>
				  
				  <swiper-item class="swiper-item" item-id="2">
				    <receipt-records ref="recordsRef3"></receipt-records>
				  </swiper-item>
				</swiper>
      </view>
    </movable-area>
  </view>
</template>

<script>
  import receiptRecords from '../receiptRecords.vue'
  
  export default {
    components:{receiptRecords},
    data() {
      return {
        list:[{name:"我发起的"},{name:"抄送我的"},{name:"我审批的"}],
        current: 0,
        swiperCurrent: 0,
      }
    },
    onLoad(options) {
      if(options.who){
        let who = options.who;
        this.current = who == 'me' ? 0 : who == 'you' ? 2 : 1
        this.swiperCurrent = this.current;
      }
      this.$nextTick(function(){
        if(this.current == 0){
          this.$refs.recordsRef1.switchItem(this.current)
        }else if(this.current == 1){
          this.$refs.recordsRef2.switchItem(this.current)
        }else{
          this.$refs.recordsRef3.switchItem(this.current)
        }
      })
    },
    methods: {
      change({index}) {
      	this.swiperCurrent = index;
      },
			swiperChange({ detail: { current } }){
				if(current == this.current) return;
				this.current = current;
				if(current == 0){
				  this.$refs.recordsRef1.switchItem(current)
				}else if(current == 1){
				  this.$refs.recordsRef2.switchItem(current)
				}else{
				  this.$refs.recordsRef3.switchItem(current)
				}
			},
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
</script>

<style scoped>
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
