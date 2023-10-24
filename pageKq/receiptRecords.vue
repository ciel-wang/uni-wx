<template>
	<view style="height: 100%;width: 100%;">
		<view class="searchStyle">
			<view class="searchStyle_first">
				<u-search
					placeholder="请输入学工号/姓名" 
					v-model.trim="moreParamQuery" 
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
		<scroll-view scroll-y style="height: calc(100% - 126rpx);width: 100%;" @scrolltolower="scrolltolower">
			<u-empty text="内容为空" mode="data" v-if="recordsList.length == 0"></u-empty>
			<view v-else>
			  <my-card
			    v-for="(v,i) in recordsList" :key="i" 
			    margin="20rpx" padding="20rpx"
			    :title="`${v.empName}提交的${v.title}申请`"
			    :sub-title="v.creatTime"
			    @click="carditemClick(v)">
			    <view class="state">
			      <u-icon :name="v.stateIcon" custom-prefix="custom-icon" size="140" :color="v.stateColor" />
			    </view>
			    <view v-if="v.receiptType == 1">请假类型：{{v.roleName}}</view>
			    <view v-if="v.receiptType == 3">加班人：{{v.empName}}</view>
			    <view v-if="v.receiptType == 2">出差事由：{{v.receiptCause}}</view>
			    <view v-if="v.receiptType != 4">开始时间：{{v.startTime}}</view>
			    <view v-if="v.receiptType != 4">结束时间：{{v.endTime}}</view>
			    <view v-if="v.receiptType == 2">交通工具：{{v.receiptVehicle}}</view>
			    <view v-if="v.receiptType == 4">补卡时间：{{v.newBkTimeStepsArr && v.newBkTimeStepsArr.join(',')}}</view>
			    <view v-if="v.receiptType == 4">补卡理由：{{v.receiptCause}}</view>
			    <template slot="foot">
			      <view class="u-flex">
							<u-avatar 
								shape="square" size="80" 
								:text="v.empName && v.empName.substr(v.empName.length-2)" 
								:fontSize="32" bg-color="#007cff"></u-avatar>
			        <view class="u-m-l-10" v-if="v.initiatorEmpId != v.empId && v.initiatorEmpName">由{{v.initiatorEmpName}}代提交</view>
			        <view class="u-m-l-10" v-else>由{{v.empName}}提交</view>
			      </view>
			    </template>
			  </my-card>
			</view>
			<u-loadmore :status="loadStatus" v-if="recordsList.length>0"/>
		</scroll-view>
		
		<u-popup :show="popupShow" mode="bottom" round="14" @close="popupShow = false">
			<my-card showHead headBorderBottom margin="0" padding="20rpx">
				<view slot="head" class="fw700">状态</view>
				<view class="grid_class">
					<view 
						class="grid_item_class" 
						:class="[statusActive === k ? 'bg_theme' : '']"
						v-for="(v,k) in statusArr" :key="k"
						@click="statusClick(v,k)">{{ v.label }}</view>
				</view>
			</my-card>
			<my-card showHead headBorderBottom margin="0" padding="20rpx">
				<view slot="head" class="fw700">表单</view>
				<view class="grid_class">
					<view 
						class="grid_item_class" 
						:class="[receiptActive === k ? 'bg_theme' : '']"
						v-for="(v,k) in receiptArr" :key="k"
						@click="receiptClick(v,k)">{{ v.label }}</view>
				</view>
			</my-card>
			<view class="u-flex u-row-around u-p-b-20">
			  <u-button customStyle="width:40%" type="info" @click="reset">重置</u-button>
			  <u-button customStyle="width:40%" type="primary" @click="submit">确定</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { myReceiptList, receiptCopyDetails, receiptAuditDetails } from "./kq.js"
	export default {
		data() {
			return {
				moreParamQuery:"",
				current:1,
				pageCount:1,
				loadStatus: "loading",
				recordsList:[],
				type:"",
				popupShow:false,
				statusArr:[
					{value:"0",label:"全部"},
					{value:"2",label:"审批中"},
					{value:"3",label:"已同意"},
					{value:"5",label:"已撤销"},
					{value:"4",label:"已拒绝"},
          {value:"7",label:"已作废"},
				],
				statusActive:0,
				receiptStatus:0,
				receiptArr:[
					{value:"0",label:"全部"},
					{value:"1",label:"请假"},
					{value:"2",label:"出差"},
					{value:"3",label:"加班"},
					{value:"4",label:"补卡"}
				],
				receiptActive:0,
				receiptType:0,
				who:""
			}
		},
		onPullDownRefresh(){
			this.search()
		},
		methods: {
      switchItem(val){
        this.who = val == 0 ? 'me' : val == 1 ? 'copy' : val == 2 ? 'you' : ''
        this.search()
      },
			statusClick(v,k){
				this.statusActive = k;
				this.receiptStatus = v.value;
			},
			receiptClick(v,k){
				this.receiptActive = k;
				this.receiptType = v.value;
			},
			submit(){
				this.popupShow = false;
				this.search();
			},
			reset(){
				this.statusActive = 0;
				this.receiptStatus = 0;
				this.receiptActive = 0;
				this.receiptType = 0;
				this.search()
			},
			carditemClick(v){
				uni.navigateTo({ url:`../receiptDetail/receiptDetail?id=${v.id}&who=${this.who}` })
			},
      search(){
        this.current = 1;
        this.pageCount = 1;
        this.recordsList = [];
        this.initdata()
      },
			initdata(){
				let params = {};
				params["size"] = 10;
				params["current"] = this.current;
				params["receiptType"] = this.receiptType;
				params["receiptStatus"] = this.receiptStatus;
        params['moreParamQuery'] = this.moreParamQuery;
				this.loadStatus = "loading";
				if(this.who == "me"){
					myReceiptList(params).then(r => {
						if(r.data.code == 200){
							let d = r.data.data;
							this.pageCount = d.pages;
							this.details(d)
						}
					})
				}
				if(this.who == "copy"){
					receiptCopyDetails(params).then(r => {
						if(r.data.code == 200){
							let d = r.data.data;
							this.pageCount = d.pages;
							this.details(d)
						}
					})
				}
				if(this.who == "you"){
					receiptAuditDetails(params).then(r => {
						if(r.data.code == 200){
							let d = r.data.data;
							this.pageCount = d.pages;
							this.details(d)
						}
					})
				}
			},
			details(val){
				uni.stopPullDownRefresh();
				let d = val;
				d.records.forEach(v => {
					if(v.startTime){
						v.startTime = v.startTime.substr(0,16)
					}
					if(v.endTime){
						v.endTime = v.endTime.substr(0,16)
					}
					if(v.receiptVehicle == 1){
						v.receiptVehicle = "飞机"
					}
					if(v.receiptVehicle == 2){
						v.receiptVehicle = "火车"
					}
					if(v.receiptVehicle == 3){
						v.receiptVehicle = "汽车"
					}
					if(v.receiptVehicle == 4){
						v.receiptVehicle = "其他"
					}
					if(v.receiptType == 1){
						v.title = "请假"
					}
					if(v.receiptType == 2){
						v.title = "出差"
					}
					if(v.receiptType == 3){
						v.title = "加班"
						v.startTime = v.startTime.substr(0,10)
						v.endTime = v.endTime.substr(0,10)
					}
					if(v.receiptType == 4){
						v.title = "补卡"
            if(v.bkTimeSteps && v.bkTimeSteps.length){
              v.newBkTimeStepsArr = v.bkTimeSteps.map(item => {
                return item.substr(0,16)
              })
            }
					}
					if(v.receiptStatus == 2){
						v.stateIcon = "shenpi-shenpizhong";
						v.stateColor = "#ff9227";
					}
					if(v.receiptStatus == 3){
						v.stateIcon = "shenpi-yitongyi";
						v.stateColor = "#00C431";
					}
					if(v.receiptStatus == 4){
						v.stateIcon = "shenpi-yijujue";
						v.stateColor = "#d81e06";
					}
					if(v.receiptStatus == 5){
						v.stateIcon = "shenpi-yichexiao";
						v.stateColor = "#cdcdcd";
					}
          if(v.receiptStatus == 7){
          	v.stateIcon = "yizuofei";
          	v.stateColor = "#cdcdcd";
          }
					this.recordsList.push(v)
				})
				if (this.pageCount == 1) {
					this.loadStatus = "nomore";
				} else {
					this.loadStatus = "loadmore";
				}
			},
			scrolltolower(){
				if (this.current >= this.pageCount) {
					this.loadStatus = "nomore";
				} else {
					this.current = ++this.current;
					this.initdata();
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.state{
		position: absolute;
		right: 0;
		top: 0;
		z-index: 99;
	}
</style>
