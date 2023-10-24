<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
			<view class="searchStyle">
				<view v-if="vuex_useInfo.bindEmpType == 2" class="searchStyle_first">
					<u-search
						placeholder="请输入姓名/学号" 
						v-model.trim="empName" 
						:showAction="false"
						margin="0 30rpx" 
						height="70" 
						@search="search"
			      @clear="search">
					</u-search>
				</view>
				<view v-else class="searchStyle_first" @click="calendarShow = true">
					<text class="u-m-r-10">{{dayDate}}</text>
					<u-icon name="arrow-down"></u-icon>
				</view>
				<view class="searchStyle_last" @click="popupShow = true;">
					<u-icon name="list"></u-icon>
					<text class="u-m-l-10">筛选</text>
			  </view>
			</view>
			
      <scroll-view scroll-y style="height: calc(100% - 114rpx);width: 100%;" @scrolltolower="scrolltolower">
        <u-empty text="没有数据" mode="search" v-if="inoutDormArr.length <= 0"></u-empty>
        <view v-else>
          <my-card v-for="v in inoutDormArr" :key="v.id" margin="30rpx 20rpx" :borderRadius="20">
            <view class="u-m-b-10 u-flex">姓&emsp;&emsp;名：<text>{{v.empName}}</text></view>
            <view class="u-m-b-10 u-flex">学&emsp;&emsp;号：<text>{{v.empCode}}</text></view>
            <view class="u-m-b-10 u-flex">宿舍编号：<text>{{v.dormName}}</text></view>
            <view v-if="v.type != 0" class="u-m-b-10 u-flex">进出时间：<text>{{v.inOutTime ? v.inOutTime.substr(11) : ''}}</text></view>
            <view v-if="v.type != 0" class="u-flex">考勤类型：
              <text>{{v.timestepStart ? v.timestepStart.substr(11) : ''}}</text>-
              <text>{{v.timestepEnd ? v.timestepEnd.substr(11) : ''}}</text>
              <text class="u-m-l-20">{{v.time}} {{v.typeLabel}}</text>
            </view>
            <view v-if="v.type == 0" class="u-flex">请假时间：<text>{{v.startTime ? v.startTime.substr(5,11) : ''}} 至 {{v.endTime ? v.endTime.substr(5,11) : ''}}</text></view>
            <view class="stateClass" :style="{'background-color':typeArr[v.type].bgColor}">
              <text>{{typeArr[v.type].type}}</text>
            </view>
          </my-card>
        </view>
        <u-loadmore :status="loadStatus" v-if="inoutDormArr.length > 0" />
      </scroll-view>
    </movable-area>
		
		<u-popup :show="popupShow" mode="bottom" round="14">
			<my-card margin="0" padding="20rpx" showHead headBorderBottom>
				<view slot="head" class="fw700"> 异常状态 </view>
				<view class="grid_class">
					<view 
						class="grid_item_class" :class="[activeIndex === v.value ? 'bg_theme' : '']"
						v-for="(v,k) in errorStateArr" :key="k"
						@click="inoutStateClick(v)">{{ v.label }}</view>
				</view>
			</my-card>
			<my-card margin="0" padding="20rpx" showHead headBorderBottom>
				<view slot="head" class="fw700"> 正常状态 </view>
				<view class="grid_class">
					<view 
						class="grid_item_class" :class="[activeIndex === v.value ? 'bg_theme' : '']"
						v-for="(v,k) in statusArr" :key="k"
						@click="inoutStateClick(v)">{{ v.label }}</view>
				</view>
			</my-card>
			<view class="u-width-100 u-text-center u-p-t-40 u-p-b-40" style="border-top: 10rpx solid #f8f8f8;" @click="popupShow = false">取消</view>
		</u-popup>
		<u-calendar :show="calendarShow" @confirm="calendarChange" @close="calendarShow = false"></u-calendar>
  </view>
</template>

<script>
  import { getStudentmonitorDetails, getClassmonitorDetails, getFloorReceiptDetails, getFloorErrDetails } from '../api/monitor.js'
  export default {
    data() {
      return {
        empName:"",
        inoutDormArr:[],
        popupShow:false,
        current: 1,
        pageCount: 0,
        loadStatus: 'nomore',
        activeIndex:9,
        errorStateArr:[
          {value:9,label:'全部'},
          {value:3,label:'未归寝'},
          {value:4,label:'未出寝'},
          {value:1,label:'晚归寝'},
          {value:2,label:'晚出寝'},
        ],
        statusArr:[
          {value:0,label:'请假'},
        ],
        calendarShow:false,
        dayDate:uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
        typeArr:[
          {type:"请假",bgColor:'#00B429'},{type:"晚归寝",bgColor:"#FFAA17"},{type:"晚出寝",bgColor:"#FFAA17"},{type:'未归寝',bgColor:"#FF1700"},{type:"未出寝",bgColor:"#FF1700"}
        ],
        floorId:"",
        classId:"",
      }
    },
    onLoad(options) {
      if(options.form){
        let form = JSON.parse(options.form)
        this.classId = form.classId || ''
        this.floorId = form.floorId || ''
        this.dayDate = options.dayDate
      }
      this.search()
    },
    methods: {
      inoutStateClick(val){
        this.activeIndex = val.value;
        this.inoutStatus = val.value;
        this.search()
        this.popupShow = false;
      },
      search(){
        this.inoutDormArr = []
        this.current = 1;
        this.pageCount = 0
        this.initData()
      },
      initData(){
        let params = {}
        params['size'] = 20
        params['current'] = this.current;
        params['dayDate'] = this.dayDate;
        params['status'] = this.activeIndex == 9 ? '' : this.activeIndex
        if(this.vuex_useInfo.bindEmpType != 2){
          getStudentmonitorDetails(params).then(r => {
            let d = r.data.data || [];
            this.details(d)
          })
          return;
        }else{
          params['empName'] = this.empName
          if(this.classId){
            params['classId'] = this.classId;
            getClassmonitorDetails(params).then(r => {
              let d = r.data.data || [];
              this.details(d)
            })
          }else{
            params['floorId'] = this.floorId
            if(this.activeIndex != 0){
              getFloorErrDetails(params).then(r => {
                if(r.data.code == 200){
                  let d = r.data.data
                  this.pageCount = d.pages
                  this.details(d.records)
                }
              })
            }else{
              getFloorReceiptDetails(params).then(r => {
                if(r.data.code == 200){
                  let d = r.data.data
                  this.pageCount = d.pages
                  this.details(d.records)
                }
              })
            }
          }
        }
      },
      details(data){
        let d = data;
        d.forEach(v => {
          if(v.type ==1 || v.type == 3){
            v.typeLabel = "归寝"
          }else if(v.type == 2 || v.type == 4){
            v.typeLabel = "出寝"
          }
        })
        this.inoutDormArr = [...this.inoutDormArr,...d]
      },
      scrolltolower(){
        if (this.current > this.pageCount) {
          this.loadStatus = 'nomore';
        } else {
          this.current = ++this.current;
          this.initData()
        }
      },
      calendarChange(val){
        this.dayDate = val[0];
				this.calendarShow = false;
        this.search()
      },
      backClick(){
        uni.redirectTo({ url:"../indorm-monitor/indorm-monitor" })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stateClass{
    position: absolute;
    top: 2rpx;
    right: 4rpx;
    color: #FFFFFF;
    width: 100rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
  }
</style>
