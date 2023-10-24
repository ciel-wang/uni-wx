<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
			<view class="searchStyle">
				<view class="searchStyle_first">
					<u-search
						placeholder="提交人/宿舍编号/报修物品" 
						v-model.trim="repairEmpName" 
						:showAction="false"
						margin="0 30rpx" 
						height="70" 
						@search="search"
			      @clear="search">
					</u-search>
				</view>
				<view class="searchStyle_last" @click="popupShow = true;">
					<u-icon name="list"></u-icon>
					<text class="u-m-l-10">筛选</text>
			  </view>
			</view>
			
      <scroll-view scroll-y style="height: calc(100% - 114rpx);width: 100%;" @scrolltolower="scrolltolower">
        <u-empty text="没有数据" mode="search" v-if="maintainArr.length <= 0"></u-empty>
        <view v-else>
          <my-card v-for="(v,k) in maintainArr" :key="k" margin="30rpx 20rpx" :borderRadius="20" @click="cardClick(v)">
            <view class="u-m-b-10 u-tips-color u-flex">提交人：<text class="u-content-color">{{v.repairEmpName}}</text></view>
            <view class="u-m-b-10 u-tips-color u-flex">宿舍编号：<text class="u-content-color">{{v.repairNum}}</text></view>
            <view class="u-m-b-10 u-tips-color u-flex">报修物品：<text class="u-content-color">{{v.repairContent}}</text></view>
            <view class="u-tips-color u-flex">期望处理时间：
            	<text class="u-content-color">{{v.repairDateTime && v.repairDateTime.substr(0,16)}}</text>
            </view>
            <view class="stateClass">
              <u-icon :name="v.stateIcon" custom-prefix="custom-icon" size="60" :color="v.stateColor" />
            </view>
          </my-card>
        </view>
        <u-loadmore :status="loadStatus" v-if="maintainArr.length > 0" />
      </scroll-view>
    </movable-area>
		
		<u-popup :show="popupShow" mode="bottom" round="14">
			<my-card showHead headBorderBottom margin="0" padding="20rpx">
				<view slot="head" class="u-text-center fw700">选择单据状态</view>
				<view class="grid_class">
					<view 
						class="grid_item_class" 
						:class="[activeIndex === k ? 'bg_theme' : '']"
						v-for="(v,k) in maintainStateArr" :key="k"
						@click="maintainStateClick(v,k)">{{ v.label }}</view>
				</view>
				<view slot="foot" @click="popupShow = false" class="u-text-center u-p-t-20 u-p-b-20 u-content-color"> 取消 </view>
			</my-card>
		</u-popup>
  </view>
</template>

<script>
  import { getRecords } from '../api/maintain.js'
  
  export default {
    data() {
      return {
        repairEmpName:"",
        popupShow:false,
        activeIndex:0,
        maintainStateArr:[
          {value:0,label:"全部"},
          {value:1,label:"待处理"},
          {value:2,label:"已撤销"},
          {value:3,label:"处理中"},
          {value:4,label:"已拒绝"},
          {value:5,label:"已处理"}
        ],
        repairStatus:"",
        maintainArr:[],
        current: 1,
        pageCount: 0,
        loadStatus: 'nomore',
      }
    },
    onBackPress(e) {
      this.visitorLists = [];
      this.search();
    },
    onLoad() {
      this.search()
    },
    methods: {
      cardClick(val){
        uni.navigateTo({ url:`../maintain-details/maintain-details?id=${val.id}` })
      },
      maintainStateClick(val,index){
        this.activeIndex = index;
        this.repairStatus = val.value;
        this.search()
        this.popupShow = false;
      },
      search(){
        this.maintainArr = []
        this.current = 1;
        this.pageCount = 0
        this.initData()
      },
      initData(){
        let params = {}
        params['size'] = 20
        params['current'] = this.current;
        params['repairStatus'] = this.repairStatus;
        params['repairEmpName'] = this.repairEmpName;
        getRecords(params).then(r => {
          if(r.data.code == 200){
            let d = r.data.data;
            this.pageCount = d.pages;
            d.records.forEach(v => {
              if(v.repairStatus == 1){
                v.stateIcon = "daichuli"
                v.stateColor = "#F6AE17"
              }else if(v.repairStatus == 2){
                v.stateIcon = "yichexiao"
                v.stateColor = "#B5B5B5"
              }else if(v.repairStatus == 3){
                v.stateIcon = "chulizhong"
                v.stateColor = "#466805"
              }else if(v.repairStatus == 4){
                v.stateIcon = "yijujue"
                v.stateColor = "#FF1800"
              }else if(v.repairStatus == 5){
                v.stateIcon = "yichuli"
                v.stateColor = "#6B85F2"
              }
            })
						this.maintainArr = [...this.maintainArr,...d.records];
          }
        })
      },
      scrolltolower(){
        if (this.current > this.pageCount) {
          this.loadStatus = 'nomore';
        } else {
          this.current = ++this.current;
          this.initData()
        }
      },
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stateClass{
    position: absolute;
    top: 2rpx;
    right: 4rpx;
  }
</style>
