<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>

      <scroll-view scroll-y style="height: 100%;width: 100%;">
        <view class="u-p-30 u-p-b-60 u-text-center u-border-bottom bgfff">
          <u-icon :name="iconName" :color="iconColor" custom-prefix="custom-icon" size="100" class="u-m-r-20"></u-icon>
          <view class="u-p-t-30 u-font-36">{{ sellerNameLabel }}</view>
          <view class="u-p-t-30 u-font-60 fw700">{{ yiMoney }}</view>
        </view>
        
        <u-cell-group :border="false">
          <u-cell :border="false" title="当前状态" :value="status" customStyle="padding-top:30rpx;"></u-cell>
          <u-cell :border="false" title="商品" :value="product"></u-cell>
          <u-cell :border="false" title="管理费" :value="manageCost" v-show="type == 1 || type == 2"></u-cell>
          <u-cell :border="false" title="商户全称" :value="sellerName"></u-cell>
          <u-cell :border="false" v-if="type == 4" title="消费时间" :value="detailsData.exchangeTime"></u-cell>
          <u-cell :border="false" title="支付时间" :value="detailsData.accTransTime"></u-cell>
          <u-cell :border="false" title="支付钱包" v-if="type == 4 || type == 6 || type == 7">
            <view slot="value">
              <text v-if="detailsData.personalWallet != '0.00'">个人钱包（{{ detailsData.personalWallet }}）</text>
              <text v-if="detailsData.subsidy1Wallet != '0.00'">{{subsidy1walletName}}（{{ detailsData.subsidy1Wallet }}）</text>
              <text v-if="detailsData.subsidy2Wallet != '0.00'">{{subsidy2walletName}}（{{ detailsData.subsidy2Wallet }}）</text>
              <text v-if="detailsData.subsidy3Wallet != '0.00'">{{subsidy3walletName}}（{{ detailsData.subsidy3Wallet }}）</text>
            </view>
          </u-cell>
          <u-cell :border="false" title="交易单号" :value="accId"></u-cell>
          <u-cell v-if="type == 11" :border="false" title="微信单号" :value="wxaccId"></u-cell>
					<u-cell v-if="type == 12" :border="false" title="商户单号" :value="detailsData.extContent && detailsData.extContent.orderNo || ''"></u-cell>
        </u-cell-group>
        
        <view class="u-m-t-20" v-if="type == 7">
          <view class="bgfff fw700 u-p-30 u-p-t-20 u-p-b-10">原订单</view>
          <u-cell-group :border="false">
            <u-cell :border="false" title="当前状态" :value="`已退款（${detailsData.inMoney}）`"></u-cell>
            <u-cell :border="false" title="商品" :value="detailsData.srouceOrder.devName"></u-cell>
            <u-cell :border="false" title="商户全称" :value="detailsData.srouceOrder.sellerName"></u-cell>
            <u-cell :border="false" v-if="type == 7" title="消费时间" :value="detailsData.srouceOrder.exchangeTime"></u-cell>
            <u-cell :border="false" title="支付时间" :value="detailsData.srouceOrder.accTransTime"></u-cell>
            <u-cell :border="false" title="支付钱包">
							<view slot="value">
								<text v-if="detailsData.srouceOrder.personalWallet != '0.00'">个人钱包（{{ detailsData.srouceOrder.personalWallet }}）</text>
								<text v-if="detailsData.srouceOrder.subsidy1Wallet != '0.00'">{{subsidy1walletName}}（{{ detailsData.srouceOrder.subsidy1Wallet }}）</text>
								<text v-if="detailsData.srouceOrder.subsidy2Wallet != '0.00'">{{subsidy2walletName}}（{{ detailsData.srouceOrder.subsidy2Wallet }}）</text>
								<text v-if="detailsData.srouceOrder.subsidy3Wallet != '0.00'">{{subsidy3walletName}}（{{ detailsData.srouceOrder.subsidy3Wallet }}）</text>
							</view>
            </u-cell>
            <u-cell :border="false" title="交易单号" :value="detailsData.srouceOrder.id"></u-cell>
          </u-cell-group>
        </view>
      </scroll-view>
    </movable-area>
  </view>
</template>

<script>
import { empAccountBillDetails } from '../xf.js';
export default {
  data() {
    return {
      iconName: '',
      imgUrl: 'https://uviewui.com/common/logo.png',
      sellerNameLabel: '',
      yiMoney: '',
      status: '支付成功',
      sellerName: '',
      accTransTime: '',
      remark: '',
      accId: '',
      type: '',
      detailsData: {},
      iconColor: '',
      product: '',
      wxaccId: '',
      manageCost:'',
      subsidy1walletName:"",
      subsidy2walletName:"",
      subsidy3walletName:"",
    };
  },
  onLoad(option) {
    let _params = {};
    if (option.params) {
      _params = JSON.parse(option.params);
      this.accId = _params.id;
      this.sourceType = 'bill';
    } else {
      _params['accTransTime'] = option.accTransTime;
      _params['accNum'] = option.accNum;
      _params['id'] = option.id;
      this.accId = option.id;
      this.sourceType = '';
    }
    empAccountBillDetails(_params).then(res => {
      if (res.data.code == 200) {
        let data = res.data.data;
        this.detailsData = data;
        
        this.subsidy1walletName = data.walletInfo?.subsidy1_wallet || ''
        this.subsidy2walletName = data.walletInfo?.subsidy2_wallet || ''
        this.subsidy3walletName = data.walletInfo?.subsidy3_wallet || ''
        
        this.sellerNameLabel = `${data.devName}(${data.sellerName})`;
        this.sellerName = data.sellerName;
        if (data.inMoney != '0.00') {
          this.yiMoney = data.inMoney;
        }else {
          this.yiMoney = data.outMoney == '0.00' ? data.outMoney :  '-' + data.outMoney;
        }
        let v = data.accTransType;
        this.type = data.accTransType;
        if (v == 1 || v == 2 || v == 3 || v == 11 || v == 10) {
          if(v == 1){
            this.product = "有卡充值"
            this.manageCost = data.mngMoney
          }
          if(v == 2){
            this.product = "无卡充值"
            this.manageCost = data.mngMoney
          }
          if(v == 3){
            this.product = "补贴充值"
          }
          this.status = '充值成功';
          this.sellerName = data.schoolName;
          this.iconName = 'xfzhangdan-chongzhi';
          this.iconColor = '#1384E2';
          if (data.personalWallet != '0.00') {
            this.sellerNameLabel = '个人钱包充值';
          }
          if (data.subsidy1Wallet != '0.00') {
            this.sellerNameLabel = this.subsidy1walletName + '充值';
          }
          if (data.subsidy2Wallet != '0.00') {
            this.sellerNameLabel = this.subsidy2walletName + '充值';
          }
          if (data.subsidy3Wallet != '0.00') {
            this.sellerNameLabel = this.subsidy3walletName + '充值';
          }
          if (v == 10) {
            this.product = '补贴退款';
          }
          if (v == 11) {
            this.wxaccId = data.transactionId;
            this.product = "微信充值"
          }
        }
        if (v == 5 || v == 6 || v == 10) {
          this.status = '退款成功';
          this.sellerName = data.schoolName;
          this.iconName = 'xfzhangdan-gongsi';
          this.iconColor = '#1BBB71';
          if(v == 5 || v == 10){
            if (data.personalWallet != '0.00') {
              this.sellerNameLabel = '个人钱包退款';
            }
            if (data.subsidy1Wallet != '0.00') {
              this.sellerNameLabel = this.subsidy1walletName + '退款';
            }
            if (data.subsidy2Wallet != '0.00') {
              this.sellerNameLabel = this.subsidy2walletName + '退款';
            }
            if (data.subsidy3Wallet != '0.00') {
              this.sellerNameLabel = this.subsidy3walletName + '退款';
            }
          }
          if (v == 5) {
            this.product = '个人钱包退款';
          }
          if (v == 6) {
            this.product = '销户退款';
            this.sellerNameLabel = "销户退款"
          }
        }
        if (v == 4) {
          this.product = data.devName;
          this.iconName = 'xfzhangdan-canting';
          this.iconColor = '#F42C2F';
        }
        if (v == 7) {
          this.status = '已退款（' + data.inMoney + ')';
          this.product = '消费退款';
          this.sellerName = data.sellerName;
          this.iconName = 'xfzhangdan-xiaofeituikuan';
          this.iconColor = '#DC9E52';
        }
        if (v == 8) {
          this.status = '清零成功';
          this.sellerName = data.schoolName;
          this.iconName = 'xfzhangdan-gongsi';
          this.iconColor = '#1BBB71';
          this.product = "补贴清零"
          if (data.personalWallet != '0.00') {
            this.sellerNameLabel = '个人钱包清零';
          }
          if (data.subsidy1Wallet != '0.00') {
            this.sellerNameLabel = this.subsidy1walletName + '清零';
          }
          if (data.subsidy2Wallet != '0.00') {
            this.sellerNameLabel = this.subsidy2walletName + '清零';
          }
          if (data.subsidy3Wallet != '0.00') {
            this.sellerNameLabel = this.subsidy3walletName + '清零';
          }
        }
        if (v == 13) {
          this.status = '已到账';
          this.iconName = 'xfzhangdan-tixian';
        }
				if (v == 9) {
					this.product = "节能钱包转出";
					this.sellerNameLabel = "节能钱包转出";
					this.sellerName = data.schoolName;
          this.status = '已到账';
          this.iconName = 'xfzhangdan-tixian';
					this.iconColor = '#DC9E52';
        }
				if (v == 15) {
					this.product = "节能钱包转入";
					this.sellerNameLabel = "节能钱包转入";
					this.sellerName = data.companyName;
				  this.status = '已到账';
				  this.iconName = 'xfzhangdan-tixian';
					this.iconColor = '#DC9E52';
				}
				if (v == 12) {
					this.iconName = 'xfzhangdan-gongsi';
					this.iconColor = '#1BBB71';
					this.product = '微信提现';
					this.status = '已到账';
					this.sellerName = data.schoolName;
					this.sellerNameLabel = '个人钱包提现';
				}
      }
    });
  },
  methods: {
    backClick() {
      if(this.sourceType){
        uni.redirectTo({ url: '../bill/bill' });
      }else{
				// #ifdef H5
				WeixinJSBridge.call('closeWindow');
				// #endif
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.u-cell {
  align-items: flex-start;
}
/deep/.u-cell__body{
	padding: 10rpx 32rpx;
}
/deep/.u-cell__value {
  text-align: left;
  margin-left: 20rpx;
}
/deep/.u-cell__title-text {
  width: 120rpx !important;
}
</style>
