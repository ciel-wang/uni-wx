<template>
  <view>
    <movable-area style="height: 100%;width: 100%;">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
      <scroll-view scroll-y style="width: 100%;height: 100%;" >
        <view class="statisticsPage">
          <view class="top u-flex">
						<view class="u-flex">
							{{ AccTransTime }}
							<u-icon name="arrow-down-fill" color="#fff" customStyle="margin:0 40rpx 0 10rpx" @click="pickerShow = true"></u-icon>
						</view>
						<view class="u-m-l-80 u-flex">
							<text class="u-m-r-30 border" :class="[activeName == 1 ? 'borderShow' : '']" @click="activeName = 1;initData()">收入</text>
							<text class="border" :class="[activeName == 2 ? 'borderShow' : '']" @click="activeName = 2;initData()">支出</text>
						</view>
          </view>
          
          <view class="body">
            <view>当月{{activeName == 1 ? '收入' : '支出'}}{{xfCount}}笔，合计</view>
            <view class="u-flex u-font-48 u-m-t-30 u-p-b-10" style="border-bottom: 1rpx dashed #ccc;">￥<text class="u-m-l-10 fw700">{{xfTotalMoney}}</text></view>
						
            <view class="u-m-t-40 fw700 u-m-b-20">月度{{activeName == 1 ? '收入' : '支出'}}对比</view>
            <view class="charts-box">
              <qiun-data-charts
                type="column"
                :localdata="localdata"
                background="none"
                :inScrollView="true"
								:canvas-id="$u.guid()"
								canvas2d
                @getIndex="getChartItem"
                :opts="{ 
									xAxis:{format:'monthXaxis',marginTop:10},
									yAxis:{disabled:true,disableGrid:true}
								}"
                :loadingType="1"
              />
            </view>
            
            <view class="bordertop u-flex" v-show="activeName == 2">当月支出统计
              <text class="u-font-24 u-m-l-6" style="color: #bab8b9;font-weight: 400;">点击图表查看明细</text>
            </view>
            <view class="charts-box" style="height: 240px;" v-show="activeName == 2">
              <qiun-data-charts
                type="ring"
                :chartData="chartData2"
                background="none"
								:canvas-id="$u.guid()"
								canvas2d
                :reshow="activeName == 2"
								:opts="{legend:{position:'right'},dataLabel:false,padding:[5,35,5,5]}"
              />
            </view>
            
            <view class="bordertop u-flex">当月{{activeName == 1 ? '收入' : '支出'}}分析
              <text class="u-font-24 u-m-l-6" style="color: #bab8b9;font-weight: 400;" v-show="activeName == 1">点击图表查看明细</text>
            </view>
            <view class="charts-box" v-show="activeName == 1">
              <qiun-data-charts
                type="ring"
                :chartData="chartData"
                background="none"
								:canvas-id="$u.guid()"
								canvas2d
								tooltipFormat="xfStatisticsTip"
                :reshow="activeName == 1"
              />
            </view> 
            <view v-show="activeName == 2">
              <view v-for="(item,index) in devXfDatas" :key="index" class="u-flex u-row-around u-col-center u-m-b-10" v-show="item.money != 0">
                <view class="u-flex u-col-center u-width-70">
                  <u-icon :name="item.iconName" :color="item.iconColor" custom-prefix="custom-icon" size="60"></u-icon>
                  <text class="u-m-l-30">{{item.name}}</text>
                </view>
                <view class="fw700 u-width-20">￥{{item.money}}</view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </movable-area>
		
		<u-datetime-picker
			:show="pickerShow" 
			mode="year-month" 
			:maxDate="new Date().getTime()" :minDate="0" 
			@confirm="pickerConfirm" @cancel="pickerShow = false"></u-datetime-picker>
  </view>
</template>

<script>
  import { getXfIncomeStatistics, getXfOutcomeStatistics } from '../xf.js'
  export default {
    data() {
      return {
        AccTransTime:uni.$u.timeFormat(new Date(), 'yyyy年mm月'),
        date:uni.$u.timeFormat(new Date(), 'yyyy-mm'),
        pickerShow:false,
        activeName:1,
        localdata:[],
        chartData:{},
        xfCount:0,
        xfTotalMoney:0,
        devXfDatas:[],
        chartData2:{}
      }
    },
    onLoad() {
      this.initData()
    },
    methods: {
      initData(){
        this.localdata = []
        if(this.activeName == 1){
          getXfIncomeStatistics({date:this.date}).then(r => {
            if(r.data.code == 200){
              let d = r.data.data
              this.xfTotalMoney = d.inComeData.rechargeTotalMoney;
              this.xfCount = d.inComeData.rechargeCount;
              let arr1 = d.monthStatisticsData.map(v => ({ value:v.inComeTotalMoney*1, text:v.month }));
              let arr2 = [
								{value:d.inComeData.personRechargeMoney*1 == 0 ? 0 : d.inComeData.personRechargeMoney*1,name:`个人充值(${d.inComeData.personRechargeMoney*1 == 0 ? 0 : d.inComeData.personRechargeMoney*1})`},
								{value:d.inComeData.subsidyRechargeMoney*1,name:`补贴充值(${d.inComeData.subsidyRechargeMoney*1})`},
								{value:d.inComeData.otherRechargeMoney*1,name:`第三方充值(${d.inComeData.otherRechargeMoney*1})`},
								{value:d.inComeData.dkjcMoney*1,name:`消费退款(${d.inComeData.dkjcMoney*1})`}
							]
              this.localdata = arr1.reverse();
							this.chartData = {
								series:[{ data:arr2 }]
							}
            }else{
              this.localdata = [];
							this.chartData = {
								series:[{ 
									data:[
										{value:0,name:"个人充值"},
										{value:0,name:"补贴充值"},
										{value:0,name:"第三方充值"},
										{value:0,name:'消费退款'}
									]
								}]
							}
            }
          })
        }else{
          getXfOutcomeStatistics({date:this.date}).then(r => {
            if(r.data.code == 200){
              let d = r.data.data
              this.xfTotalMoney = (d.outComeData.xfTotalMoney*1 + d.outComeData.mngMoney*1).toFixed(2);
              this.xfCount = d.outComeData.xfCount;
              let arr1 = [],arr2 = [];
              d.monthStatisticsData.forEach(v => {
                arr1.push({
                  value:v.outComeTotalMoney*1,
                  text:v.month
                })
              })
              this.localdata = arr1.reverse()
              d.typeStatisticsData.forEach(v => {
                if(v.type == 4){
                  v.iconName = 'xfzhangdan-canting';
                  v.iconColor = '#F42C2F';
                }
								if(v.type == 9){
								  v.iconName = 'xfzhangdan-tixian';
								  v.iconColor = '#DC9E52';
									v.name = "节能钱包转出"
								}
                if(v.type == 5 || v.type == 6 || v.type == 8 || v.type == 10 || v.type == 'glf' || v.type == 12){
                  v.iconName = 'xfzhangdan-gongsi';
                  v.iconColor = '#1BBB71';
                  if(v.type == 5){
                    v.name = "个人钱包退款"
                  }else if(v.type == 6){
                    v.name = '销户退款'
                  }else if(v.type == 8){
                    v.name = '补贴清零'
                  }else if(v.type == 10){
                    v.name = '补贴退款'
                  }else if(v.type == 'glf'){
                    v.name = "管理费"
                  }else if(v.type == 12){
										v.name = "第三方提现"
									}
                }
              })
              this.devXfDatas = d.typeStatisticsData;
              
              let zcObj = d.zcStatisticsData;
							let sum = zcObj.btMoneyTotal*1+zcObj.btqlMoneyTotal*1+zcObj.mngMoneyTotal*1+zcObj.txMoneyTotal*1+zcObj.xfMoneyTotal*1+zcObj.xhMoneyTotal*1+zcObj.dsftxMoneyTotal*1+zcObj.zzMoneyTotal*1;
							let chartDataArr = [
								{value:zcObj.btMoneyTotal*1,name:'补贴退款',legendText:`补贴退款(${sum > 0 && zcObj.btMoneyTotal > 0 ? (zcObj.btMoneyTotal*100/sum).toFixed(1) : 0}%)`},
								{value:zcObj.btqlMoneyTotal*1,name:'补贴清零',legendText:`补贴清零(${sum > 0 && zcObj.btqlMoneyTotal > 0 ? (zcObj.btqlMoneyTotal*100/sum).toFixed(1) : 0}%)`},
								{value:zcObj.mngMoneyTotal*1,name:'管理费',legendText:`管理费(${sum > 0 && zcObj.mngMoneyTotal > 0 ? (zcObj.mngMoneyTotal*100/sum).toFixed(1) : 0}%)`},
								{value:zcObj.txMoneyTotal*1,name:'提现',legendText:`提现(${sum > 0 && zcObj.txMoneyTotal > 0 ? (zcObj.txMoneyTotal*100/sum).toFixed(1) : 0}%)`},
								{value:zcObj.xfMoneyTotal*1,name:'消费',legendText:`消费(${sum > 0 && zcObj.xfMoneyTotal > 0 ? (zcObj.xfMoneyTotal*100/sum).toFixed(1) : 0}%)`},
								{value:zcObj.xhMoneyTotal*1,name:'销户退款',legendText:`销户退款(${sum > 0 && zcObj.xhMoneyTotal > 0 ? (zcObj.xhMoneyTotal*100/sum).toFixed(1) : 0}%)`},
								{value:zcObj.dsftxMoneyTotal*1,name:'第三方提现',legendText:`第三方提现(${sum > 0 && zcObj.dsftxMoneyTotal > 0 ? (zcObj.dsftxMoneyTotal*100/sum).toFixed(1) : 0}%)`},
								{value:zcObj.zzMoneyTotal*1,name:'节能钱包转出',legendText:`节能钱包转出(${sum > 0 && zcObj.zzMoneyTotal > 0 ? (zcObj.zzMoneyTotal*100/sum).toFixed(1) : 0}%)`}
							];
              this.chartData2 = {
								series:[{ data:chartDataArr }]
							}
            }else{
              this.localdata = []
              this.devXfDatas = []
            }
          })
        }
      },
      getChartItem({currentIndex,opts}){
        let index = currentIndex.index;
        if(index >= 0){
          let arr = opts.categories
          let arr2 = arr[index].split('-')
          this.AccTransTime = arr2[0] + '年' + arr2[1] + '月'
          this.date = arr[index]
          this.initData()
        }
      },
      pickerConfirm(e){
				this.AccTransTime = uni.$u.timeFormat(e.value,'yyyy年mm月');
				this.date = uni.$u.timeFormat(e.value,'yyyy-mm');
        this.initData()
      },
      backClick(){
        uni.redirectTo({ url:'../bill/bill' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .statisticsPage{
    position: relative;
    .top{
      background-color: #007AFF;
      padding: 36rpx 20rpx;
      color: #fff;
    }
    .body{
      position: absolute;
      top: 186rpx;
			left: 30rpx;
			right: 30rpx;
      z-index: 200;
      // background: url(/static/img/bg5.png) no-repeat center 0;
      // padding: 60rpx 80rpx 20rpx 80rpx;
      // background-size: calc(100% - 40rpx) 100%;
      padding-bottom: 30rpx;
      
      .bordertop{
        padding: 40rpx 0 20rpx;
        border-top: 1rpx dashed #ccc;
        margin-top: 30rpx;
        font-weight: 700;
      }
    }
  }
	.border{
		border-radius: 30rpx;
		border: 1rpx solid transparent;
		color: #e0e0e0;
		padding: 10rpx 30rpx;
	}
  .borderShow{
		border-color: #fff;
  }
  .charts-box{
    width: 100%;
    height:150px;
    // margin-left: -20rpx;
  }
</style>
