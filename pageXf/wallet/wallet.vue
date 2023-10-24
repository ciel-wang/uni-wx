<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			
			<view class="u-p-t-30">
				<view class="wallet_top">
					<view class="u-font-64">￥{{ decrypt ? totalAmount : '****' }}</view>
					<view class="u-flex u-row-between u-col-center u-m-t-30">
						<view class="u-flex">
							<text class="u-font-24">钱包余额（元）</text>
							<u-icon :name="decrypt ? 'eye' : 'eye-off'" @click="decrypt = !decrypt" color="#fff"></u-icon>
						</view>
						<view 
							class="bgfff u-text-center" 
							style="width: 134rpx;height: 52rpx;line-height: 52rpx;border-radius: 74rpx;color: rgba(14, 84, 255, 1);"
							@click="rechargeClick('XF_RECHARGE',1)">充值</view>
					</view>
				</view>
				
				<view class="u-flex u-row-between bgfff wallet_cell" v-for="(item,index) in assets" :key="index" v-if="item.isShow">
					<view class="u-flex">
						<u-icon name="yue" custom-prefix="custom-icon" size="38"></u-icon>
						<text class="u-font-30 u-m-l-20">{{ item.label }}</text>
					</view>
					<view class="u-font-32 fw700">￥{{ item.value }}</view>
				</view>
			</view>
			
      <view class="u-p-l-30 c909399">
        <text class="fw700">温馨提示</text>
        <view class="u-m-t-10" style="line-height: 50rpx;">{{tip}}</view>
      </view>
		</movable-area>
	</view>
</template>

<script>
	import { empWalletAmount } from "../xf.js"
	import { filterApplicate, getItemAuth } from '@/utils/index-data.js'
	import { reqBasicInfo, getWalletName } from '@/api/common/index.js';
	
	export default {
		data() {
			return {
				decrypt:false,
				totalAmount:'',
				assets:[{
					key:'personalWallet',
					label:'个人钱包',
					value:''
				},
				{
					key:'subsidy1Wallet',
					label:'',
					value:''
				},
				{
					label:'',
					key:'subsidy2Wallet',
					value:''
				},
				{
					label:'',
					key:'subsidy3Wallet',
					value:''
				}],
				cid: "1",
				personalWallet:"",
        sourceType:"",
        tip:""
			}
		},
		created() {
			reqBasicInfo().then(r => {
				let d = r.data.data;
				this.assets.forEach(v => {
					if(v.key == 'personalWallet') v.isShow = d.WALLET_PERSONAL_START == 1 ? true : false;
				  if(v.key == 'subsidy1Wallet') v.isShow = d.WALLET_SUBSIDY1_START == 1 ? true : false;
				  if(v.key == 'subsidy2Wallet') v.isShow = d.WALLET_SUBSIDY2_START == 1 ? true : false;
				  if(v.key == 'subsidy3Wallet') v.isShow = d.WALLET_SUBSIDY3_START == 1 ? true : false;
				})
				this.$forceUpdate()
			})
			getWalletName().then(r => {
			  let d = r.data.data;
			  this.tip = d.wallet_expenditure_seq;
			  this.assets.forEach(v => {
					if(v.key == 'subsidy1Wallet'){
					  v.label = d.subsidy1_wallet;
					}
					if(v.key == 'subsidy2Wallet'){
					  v.label = d.subsidy2_wallet;
					}
					if(v.key == 'subsidy3Wallet'){
					  v.label = d.subsidy3_wallet;
					}
			  })
				this.$forceUpdate()
			})
			empWalletAmount().then(res => {
				let data = res.data.data;
				this.totalAmount = data.totalMoney;
				this.assets.forEach(v => {
					if(v.key == 'personalWallet'){
						v.value = data.personalWallet;
						this.personalWallet = data.personalWallet;
					}
					if(v.key == 'subsidy1Wallet'){
						v.value = data.subsidy1Wallet
					}
					if(v.key == 'subsidy2Wallet'){
						v.value = data.subsidy2Wallet
					}
					if(v.key == 'subsidy3Wallet'){
						v.value = data.subsidy3Wallet
					}
				})
				this.$forceUpdate()
			})
		},
		onLoad(val) {
      this.sourceType = val.sourceType
		},
		methods: {
			rechargeClick(key,type){
        let item = getItemAuth(key);
        if(!item || item.enable == 0){
          this.$u.toast("此功能暂未开放")
          return;
        }
        if(type == 1){
          uni.navigateTo({ url:`../recharge/recharge?sourceType=wallet` })
        }else{
          uni.navigateTo({ url:'../withdraw-deposit/withdraw-deposit?sourceType=wallet' })
        }
			},
			backClick() {
				if(this.sourceType == 'home'){
				  uni.switchTab({ url: "/pages/home/home" })
				}else if(this.sourceType == 'erweima'){
          uni.redirectTo({ url:'../xf-erweima/xf-erweima' })
        }else{
          uni.switchTab({ url:'/pages/index/index' })
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wallet{
		&_top{
			background: url(https://qs.aiwld.com.cn/static/app/bg9.png) no-repeat;
			background-size: 100%;
			color: #fff;
			padding: 60rpx;
			margin: 0 30rpx;
		}
		&_cell{
			border-radius: 20rpx;
			padding: 30rpx 40rpx;
			margin: 30rpx;
		}
	}
</style>
