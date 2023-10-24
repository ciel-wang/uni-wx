<template>
	<view class="wallet_page">
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="top_class">
				<view class="u-flex">
					<text class="u-font-24">钱包余额（元）</text>
					<u-icon :name="decrypt ? 'eye' : 'eye-off'" @click="decrypt = !decrypt" color="#fff"></u-icon>
				</view>
				<view class="u-m-t-30 u-m-b-30 u-font-46 fw700">￥{{ decrypt ? waterElectricityWallet : '****' }}</view>
				<view class="parallelogram parallelogram1" @click="handlerTransferOut">
					<view class="parallelogram_text">转出</view>
				</view>
				<view class="parallelogram parallelogram2" @click="handleRecharge">
					<view class="parallelogram_text">转入</view>
				</view>
			</view>
			
			<my-card showHead headBorderBottom>
				<template slot="head">
					<text class="fw700 u-font-32">余额变动明细</text>
					<view style="float: right;" class="fw700 u-tips-color u-flex" @click="handlerAllBill">
						<text>全部</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</template>
				<view v-for="item in billData" :key="item.id" class="u-m-b-30">
					<view class="u-flex u-row-between u-font-32 u-m-b-10 fw700">
						<text>{{ item.devName }}</text>
						<text class="u-error fw700" v-if="[1,4,6].includes(item.recordType*1)">
							{{ item.useMoney == '0.00' ? item.useMoney : ('-'+item.useMoney) }}
						</text>
						<text style="font-weight: 700;color: green;" v-else>
							{{ item.useMoney == '0.00' ? item.useMoney : ('+'+item.useMoney) }}
						</text>
					</view>
					<view class="u-flex u-row-between u-font-28 u-tips-color">
						<text> {{ item.swipeTime }}</text>
						<text>余额：{{ item.afterMoney }}</text>
					</view>
				</view>
			</my-card>
		</movable-area>
	</view>
</template>

<script>
	import { reqBill } from '../energy.js'
	import { getWalletName } from '@/api/common/index.js';
	
	export default {
		data() {
			return {
				waterElectricityWallet:'0.00',
				billData:[],
				decrypt:false,
				walletArr:[]
			}
		},
		created() {
			getWalletName().then(r => {
				let d = r.data.data;
				let arr = [{ value:0,label:'个人钱包' }];
				if(d.subsidy1_wallet) arr.push({ value:1,label:d.subsidy1_wallet});
				if(d.subsidy2_wallet) arr.push({ value:2,label:d.subsidy2_wallet});
				if(d.subsidy3_wallet) arr.push({ value:3,label:d.subsidy3_wallet});
				this.walletArr = arr;
				this.initData();
				this.$forceUpdate();
			})
		},
		methods: {
			initData(){
				reqBill({ size:10,current:1,startDateTime:encodeURI(uni.$u.timeFormat(new Date().getTime(),'yyyy-mm-01 00:00:00')),recordType:'' }).then(r => {
					let d = r.data.data;
					this.waterElectricityWallet = d.waterElectricityWallet || '0.00';
					d.dataList.records.forEach(item => {
						let ext = item.extJson && JSON.parse(item.extJson) || {};
						let windex = item.recordType == 2 ? ext?.transferFromWallet : item.recordType == 6 ? ext?.transferToWallet : '';
						let wlabel = this.walletArr.find(v => v.value == windex);
						if(item.recordType == 2){
							item.devName = `${wlabel ? wlabel.label : ''}转入`
						}else if(item.recordType == 3){
							item.devName = "充值"
						}else if(item.recordType == 4){
							item.devName = "退款"
						}else if(item.recordType == 6){
							item.devName = `转出到${wlabel ? wlabel.label : ''}`
						}
					})
					this.billData = d.dataList.records;
				})
			},
			handlerTransferOut(){
				// if(this.waterElectricityWallet <= 0 ) return uni.showToast({ icon: 'none', title: '暂无可转出金额' });
				uni.redirectTo({
					url:'../transfer-out-amount/transfer-out-amount?amount='+this.waterElectricityWallet
				})
			},
			handleRecharge(){
				uni.redirectTo({ url:'../energy-recharge/energy-recharge?sourcePage=wallet' })
			},
			handlerAllBill(){
				uni.redirectTo({ url:'../energy-bill/energy-bill?sourcePage=wallet' })
			},
			backClick(){
				uni.switchTab({ url:'/pages/index/index' })
			}
		}
	}
</script>

<style lang="scss" scoped>
.wallet_page{
	padding-top: 30rpx;
	.top_class{
		background: url(https://qs.aiwld.com.cn/static/app/bg10.png) no-repeat center;
		background-size: 100% 100%;
		padding: 60rpx;
		margin: 0 30rpx 30rpx;
		color: #fff;
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
	}
	.parallelogram{
		width: 50%;
		height: 64rpx;
		background-color: #4c444f;
		color: rgba(255, 165, 0, 1);
		transform: skew(20deg);
		margin: 20rpx;
		line-height: 64rpx;
		text-align: center;
		position: absolute;
		bottom: -20rpx;
	}
	.parallelogram1{
		left: -24rpx;
	}
	.parallelogram2{
		right: -30rpx;
	}
	.parallelogram_text{
		transform: skew(-20deg);
	}
}
</style>
