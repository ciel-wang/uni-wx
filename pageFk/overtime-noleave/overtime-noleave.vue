<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
      <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="scrolltolower">
        <view class="overNoLeave">
          <view class="cfff">{{nowDay}}</view>
          <u-empty text="没有数据" mode="search" v-if="inoutArr.length <= 0"></u-empty>
          <my-card v-else margin="40rpx 0 0" :border-radius="30" showHead headBorderBottom>
						<view slot="head" class="headerClass">超时未离访名单</view>
            <view class="cardBodyClass">
              <view class="fw700 u-flex u-text-center u-p-t-20 u-p-b-20" style="background-color: #E9E8E8;">
                <view class="u-width-50">访客</view>
                <view class="u-width-50">被访人</view>
              </view>
              <view v-for="(item,i) in inoutArr" :key="i" class="u-flex u-text-center u-p-t-20 u-p-b-20 cardBodyClass_item">
                <view class="u-flex u-width-50">
									<view class="u-m-r-6 u-line-1" style="max-width: calc(100% - 200rpx);">{{item.visitorName}}</view>
                  <text>{{item.visitorPhone}}</text>
                </view>
                <view class="u-flex u-width-50">
									<view class="u-m-r-6 u-line-1" style="max-width: calc(100% - 200rpx);">{{item.targetVisitorEmpName}}</view>
                  <text>{{item.targetVisitorEmpPhone}}</text>
                </view>
              </view>
            </view>
          </my-card>
        </view>
        <u-loadmore :status="loadStatus" v-if="inoutArr.length > 0" />
      </scroll-view>
    </movable-area>
  </view>
</template>

<script>
  import { getOverNoLeaveData } from '../api/chart.js'
  
  export default {
    data() {
      return {
        nowDay:uni.$u.timeFormat(new Date(), 'yyyy年mm月dd日'),
        inoutArr:[],
        current:1,
        pageCount: 1,
        loadStatus: 'nomore',
      }
    },
    onLoad() {
      this.initData()
    },
    methods: {
      initData(){
        getOverNoLeaveData({current:this.current}).then(r => {
          let d = r.data.data
          this.pageCount = d.pages
          this.inoutArr = [...this.inoutArr,...d.records]
        })
      },
      scrolltolower() {
        if (this.current > this.pageCount) {
          this.loadStatus = 'nomore';
        } else {
          this.current = ++this.current;
          this.initData();
        }
      },
      backClick(){
        uni.redirectTo({ url:'../visitor-chart/visitor-chart' })
      },
    }
  }
</script>

<style lang="scss" scoped>
.overNoLeave{
  background: url(http://qs.aiwld.com.cn/static/app/bg6.png) no-repeat;
  background-size: 100%;
  padding: 40rpx 20rpx;
  .headerClass{
    font-weight: 700;
    &::before{
      content: "";
      padding: 10rpx 6rpx;
      background-color: #007AFF;
      border-radius: 10rpx;
      margin-right: 10rpx;
    }
  }
  .cardBodyClass{
    &_item:nth-child(odd){
      background-color: #E9E8E8;
    }
  }
}
</style>
