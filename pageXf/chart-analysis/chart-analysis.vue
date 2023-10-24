<template>
  <view>
    <movable-area style="height: 100%;width: 100%;">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
      <scroll-view scroll-y class="chartPage">
        <view class="top">
					<view class="status_bar"></view>
          <view class="u-flex u-p-t-60 u-p-b-36 u-p-l-20 u-p-r-20 cfff">
            {{ AccTransTime }}
            <u-icon name="arrow-down-fill" customStyle="margin:0 60rpx 0 10rpx" color="#fff" @click="pickerShow = true"></u-icon>
            <text @click="switchMonthDay" class="u-p-30 u-p-t-10 u-p-b-10 u-borderR-30" style="border: 1px solid #fff;">{{activeName ? '按月统计' : '按日统计'}}</text>
          </view>
          
          <view class="u-text-center cfff u-m-b-30 u-m-t-10">营业额(元)</view>
          <view class="u-text-center cfff u-font-40 fw700">￥{{outTotalMoney}}</view>
          <view class="top_last">
            <view class="u-width-50 u-border-right">
              <text>消费人次</text>
              <view class="u-font-40 u-m-t-10"><text class="fw700 u-m-r-6">{{xfEmpTotalCount}}</text>笔</view>
            </view>
            <view class="u-width-50">
              <text>消费人数</text>
              <view class="u-font-40 u-m-t-10"><text class="fw700 u-m-r-6">{{xfEmpCount}}</text>人</view>
            </view>
          </view>
        </view>
				
        <my-card margin="20rpx" :borderRadius="30">
          <view class="fw700 u-flex">
            <u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
            <text>餐段收入分析</text>
          </view>
          <view style="width: 100%;height: 400rpx;">
            <qiun-data-charts
              type="mix"
              :chartData="chartData"
              background="none"
							:disableScroll="false"
							:canvas-id="$u.guid()"
							canvas2d
              :opts="{yAxis:{
                data:[
                  {disabled:true,position:'right',min:0},
                  {disabled:true,position:'left'}
                ]
              }}"
            />
          </view>
          <view class="fw700 u-p-t-20 u-m-t-20 u-flex" style="border-top: 1rpx dashed #E8E8E8;">
            <u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
            <text>商户收入占比</text>
          </view>
          <view style="width: 100%;height: 400rpx;">
            <qiun-data-charts
              type="rose"
							:disableScroll="false"
							:canvas-id="$u.guid()"
							canvas2d
              :localdata="localdata2"
              background="none"
            />
          </view>
        </my-card>
        <my-card :borderRadius="30">
          <view class="fw700 u-flex">
            <u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
            <text>收入趋势 (单位：万元)</text>
          </view>
          <view style="width: 100%;height: 400rpx;">
            <qiun-data-charts
              type="line"
							:disableScroll="false"
							:canvas-id="$u.guid()"
							canvas2d
              :chartData="chartData3"
              background="none"
            />
          </view>
        </my-card>
      </scroll-view>
    </movable-area>
		
		<u-datetime-picker
			:show="pickerShow" v-model="monthValue"
			:mode="activeName ? 'year-month' : 'date'" 
			:maxDate="new Date().getTime()" :minDate="0" 
			@confirm="pickerConfirm" @cancel="pickerShow = false"></u-datetime-picker>
			
		<u-overlay :show="maskShow">
			<view class="w-overlay">
				<u-loading-icon size="50" color="red"></u-loading-icon>
			</view>
		</u-overlay>
  </view>
</template>

<script>
  import { getXfStatistics } from '../xf.js'
  
  export default {
    data() {
      return {
        AccTransTime:uni.$u.timeFormat(new Date(), 'yyyy年mm月'),
        date:uni.$u.timeFormat(new Date(), 'yyyy-mm'),
        activeName:true,
        pickerShow:false,
        chartData:{},
        outTotalMoney:0,
        xfEmpCount:0,
        xfEmpTotalCount:0,
        localdata2:[],
        chartData3:{},
        maskShow:false,
				monthValue:new Date().getTime()
      }
    },
    onLoad() {
      this.initdata()
    },
    methods: {
      initdata(){
        this.maskShow = true;
        getXfStatistics({date:this.date}).then(r => {
          this.maskShow = false;
          if(r.data.code == 200){
            let d = r.data.data;
            this.xfEmpCount = d.xfData.xfEmpCount;
            this.outTotalMoney = d.xfData.outTotalMoney;
            this.xfEmpTotalCount = d.xfData.xfEmpTotalCount
            let arr1 = [0,0,0,0,0],arr2 = [0,0,0,0,0],arr3 = [0,0,0,0,0]
            d.mealData.forEach(v => {
              arr1[v.mealTypeNum] = (v.outTotalMoney/10000).toFixed(2)
              arr2[v.mealTypeNum] = v.xfEmpCount
              arr3[v.mealTypeNum] = v.xfEmpTotalCount
            })
            this.chartData = {
              categories:['早餐','午餐','晚餐','夜宵','其他'],
              series:[
                {name:"餐段(万元)",data:arr1,type:"column",index:1},
                {name:"人次(次)",data:arr3,type:"line",style:"curve",color:"#EE6666",textColor:'#EE6666'},
                {name:"人数(人)",data:arr2,type:"line",style:"curve",color:"#91CB74",textColor:'#91CB74'}
              ],
            }
            let sellerData = []
            d.sellerData.forEach(v => {
              sellerData.push({
                value:v.outTotalMoney*1,
                text:v.sellerName || ''
              })
            })
            this.localdata2 = sellerData
            let month = [],xfMoney = [],tkMoney = [],income = []
            d.monthStatisticsData.reverse().forEach(v => {
              let dateArr = v.month.split('-');
              let date = dateArr[1]*1 + '月'
              month.push(date)
              xfMoney.push((v.xfMoney/10000).toFixed(2))
              tkMoney.push((v.tkMoney/10000).toFixed(2))
              income.push(((v.xfMoney - v.tkMoney)/10000).toFixed(2))
            })
            this.chartData3 = {
            	categories:month,
            	series:[
            	  {name:"净收入",data:income},
            	  {name:"收入",data:xfMoney},
            	  {name:"退款",data:tkMoney}
            	]
            }
          }else{
            this.xfEmpCount = 0;
            this.outTotalMoney = 0;
            this.xfEmpTotalCount = 0;
            this.chartData = {
              categories:['早餐','午餐','晚餐','夜宵','其他'],
              series:[
                {name:"餐段(万元)",data:[0,0,0,0,0],type:"column",index:1},
                {name:"人次(次)",data:[0,0,0,0,0],type:"line",style:"curve",color:"#EE6666",textColor:'#EE6666'},
                {name:"人数(人)",data:[0,0,0,0,0],type:"line",style:"curve",color:"#91CB74",textColor:'#91CB74'}
              ],
            }
            this.localdata2 = [];
            this.chartData3 = {
              categories:[],
              series:[
                {name:"净收入",data:[]},
                {name:"收入",data:[]},
                {name:"退款",data:[]}
              ],
            }
          }
        })
      },
      pickerConfirm(val){
        if(this.activeName){
					this.AccTransTime = uni.$u.timeFormat(e.value,'yyyy年mm月');
					this.date = uni.$u.timeFormat(e.value,'yyyy-mm');
        }else{
					this.AccTransTime = uni.$u.timeFormat(e.value,'yyyy年mm月dd日');
					this.date = uni.$u.timeFormat(e.value,'yyyy-mm-dd');
        }
        this.initdata()
      },
      switchMonthDay(){
        this.activeName = !this.activeName;
        if(this.activeName){
          this.AccTransTime = uni.$u.timeFormat(new Date(), 'yyyy年mm月');
          this.date = uni.$u.timeFormat(new Date(), 'yyyy-mm');
        }else{
          this.AccTransTime = uni.$u.timeFormat(new Date(), 'yyyy年mm月dd日');
          this.date = uni.$u.timeFormat(new Date(), 'yyyy-mm-dd');
        }
        this.initdata()
      },
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
</script>

<style lang="scss" scoped>
.chartPage{
  width: 100%;height: 100%;
  .top{
    background: url(http://qs.aiwld.com.cn/static/app/bg6.png) no-repeat -18rpx -40rpx;
    background-size: 105% 100%;
		&_last{
			width: calc(100% - 40rpx);
			margin: 30rpx 0 0 20rpx;
			border-radius: 30rpx;
			padding: 30rpx 0;
			display: flex;
			text-align: center;
			background-color: #fff;
		}
  }
}
</style>
