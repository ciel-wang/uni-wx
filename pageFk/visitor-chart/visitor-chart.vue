<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
      <scroll-view scroll-y style="height: 100%;width: 100%;">
        <view class="visitorchartPage">
          <view class="visitorchartPage_first">
            <view class="charts-box">
              <qiun-data-charts
                type="arcbar"
                :chartData="chartData"
                background="none"
                :opts="{title:{name:'本月累计来访'}}"
              />
              <text class="charts-box_text">{{value}}</text>
            </view>
            <view class="u-flex u-row-around visitorchartPage_last">
              <view class="last_item">
                <text>今日预约</text>
                <view class="u-m-t-10"><text class="fw700 u-m-r-10">{{todaySubscribeCount}}</text>人</view>
              </view>
              <view class="last_item">
                <text>今日来访</text>
                <view class="u-m-t-10"><text class="fw700 u-m-r-10">{{todayComeToCount}}</text>人</view>
              </view>
              <view class="last_item">
                <text>今日未离访</text>
                <view class="u-m-t-10"><text class="fw700 u-m-r-10">{{todayNoLeaveCount}}</text>人</view>
              </view>
            </view>
          </view>
          <!-- 超时未离访名单部分 -->
          <my-card margin="20rpx 0" :border-radius="30" showHead headBorderBottom>
            <view slot="head" class="u-flex">
							<u-icon name="shuxian" custom-prefix="custom-icon"></u-icon>
              <text>超时未离访名单</text>
            </view>
            <view class="cardBodyClass">
              <view class="fw700 u-flex u-text-center u-p-t-20 u-p-b-20" style="background-color: #E9E8E8;">
                <view class="u-width-50">访客</view>
                <view class="u-width-50">被访人</view>
              </view>
              <view v-for="(item,i) in inoutArr" :key="i" class="u-flex u-text-center u-p-t-20 u-p-b-20 cardBodyClass_item">
                <view class="u-width-50 u-flex">
									<view class="u-m-r-6 u-line-1" style="max-width: calc(100% - 200rpx);">{{item.visitorName}}</view>
                  <text>{{item.visitorPhone}}</text>
                </view>
                <view class="u-width-50 u-flex">
									<view class="u-m-r-6 u-line-1" style="max-width: calc(100% - 200rpx);">{{item.targetVisitorEmpName}}</view>
                  <text>{{item.targetVisitorEmpPhone}}</text>
                </view>
              </view>
            </view>
            <view 
              slot="foot" 
              class="u-text-center u-flex u-row-around" 
              @click="$u.route('/pageFk/overtime-noleave/overtime-noleave')">
              <view style="width: 33%;overflow: hidden;">----------------</view>
              <view class="u-width-33 u-flex u-row-center">
                <text class="u-m-r-10">查看更多</text>
                <u-icon name="arrow-right"></u-icon>
              </view>
              <view style="width: 33%;overflow: hidden;">----------------</view>
            </view>
          </my-card>
          
          <my-card margin="20rpx 0" :border-radius="30" :bodyStyle="{padding:'0 30rpx'}" showHead headBorderBottom>
            <view slot="head" class="u-flex">
							<u-icon name="shuxian" custom-prefix="custom-icon"></u-icon>
              <text>被访事由分析</text>
            </view>
            <view style="width: 100%;" :style="{height:barHeight +'rpx'}">
              <qiun-data-charts
                type="bar"
                :chartData="chartData2"
                background="none"
                :opts="{legend:{show:false},xAxis:{disabled:true},series:{format:'percentage'}}"
                formatter="percentage"
              />
            </view>
          </my-card>
        </view>
      </scroll-view>
    </movable-area>
  </view>
</template>

<script>
  import { getData } from '../api/chart.js'
  export default {
    data() {
      return {
        chartData:{},
        value:0,
        inoutArr:[],
        barHeight:200,
        chartData2:{},
        todaySubscribeCount:0,
        todayNoLeaveCount:0,
        todayComeToCount:0
      }
    },
    onLoad() {
      let colorArr = ['#58BC3B','#FF3C4F','#E38FEB','#00BEE9','#949FA8'];
      getData().then(r => {
        if(r.data.code == 200){
          let d = r.data.data;
          this.value = d.monthComeToCount;
          this.todaySubscribeCount = d.todaySubscribeCount
          this.todayNoLeaveCount = d.todayNoLeaveCount;
          this.todayComeToCount = d.todayComeToCount;
          this.inoutArr = d.timeOutNoLeaveData;
					this.chartData = {
						series:[{
							"data": d.monthSubscribeCount ? (d.monthComeToCount / d.monthSubscribeCount) : 0,
							"color": "#ffffff"
						}],
					}
          let arr = [],arr2 = [],sum = 0;
          d.causes.forEach((v,i) => {
            sum += v.value*1;
          })
          d.causes.forEach((v,i) => {
            arr.push({
              value:((v.value / sum)*100).toFixed(1),
              color:colorArr[i],
            })
            arr2.push(v.name)
          })
					this.chartData2 = {
						categories:arr2,
						series:[{
						  data:arr,
						  format:'percentage'
						}],
					}
          this.barHeight = arr.length * 100
        }
      })
    },
    methods: {
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
</script>

<style lang="scss">
.visitorchartPage{
  padding: 0 20rpx 20rpx;
  &_first{
    background: url(https://qs.aiwld.com.cn/static/app/bg6.png) no-repeat;
    background-size: 100%;
    border-radius: 30rpx;
    padding-top: 20rpx;
    text-align: center;
  }
	&_last{
		color: #fff;
		margin-top: 20rpx;
		padding: 30rpx 0;
		background-color: #007ADC;
		border-radius: 0 0 30rpx 30rpx;
		.last_item{
			width: 32%;
			border-left: 1rpx solid #fff;
			&:first-child{
				border-left: none;
			}
		}
	}
	.charts-box{
	  width: 100%;
	  height:260rpx;
	  position: relative;
	  &_text{
	    position: absolute;
	    top: 60%;
	    left: 49%;
	    color: #fff;
	    font-weight: 700;
	  }
	}
  .cardBodyClass{
    &_item:nth-child(odd){
      background-color: #E9E8E8;
    }
  }
}
</style>
