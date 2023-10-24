<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="u-p-30 u-flex u-row-between" style="background-color: #f8f8f8;">
				<view @click="pickerShow = true" class="u-flex u-width-40">
					{{ AccTransTime }}
					<u-icon name="arrow-down" customStyle="margin-left:10rpx;"></u-icon>
				</view>
				<view class="u-font-32" style="color: #bab8b9;">
					<text class="u-m-r-30">总计：{{ totalAmount }}</text>
				</view>
			</view>
			
			<scroll-view scroll-y style="height: calc(100% - 210rpx);width: 100%;" @scrolltolower="scrolltolower">
				<u-empty text="没有数据" mode="list" v-if="withdrawRecord.length == 0"></u-empty>
			  <view v-else>
			    <view v-for="v in withdrawRecord" :key="v.orderNo" class="u-p-20 bgfff" @click="recordItemClick(v)">
			      <view class="u-flex">
			        <u-icon name="xfzhangdan-gongsi" color="#1BBB71" custom-prefix="custom-icon" size="60"></u-icon>
			        <view class="u-width-100 u-border-bottom u-p-t-10 u-p-b-10 u-m-l-20">
			          <view class="u-flex u-row-between u-m-b-10">
			            <span>
			              <text class="u-m-r-16">个人钱包提现</text>
			              <u-icon name="arrow-right"></u-icon>
			            </span>
			            <text class="fw700">￥{{ v.totalAmount }}</text>
			          </view>
			          <view class="u-font-24 u-flex u-row-between" style="color: #bab8b9;">
			        		<text>{{ v.createTime }}</text>
			        		<text class="red" v-if="v.status == 4">已驳回</text>
			        	</view>
			        </view>
			      </view>
			    </view>
			    <u-loadmore :status="loadStatus" v-if="withdrawRecord.length > 0" />
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
	import { getWithdrawList } from '../xf.js';
	export default {
		data() {
			return {
				pickerShow:false,
				AccTransTime: '',
				startAccTransTime: '',
				totalAmount: '0.00',
				withdrawRecord: [],
				current: 1,
				pageCount: 1,
				loadStatus: 'loading',
			}
		},
		onLoad(options) {
		  this.current = 1;
		  this.withdrawRecord = [];
		  this.AccTransTime = uni.$u.timeFormat(new Date(), 'yyyy年mm月');
		  this.startAccTransTime = uni.$u.timeFormat(new Date(), 'yyyy-mm');
		  this.initdata();
		},
		methods: {
			scrolltolower() {
			  if (this.current >= this.pageCount) {
			    this.loadStatus = 'nomore';
			  } else {
			    this.current = ++this.current;
			    this.initdata();
			  }
			},
			recordItemClick(v) {
			  uni.navigateTo({
			    url: '/pageXf/widthdraw-billdetails/widthdraw-billdetails?id='+v.id
			  });
			},
			initdata() {
			  let params = {};
			  params['current'] = this.current;
			  params['size'] = 10;
			  if (this.startAccTransTime) {
			    params['createTimeMonth'] = this.startAccTransTime;
			  }
			  this.loadStatus = 'loading';
			  getWithdrawList(params).then(res => {
			    if (res.data.code == 200) {
			      let data = res.data.data;
			      this.totalAmount = data.totalAmount || '0.00';
			      this.pageCount = Math.ceil(data.data.total / data.data.size);
			      let records = data.data.records;
						this.withdrawRecord = [...this.withdrawRecord,...records]
			    }
			    this.loadStatus = this.current == 1 ? 'nomore' : 'loadmore';
			  });
			},
			pickerConfirm(e) {
			  this.AccTransTime = uni.$u.timeFormat(e.value,'yyyy年mm月')
			  this.startAccTransTime = uni.$u.timeFormat(e.value,'yyyy-mm')
			  this.current = 1;
			  this.withdrawRecord = [];
			  this.initdata();
			},
			backClick() {
			  uni.redirectTo({ url:'/pageXf/withdraw-deposit/withdraw-deposit' })
			}
		}
	}
</script>
