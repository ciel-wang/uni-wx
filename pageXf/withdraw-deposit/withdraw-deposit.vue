<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
    	<movable-view direction="all" :out-of-bounds="false">
    		<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
    	</movable-view>
			
			<view class="u-flex u-row-between u-col-center u-p-t-40 u-p-b-60 u-p-l-30 u-p-r-30">
			  <view class="u-width-20">到账账户</view>
			  <view class="u-width-20 fw700">{{accountType}}</view>
			  <view class="u-width-10 u-text-right">
			    <u-icon name="arrow-right"></u-icon>
			  </view>
			</view>
			
			<my-card borderRadius="30rpx">
				<text>提现金额</text>
				<view class="fw700 deposit_input" @click="$refs.cukeyboard.open()">
				  <u-icon name="rmb" size="50" customStyle="fontSize:700;margin-top:-8rpx;"></u-icon>
				  <text class="u-m-l-10">{{value}}</text>
				  <text class="deposit_input_cursor"></text>
				</view>
				<view class="u-m-t-20 u-font-24 u-tips-color">
				  <view class="u-flex">当前个人钱包余额{{ personalWallet }}元，<text class="u-font-28 fw700" style="color: #4D5893;" @click="handleAllMoney">全部提现</text></view>
					<view class="u-m-t-16">单日个人钱包提现频次不可超过{{ MAX_COUNT }}次</view>
				  <view v-show="value*1 > MAX_AMOUNT*1" class="u-m-t-16 red">单个个人钱包提现金额不可超过{{ MAX_AMOUNT }}元</view>
					<view v-show="value*1 > personalWallet*1" class="u-m-t-16 red">提现金额超过个人钱包余额</view>
				</view>
			</my-card>
			
			<view
				class="u-p-l-30 u-m-t-20 u-font-28 fw700" 
				style="color: #4D5893;" 
				@click="$u.route('/pageXf/widthdraw-bill/widthdraw-bill')">提现记录</view>
			
			<cu-keyboard ref="cukeyboard" :maxNumber="MAX_AMOUNT" confirmText="提现" @change="change" @confirm="confirm"></cu-keyboard>
    </movable-area>
		
		<u-modal
			:show="modalShow" 
			title="提示"
			show-cancel-button 
			:content="'本次提现金额为'+value+'元,请确认'" 
			@confirm="submit" 
			@cancel="$refs.cukeyboard.open();modalShow = false"></u-modal>
		<u-toast ref="uToast" />
  </view>
</template>

<script>
	import { sendWithdraw, getWithdrawInfo } from '../xf.js';
	import cuKeyboard from '../componts/cu-keyboard/cu-keyboard.vue'
	
  export default {
		components:{ cuKeyboard },
    data() {
      return {
        accountType:"微信零钱",
        value:"",
        sourceType:"",
				btnDisabled:false,
				personalWallet:'0.00',
				modalShow:false,
				MAX_AMOUNT:200,
				MAX_COUNT:10
      }
    },
    onLoad(options) {
      this.sourceType = options.sourceType;
			getWithdrawInfo().then(r => {
				let d = r.data.data;
				this.personalWallet = d?.personalWallet || '0.00';
				this.MAX_AMOUNT = d?.CASH_WITHDRAWAL_SINGLE_USER_MAX_AMOUNT*1 || 200;
				this.MAX_COUNT = d?.CASH_WITHDRAWAL_SINGLE_USER_MAX_COUNT || 10;
				let status = d?.lastCashWithdrawal?.status || '';
				if(status == 1 || status == 2){
					this.$u.route('/pageXf/withdraw-success/withdraw-success',{amount:d.lastCashWithdrawal.totalAmount,createTime:d.lastCashWithdrawal.createTime})
				}
			})
    },
    methods: {
			submit(){
				sendWithdraw({ totalAmount:(this.value*1).toFixed(2) }).then(r => {
					this.btnDisabled = false;
					if(r.data.code == 200){
						uni.redirectTo({ url:'/pageXf/withdraw-success/withdraw-success?amount='+this.value })
					}else{
						this.$refs.cukeyboard.open();
						this.$refs.uToast.show({ title: r.data.msg, type: 'error' });
					}
				}).catch(() => {
					this.btnDisabled = false;
					this.$refs.cukeyboard.open();
				})
			},
			change(val){
			  this.value = val
			},
      confirm(){
				if(this.btnDisabled) return;
				if(!this.value) return this.$refs.uToast.show({ title: '请输入提现金额', type: 'warning' });
				if(this.value*1 > this.MAX_AMOUNT*1) return this.$refs.uToast.show({ title: `单个个人钱包提现金额不可超过${this.MAX_AMOUNT}元`, type: 'warning' });
				if(this.value*1 < 1) return this.$refs.uToast.show({ title: '提现金额不能小于1元', type: 'warning' });
				if(this.value*1 > this.personalWallet*1) return this.$refs.uToast.show({ title: '提现金额超过个人钱包余额', type: 'warning' });
				this.btnDisabled = true;
				this.modalShow = true;
      },
      handleAllMoney(){
				this.$refs.cukeyboard.value = this.personalWallet;
      },
      backClick(){
        if(this.sourceType == 'wallet'){
          uni.redirectTo({ url:'../wallet/wallet' })
        }else{
          uni.switchTab({ url:'/pages/index/index' })
        }
      }
    }
  }
</script>

<style lang="scss">
  .deposit_input{
    border-bottom: 1rpx solid #F8F8F8;
    font-size: 60rpx;
    display: flex;
    align-items: center;
    height: 80rpx;
    margin: 20rpx 0 10rpx 20rpx;
    &_cursor{
    	display: inline-block;
    	width: 4rpx;
    	height: 40rpx;
    	border: 2rpx;
    	background-color: #57BE6D;
    	margin-left: 8rpx;
    	animation:cursorImg 1s infinite steps(1, start);
    	@keyframes cursorImg {
    		0%, 100% {
    			opacity: 0;
    		}
    		50% {
    			opacity: 1;
    		}
    	}
    }
  }
	.red{
		color: red;
	}
</style>
