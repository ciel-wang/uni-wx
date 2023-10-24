<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<scroll-view scroll-y style="height:100%;width: 100%;">
				<view class="u-text-center u-p-30 u-p-b-60 u-border-bottom bgfff">
					<u-icon name="xfzhangdan-gongsi" color="#1BBB71" custom-prefix="custom-icon" size="100"></u-icon>
				  <view class="u-p-t-30 u-font-36">个人钱包提现</view>
				  <view class="u-p-t-30 u-font-60 fw700">{{ info.totalAmount }}</view>
				</view>
				
				<u-cell-group :border="false">
					<u-cell :border="false" title="当前状态"></u-cell>
				  <u-cell :border="false" title="收款账户" value="微信零钱"></u-cell>
				  <u-cell :border="false" title="商品" value="微信提现"></u-cell>
				  <u-cell :border="false" title="商户全称" :value="info.sendName"></u-cell>
					<u-cell :border="false" title="交易单号" :value="info.orderNo"></u-cell>
				</u-cell-group>
			</scroll-view>
		</movable-area>
	</view>
</template>

<script>
	import { getWithdrawDetails } from '../xf.js';
	
	export default {
		data() {
			return {
				info:{},
				sourceType:'bill',
				statusMsg:'',
				returnMsg:""
			}
		},
		onLoad(option) {
		  getWithdrawDetails({ id:option.id }).then(res => {
		    if (res.data.code == 200) {
		      let data = res.data.data;
					let extJson = data.extJson && JSON.parse(data.extJson);
					data.sendName = extJson?.sendName;
					if(!(data.status == 3 && data.transactionStatus == 3)){
						if(data.status == 4){
							this.statusMsg = '审批未通过';
							this.returnMsg = extJson?.rejectCause;
						}
						if(data.transactionStatus == 4){
							this.statusMsg = '扣款失败';
							this.returnMsg = extJson?.wxResJson?.returnMsg
						}
					}else{
						this.statusMsg = '资金到账';
						this.returnMsg = extJson?.wxResJson?.realTransactionTime;
					}
		      this.info = data;
		    }
		  });
		},
		methods: {
			backClick(){
				if(this.sourceType === 'bill') return uni.navigateBack({ delta:1 })
				// #ifdef H5
					WeixinJSBridge.call('closeWindow');
				// #endif
			}
		}
	}
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
</style>
