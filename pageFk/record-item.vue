<template>
	<view style="width: 100%;height: 100%;">
		<view class="searchStyle">
			<view class="searchStyle_first">
				<u-search
					:placeholder="vuex_useInfo.bindEmpType == 2 ? '请输入来访人姓名/手机号码' : '请输入被访人姓名/手机号码'" 
					v-model="empParamQuery" 
					:showAction="false"
					margin="0 30rpx" 
					height="70" 
					@search="search"
		      @clear="search">
				</u-search>
			</view>
			<view class="searchStyle_last" @click="popupShow = true">
				<u-icon name="list"></u-icon>
				<text class="u-m-l-10">筛选</text>
			</view>
		</view>
		
		<scroll-view scroll-y style="height: calc(100% - 114rpx);width: 100%;" @scrolltolower="scrolltolower">
		  <u-empty text="没有数据" mode="search" v-if="visitorLists.length <= 0"></u-empty>
		  <view v-else class="u-p-t-30">
		    <my-card 
		      v-for="v in visitorLists" :key="v.visitorNo"
					:showFoot="sourcePage === 'targetInvite' ? true : vuex_useInfo.bindEmpType != 2 ? true : false"
					:footStyle="{padding:'16rpx 30rpx'}"
		      margin="0 20rpx 30rpx" 
		      @click="cardClick(1,v.visitorNo)">
		      <view class="u-m-b-10">{{ v.visitorTime ? vuex_cfg.dateType === 'date' ? v.visitorTime.substr(0,10) : v.visitorTime.substr(0,16) : ''}}</view>
		      <view v-if="vuex_useInfo.bindEmpType == 2 && sourcePage === 'appointment'" class="u-font-30">来访人：{{ v.visitorName }}</view>
		      <view v-if="sourcePage === 'appointment' && vuex_useInfo.bindEmpType != 2" class="u-font-30">被访人：{{ v.targetEmpName }}</view>
		      <view v-if="sourcePage === 'targetInvite'" class="u-font-30">邀约人数：{{v.visitorPersonCount}}人</view>
		      <view class="u-m-t-10 u-info u-flex u-row-between u-col-center">
		        <view class="u-width-60 u-line-1">到访区域：{{ v.visitorArea }}</view>
		        <text>来访事由：{{ v.visitorCause }}</text>
		      </view>
		      <view class="state">
		        <u-icon :name="v.stateIcon" custom-prefix="custom-icon" size="116" :color="v.stateColor" />
		      </view>
					
					<view slot="foot" class="u-text-right">
						<view class="u-m-r-30" style="display: inline-block;width: 160rpx;">
							<u-button
								size="mini" shape="circle" customStyle="padding:30rpx" 
								@click="$u.route('/pageFk/retinue-details/retinue-details',{visitorNo:v.visitorNo})">邀请进度</u-button>
						</view>
						<view style="display: inline-block;width: 160rpx;">
							<u-button size="mini" shape="circle" customStyle="padding:30rpx" @click="cardClick(2,v.visitorNo)">查看详情</u-button>
						</view>
					</view>
		    </my-card>
		  </view>
		  <u-loadmore :status="loadStatus" v-if="visitorLists.length > 0" />
		</scroll-view>
		
		<u-popup :show="popupShow" mode="bottom" round="14">
			<my-card margin="0" padding="20rpx" showHead headBorderBottom>
				<view slot="head" class="u-text-center fw700">选择单据状态</view>
				<view class="grid_class">
					<view 
						class="grid_item_class" :class="[activeIndex === k ? 'bg_theme' : '']"
						v-for="(v,k) in visitorStateArr" :key="k"
						@click="visitorStateClick(k,v)">{{ v.label }}</view>
				</view>
				<view slot="foot" @click="popupShow = false" class="u-text-center u-p-t-20 u-p-b-20">取消</view>
			</my-card>
		</u-popup>
	</view>
</template>

<script>
	import { visitorList, targetvisitorList } from './api/appointmentrecord.js';
	import { reqInviteRecordes } from './api/apply.js';
	export default {
		props:[ "sourcePage" ],
	  data() {
	    return {
	      empParamQuery:'',
	      popupShow:false,
	      visitorLists: [],
	      visitorState: 0,
	      current: 1,
	      pageCount: 1,
	      loadStatus: 'loading',
	      activeIndex:0,
	      visitorStateArr:[
	        {label:"全部",value:"0"},
	        {label:"待审批",value:"1"},
	        {label:"已撤销",value:"2"},
	        {label:"已同意",value:"3"},
	        {label:"已拒绝",value:"4"},
	        {label:"已超时",value:"7"},
	      ]
	    };
	  },
	  methods: {
			switchItem(){
				this.visitorLists = [];
				this.current = 1;
				this.pageCount = 0;
				if(this.vuex_useInfo.bindEmpType != 2 || this.sourcePage === 'targetInvite') this.visitorStateArr.push({label:"邀请中",value:'8'});
				this.initdata();
			},
	    search(){
	      this.visitorLists = []
	      this.current = 1;
	      this.pageCount = 0
	      this.initdata()
	    },
	    visitorStateClick(k,v){
	      this.visitorLists = []
	      this.current = 1;
	      this.pageCount = 0
	      this.activeIndex = k;
	      this.visitorState = v.value
	      this.initdata()
	      this.popupShow = false;
	    },
	    initdata() {
				if(this.sourcePage === 'appointment'){
					if (this.vuex_useInfo.bindEmpType == 2) {
					  this.loadStatus = 'loading';
					  let params = {};
					  params['visitorState'] = this.visitorState;
					  params['current'] = this.current;
					  params['visitorName'] = this.empParamQuery;
					  targetvisitorList(params).then(res => {
							let data = res.data.data.records;
					    this.pageCount = res.data.data.pages;
					    this.handleData(data)
					  });
					} else {
					  this.loadStatus = 'loading';
					  let params = {};
					  params['visitorState'] = this.visitorState;
					  params['current'] = this.current;
					  params['targetEmpName'] = this.empParamQuery;
					  visitorList(params).then(res => {
					    let data = res.data.data.records;
					    this.pageCount = res.data.data.pages;
					    this.handleData(data)
					  });
					}
				}else{
					let params = {};
					params['visitorState'] = this.visitorState;
					params['current'] = this.current;
					params['visitorName'] = this.empParamQuery;
					this.loadStatus = 'loading';
					reqInviteRecordes(params).then(res => {
						let data = res.data.data.records;
						this.pageCount = res.data.data.pages;
						this.handleData(data)
					})
				}
	    },
			handleData(data){
				if (data) {
				  data.forEach(v => {
				    if (v.visitorState == 1) {
				      v.stateIcon = 'shenpi-daishenhe';
				      v.stateColor = '#FF9934';
				    } else if (v.visitorState == 2) {
				      v.stateIcon = 'shenpi-yichexiao';
				      v.stateColor = '#BABABA';
				    } else if (v.visitorState == 3) {
				      v.stateIcon = 'shenpi-yitongyi';
				      v.stateColor = '#00C431';
				    } else if (v.visitorState == 4) {
				      v.stateIcon = 'shenpi-yijujue';
				      v.stateColor = '#FF1400';
				    } else if (v.visitorState == 5) {
				      v.stateIcon = 'shenpi-yitongyi';
				      v.stateColor = '#00C431';
				    } else if (v.visitorState == 6) {
				      v.stateIcon = 'shenpi-yitongyi';
				      v.stateColor = '#00C431';
				    } else if (v.visitorState == 71 || v.visitorState == 72) {
				      v.stateIcon = 'shenpi-yichaoshi';
				      v.stateColor = '#FF4500';
				    }else if(v.visitorState == 8){
							v.stateIcon = 'yaoqingzhong';
							v.stateColor = '#2DBD90';
						}
				  });
					this.visitorLists = [...this.visitorLists,...data];
					this.loadStatus = this.current == 1 ? 'nomore' : 'loadmore';
				}
			},
	    scrolltolower() {
	      if (this.current >= this.pageCount) {
	        this.loadStatus = 'nomore';
	      } else {
	        this.current = ++this.current;
	        this.initdata();
	      }
	    },
	    cardClick(type,visitorNo) {
				if((this.vuex_useInfo.bindEmpType != 2 || this.sourcePage === 'targetInvite') && type == 1) return;
				this.$u.route('/pageFk/receipt-details/receipt-details',{visitorNo,sourcePage:this.sourcePage});
	    }
	  }
	};
</script>

<style lang="scss" scoped>
  .state {
    width: 116rpx;
    height: 116rpx;
    position: absolute;
    top: 2rpx;
    right: 4rpx;
  }
</style>