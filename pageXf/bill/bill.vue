<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
			<view class="u-width-100" style="background-color: #f8f8f8;">
			  <view class="u-text-center u-p-30 u-flex u-row-center" @click="popupShow = true">
			    <text>{{ accTransTypeLabel }}</text>
			    <u-icon name="arrow-down"></u-icon>
			  </view>
			  <view class="u-p-l-30 u-p-r-30">
			    <view @click="pickerShow = true" class="u-flex u-width-40">
			      {{ startAccTransTimeLabel }}
			      <u-icon name="arrow-down" customStyle="margin-left:10rpx;"></u-icon>
			    </view>
			    <view class="u-m-t-10 u-font-32" style="color: #bab8b9;">
			      <text class="u-m-r-30">支出：{{ outMonthMoney }}</text>
			      <text>收入：{{ inMonthMoney }}</text>
			      <view class="u-flex" style="float: right;" @click="$u.route('/pageXf/statistics/statistics')">
			        统计<u-icon name="arrow-right" color="#bab8b9"></u-icon>
			      </view>
			    </view>
			  </view>
			</view>
			
      <scroll-view scroll-y style="height: calc(100% - 210rpx);width: 100%;" @scrolltolower="scrolltolower">
				<u-empty text="没有数据" mode="list" v-if="rechargeRecord.length == 0"></u-empty>
        <view v-else>
          <view v-for="v in rechargeRecord" :key="v.accId" class="u-p-20 bgfff" @click="recordItemClick(v)">
            <view class="u-flex">
              <u-icon :name="v.iconName" :color="v.iconColor" custom-prefix="custom-icon" size="60"></u-icon>
              <view class="u-width-100 u-border-bottom u-p-t-10 u-p-b-10 u-m-l-20">
                <view class="u-flex u-row-between u-m-b-10">
                  <view class="u-flex u-row-between">
                    <text style="max-width:300rpx;" class="u-line-1 u-m-r-16">{{ v.sellerNameLabel }}</text>
                    <u-icon name="arrow-right"></u-icon>
                  </view>
                  <text v-if="v.yiMoney.startsWith('+')" style="font-weight: 700;color: green;">{{ v.yiMoney }}</text>
                  <text v-else style="font-weight: 700;color: red;">{{ v.yiMoney }}</text>
                </view>
                <view class="u-font-24 u-flex u-row-between" style="color: #bab8b9;">
                  {{ v.accTransTimeValue }}
                  <text>余额：{{ v.accAfterMoney }}</text>
                </view>
              </view>
            </view>
          </view>
          <u-loadmore :status="loadStatus" v-if="rechargeRecord.length > 0" />
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
						v-for="(v, k) in accTransTypeArr" :key="k"
						@click="accTransTypeClick(k, v)">{{ v.label }}</view>
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
import { empAccountBill } from '../xf.js';
export default {
  data() {
    return {
      accTransTypeLabel: '全部收支类型',
      accTransType: '',
      pickerShow: false,
      startAccTransTimeLabel: '',
      startAccTransTime: '',
      rechargeCount: '0.00',
      outMonthMoney: '0.00',
      inMonthMoney: '',
      rechargeRecord: [],
      current: 1,
      popupShow: false,
      accTransTypeArr: [
        { label: '全部', value: '0' },
        { label: '系统充值', value: '1' },
        { label: '第三方充值', value: '2' },
        { label: '消费扣款', value: '3' },
        { label: '系统退款', value: '4' },
        { label: '第三方提现', value: '5' },
        { label: '消费纠错', value: '6' },
				{ label: '节能钱包转出', value: '9' },
				{ label: '节能钱包转入', value: '15' }
      ],
      activeIndex: 0,
      loadStatus: 'loading',
      pageCount: 1,
      iconName: '',
      subsidy1walletName:"",
      subsidy2walletName:"",
      subsidy3walletName:"",
			monthValue:new Date().getTime()
    };
  },
  onLoad(options) {
    this.sourceType = options.sourceType
    this.current = 1;
    this.rechargeRecord = [];
    this.startAccTransTimeLabel = uni.$u.timeFormat(new Date().getTime(),'yyyy年mm月');
    this.startAccTransTime = uni.$u.timeFormat(new Date().getTime(),'yyyy-mm');
    this.initdata();
  },
  methods: {
    recordItemClick(v) {
      let params = {};
      params['accTransTime'] = v.accTransTime;
      params['accNum'] = v.accNum;
      params['id'] = v.accId;
      params = JSON.stringify(params);
      uni.navigateTo({
        url: `../billdetail/billdetail?params=${params}`
      });
    },
		accTransTypeClick(k, v) {
		  this.current = 1;
		  this.rechargeRecord = [];
		  this.activeIndex = k;
		  this.accTransTypeLabel = v.label;
		  this.accTransType = v.value;
		  this.initdata();
		  this.popupShow = false;
		},
    initdata() {
      let params = {};
      params['current'] = this.current;
      params['size'] = 10;
      if (this.accTransType) {
        params['accTransType'] = this.accTransType;
      }
      if (this.startAccTransTime) {
        params['startAccTransTime'] = this.startAccTransTime;
      }
      this.loadStatus = 'loading';
      empAccountBill(params).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data;
          this.outMonthMoney = data.outMonthMoney ? data.outMonthMoney : 0;
          this.inMonthMoney = data.inMonthMoney;
          
          this.subsidy1walletName = data.walletInfo?.subsidy1_wallet || ''
          this.subsidy2walletName = data.walletInfo?.subsidy2_wallet || ''
          this.subsidy3walletName = data.walletInfo?.subsidy3_wallet || ''
          
          this.pageCount = Math.ceil(data.pageList.total / data.pageList.size);
          let records = data.pageList.records;
          records.forEach(v => {
            this.rechargeRecord.push(v);
            if (v.accTransType == 1 || v.accTransType == 2 || v.accTransType == 3 || v.accTransType == 11) {
              v.yiMoney = v.yiMoney == '0.00' ? v.yiMoney : '+' + v.inMoney;
              v.iconName = 'xfzhangdan-chongzhi';
              v.iconColor = '#1384E2';
              if (v.personalWallet != '0.00') {
                v.sellerNameLabel = '个人钱包充值';
              } else if (v.subsidy1Wallet != '0.00') {
                v.sellerNameLabel = this.subsidy1walletName + '充值';
              } else if (v.subsidy2Wallet != '0.00') {
                v.sellerNameLabel = this.subsidy2walletName + '充值';
              } else if (v.subsidy3Wallet != '0.00') {
                v.sellerNameLabel = this.subsidy3walletName + '充值';
              }
            } else if (v.accTransType == 7) {
              v.yiMoney = v.yiMoney == '0.00' ? v.yiMoney : '+' + v.inMoney;
              v.iconName = 'xfzhangdan-xiaofeituikuan';
              v.iconColor = '#DC9E52';
            } else if(v.accTransType == 15){
							v.iconName = 'xfzhangdan-tixian';
							v.sellerNameLabel = '节能钱包转入';
							v.iconColor = '#DC9E52';
							v.inMoney = v.inMoney > 0 ? ('+' + v.inMoney) : v.inMoney;
						} else {
              v.yiMoney = v.outMoney == '0.00' ? v.outMoney : '-' + v.outMoney;
            }
            if (v.accTransType == 4 || v.accTransType == 7) {
              v.sellerNameLabel = `${v.devName}(${v.sellerName})`;
            }
            if (v.accTransType == 4) {
              v.iconName = 'xfzhangdan-canting';
              v.iconColor = '#F42C2F';
            }
            if (v.accTransType == 5 || v.accTransType == 6 || v.accTransType == 10) {
              v.iconName = 'xfzhangdan-gongsi';
              v.iconColor = '#1BBB71';
              if (v.accTransType == 5) {
                v.sellerNameLabel = '个人钱包退款';
              }
              if (v.accTransType == 6) {
                v.sellerNameLabel = '销户退款';
              }
              if (v.accTransType == 10) {
                v.sellerNameLabel = '补贴退款';
              }
            }
            if (v.accTransType == 8) {
              v.iconName = 'xfzhangdan-gongsi';
              v.iconColor = '#1BBB71';
              v.sellerNameLabel = '补贴清零';
            }
            if (v.accTransType == 13) {
              v.iconName = 'xfzhangdan-tixian';
              v.sellerNameLabel = '个人钱包';
            }
						if (v.accTransType == 9) {
						  v.iconName = 'xfzhangdan-tixian';
						  v.sellerNameLabel = '节能钱包转出';
							v.iconColor = '#DC9E52';
						}
						if (v.accTransType == 12) {
						  v.iconName = 'xfzhangdan-gongsi';
						  v.iconColor = '#1BBB71';
						  v.sellerNameLabel = '个人钱包提现';
						}
            v.accTransTimeValue = v.accTransType == 4 ? v.exchangeTime.substr(5).replace('-', '月').replace(' ', '日 ') : v.accTransTime.substr(5).replace('-', '月').replace(' ', '日 ');
          });
        }
        this.loadStatus = this.current == 1 ? 'nomore' : 'loadmore';
      });
    },
		scrolltolower() {
		  if (this.current >= this.pageCount) {
		    this.loadStatus = 'nomore';
		  } else {
		    this.current = ++this.current;
		    this.initdata();
		  }
		},
    backClick() {
      if(this.sourceType == 'erweima'){
        uni.redirectTo({ url:"/pageXf/xf-erweima/xf-erweima" })
      }else{
        uni.switchTab({ url:'/pages/index/index' })
      }
    },
    pickerConfirm(e) {
      this.startAccTransTimeLabel = uni.$u.timeFormat(e.value,'yyyy年mm月')
      this.startAccTransTime = uni.$u.timeFormat(e.value,'yyyy-mm')
      this.current = 1;
      this.rechargeRecord = [];
      this.initdata();
    }
  }
};
</script>