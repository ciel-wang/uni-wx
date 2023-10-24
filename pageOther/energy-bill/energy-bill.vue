<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
			<view class="u-width-100" style="background-color: #f8f8f8;">
			  <view class="u-text-center u-p-30 u-flex u-row-center" @click="popupShow = true">
			    <text>{{ recordTypeLabel }}</text>
			    <u-icon name="arrow-down"></u-icon>
			  </view>
			  <view class="u-p-l-30 u-p-r-30">
			    <view @click="pickerShow = true" class="u-flex u-width-40">
			      {{ startDateTimeLabel }}
			      <u-icon name="arrow-down" customStyle="margin-left:10rpx;"></u-icon>
			    </view>
			    <view class="u-m-t-10 u-font-32" style="color: #bab8b9;">
			      <text class="u-m-r-30">支出：{{ outTotalMoney }}</text>
			      <text>收入：{{ inTotalMoney }}</text>
			    </view>
			  </view>
			</view>
			
      <scroll-view scroll-y style="height:calc(100% - 210rpx);width: 100%;" @scrolltolower="scrolltolower">
        <u-empty text="没有数据" mode="list" v-if="billRecord.length <= 0"></u-empty>
        <view v-else>
          <view v-for="v in billRecord" :key="v.id" class="u-p-20 bgfff">
            <view class="u-flex">
              <u-icon :name="v.iconName" :color="v.iconColor" custom-prefix="custom-icon" size="60"></u-icon>
              <view class="u-width-100 u-border-bottom u-p-t-10 u-p-b-10 u-m-l-20">
                <view class="u-flex u-row-between u-m-b-10">
                  <view class="u-width-60 u-line-1 u-m-r-16">{{ v.devName }}</view>
                  <text v-if="v.useMoney.startsWith('+')" style="font-weight: 700;color: green;">{{ v.useMoney }}</text>
                  <text v-else style="font-weight: 700;color: red;">{{ v.useMoney }}</text>
                </view>
                <view class="u-font-24 u-flex u-row-between" style="color: #bab8b9;">
                  {{ v.swipeTime }}
                  <text>余额：{{ v.afterMoney }}</text>
                </view>
              </view>
            </view>
          </view>
          <u-loadmore :status="loadStatus" v-if="billRecord.length > 0" />
        </view>
      </scroll-view>
    </movable-area>
		
		<u-popup :show="popupShow" mode="bottom" round="14">
		  <my-card margin="0" padding="20rpx" showHead showFoot>
		    <view slot="head" class="fw700 u-text-center">选择收支类型</view>
				<view class="grid_class">
					<view 
						class="grid_item_class" 
						:class="[k == activeIndex ? 'bg_theme' : '']"
						v-for="(v, k) in recordTypeArr" :key="k"
						@click="recordTypeClick(k, v)">{{ v.label }}</view>
				</view>
		    <view slot="foot" @click="popupShow = false" class="u-text-center u-p-t-20 u-p-b-20 u-content-color">取消</view>
		  </my-card>
		</u-popup>
		<u-datetime-picker 
			:show="pickerShow" v-model="monthValue"
			mode="year-month" 
			:maxDate="new Date().getTime()" :minDate="0" 
			@confirm="pickerConfirm" @cancel="pickerShow = false"></u-datetime-picker>
  </view>
</template>

<script>
import { reqBill } from '../energy.js'

export default {
  data() {
    return {
      recordTypeLabel: '全部收支类型',
      recordType: '',
			recordTypeArr: [
			  { label: '全部', value: '0' },
			  { label: '消费', value: '1' },
			  { label: '转账', value: '2' },
			  { label: '充值', value: '3' },
			  { label: '退款', value: '4' },
				{ label: "加款", value: '5' }
			],
			startDateTimeLabel: '',
			startDateTime: '',
      pickerShow: false,
      billRecord: [],
      popupShow: false,
			activeIndex: 0,
      loadStatus: 'loading',
			current: 1,
      pageCount: 1,
			inTotalMoney:'0.00',
			outTotalMoney:'0.00',
			monthValue:new Date().getTime()
    };
  },
  onLoad(options) {
    this.sourcePage = options.sourcePage
    this.current = 1;
    this.billRecord = [];
    this.startDateTimeLabel = uni.$u.timeFormat(new Date().getTime(),'yyyy年mm月');
    this.startDateTime = uni.$u.timeFormat(new Date().getTime(),'yyyy-mm');
    this.initdata();
  },
  methods: {
    initdata() {
      let params = {};
      params['current'] = this.current;
      params['size'] = 10;
			params['recordType'] = this.recordType;
			params['startDateTime'] = encodeURI(this.startDateTime+'-01 00:00:00');
      this.loadStatus = 'loading';
			reqBill(params).then(r => {
				if(r.data.code === 200){
					let d = r.data.data.dataList;
					this.pageCount = Math.ceil(d.total / d.size);
					this.inTotalMoney = r.data.data.inTotalMoney || '0.00';
					this.outTotalMoney = r.data.data.outTotalMoney || '0.00';
					let records = d.records.map(v => {
						if(v.recordType == 1){
							v.iconName = 'xiaofei';
							v.iconColor = '#1296DB';
							v.useMoney = v.useMoney == '0.00' ? v.useMoney : '-'+v.useMoney;
						}else if(v.recordType == 2){
							v.iconName = 'zhuanzhang';
							v.iconColor = '#F84553';
							v.useMoney = v.useMoney == '0.00' ? v.useMoney : '+'+v.useMoney;
							v.devName = "转账"
						}else if(v.recordType == 3){
							v.iconName = 'shuidiangaizao';
							v.iconColor = '#01A830';
							v.useMoney = v.useMoney == '0.00' ? v.useMoney : '+'+v.useMoney;
							v.devName = "充值"
						}else if(v.recordType == 4){
							v.iconName = 'tuikuan_Refund';
							v.iconColor = '#1296DB';
							v.useMoney = v.useMoney == '0.00' ? v.useMoney : '-'+v.useMoney;
							v.devName = "退款"
						}else if(v.recordType == 5){
							v.iconName = 'jifenchongzhi';
							v.iconColor = '#FB6160';
							v.useMoney = v.useMoney == '0.00' ? v.useMoney : '+'+v.useMoney;
						}
						return v;
					});
					this.billRecord = [...this.billRecord,...records];
				}
			})
    },
		scrolltolower() {
		  if (this.current >= this.pageCount) {
		    this.loadStatus = 'nomore';
		  } else {
		    this.current = ++this.current;
		    this.initdata();
		  }
		},
    recordTypeClick(k, v) {
      this.current = 1;
      this.billRecord = [];
      this.activeIndex = k;
      this.recordTypeLabel = v.label;
      this.recordType = v.value;
      this.initdata();
      this.popupShow = false;
    },
		pickerConfirm(e) {
		  this.startDateTimeLabel = uni.$u.timeFormat(e.value,'yyyy年mm月')
		  this.startDateTime = uni.$u.timeFormat(e.value,'yyyy-mm')
		  this.current = 1;
		  this.billRecord = [];
		  this.initdata();
		},
    backClick() {
      if(this.sourcePage == 'wallet'){
        uni.redirectTo({ url:"../energy-wallet/energy-wallet" })
      }else{
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
};
</script>

<style lang="scss">

</style>
