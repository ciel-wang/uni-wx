<template>
  <view class="u-p-t-30">
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      <my-card margin="0 20rpx">
        <view slot="head" class="u-font-32 fw700">出入寝时间</view>
        <view class="u-m-b-10" v-for="v in inoutDormTimeArr" :key="v.id">
          <text class="u-m-r-30">{{v.startTime}} - {{v.endTime}}</text>
          <text v-if="v.inOrOut == 1 && v.isErrStatus">出寝</text>
          <text v-if="v.inOrOut == 2 && v.isErrStatus">归寝</text>
        </view>
      </my-card>
    </movable-area>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        inoutDormTimeArr:[]
      }
    },
    onLoad(options) {
      if(options.obj){
        this.inoutDormTimeArr = JSON.parse(options.obj)
      }
    },
    methods: {
      backClick(){
        uni.redirectTo({ url:'../indorm-monitor/indorm-monitor' })
      }
    }
  }
</script>
