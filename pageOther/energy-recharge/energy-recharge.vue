<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="u-p-30 u-flex" @click="rechargeTypeShow = true">
				<text>充值方式：</text>
				<text class="fw700 u-m-r-10">{{ rechargeTypeLabel }}</text>
				<u-icon name="arrow-right"></u-icon>
			</view>
			
			<my-card :border="false" :showHead="false">
				<view>充值金额</view>
				<view class="u-m-t-30 u-flex u-border-bottom" @click="keyBoardShow = true">
					<text class="fw700 u-font-54">￥</text>
					<u--input
						disabled
						placeholder="请输入充值金额" 
						placeholderStyle="margin-left:20rpx;color:#909399;" 
						v-model="amount"
						customStyle="padding:20rpx;fontWeight:700;fontSize:38rpx;">
					</u--input>
				</view>
			</my-card>
			
			<my-button @click="toPay">充值</my-button>
			
			<u-keyboard 
				tips="充值金额" mode="number" :show="keyBoardShow"
				@backspace="amountBackspace" @change="amountChange"
				@confirm="keyBoardShow = false" @cancel="keyBoardShow = false" />
			<u-action-sheet
				:show="rechargeTypeShow" 
				:actions="rechargeTypeDic"
				title="选择充值方式"
				@close="rechargeTypeShow = false"
				@select="rechargeTypeConfirm"></u-action-sheet>
			
			<u-overlay :show="maskShow">
				<view class="w-overlay">正在充值，请等待...</view>
			</u-overlay>
			<u-toast ref="uToast" />
		</movable-area>
	</view>
</template>

<script>
	import { recharge } from '../energy.js'
	import { reqBasicInfo, getWalletName } from '@/api/common/index.js';
	
	export default {
		data() {
			return {
				sourcePage:"",
				rechargeType:0,
				rechargeTypeLabel:"个人钱包",
				rechargeTypeShow:false,
				rechargeTypeDic:[],
				amount:"",
				keyBoardShow:false,
				maskShow:false
			}
		},
		onLoad(option) {
			this.sourcePage = option.sourcePage;
		},
		created() {
			initData().then(r => {
				let data = r.data.data;
				getWalletName().then(r => {
					let d = r.data.data;
					let arr = [];
					if(data.WALLET_PERSONAL_START == 1) arr.push({ value:0,name:'个人钱包'});
					if(data.WALLET_SUBSIDY1_START == 1) arr.push({ value:1,name:d.subsidy1_wallet});
					if(data.WALLET_SUBSIDY2_START == 1) arr.push({ value:2,name:d.subsidy2_wallet});
					if(data.WALLET_SUBSIDY3_START == 1) arr.push({ value:3,name:d.subsidy3_wallet});
					this.rechargeTypeDic = arr;
					if(arr.length){
						this.rechargeType = arr[0].value;
						this.rechargeTypeLabel = arr[0].name;
					}
					this.$forceUpdate()
				})
			})
		},
		methods: {
			toPay(){
				if(![0,1,2,3].includes(this.rechargeType)) return uni.showToast({ icon: 'none', title: '请选择充值方式' });
				if(!this.amount) return uni.showToast({ icon: 'none', title: '请输入充值金额' });
				this.maskShow = true;
				recharge({transferFromWallet:this.rechargeType,transferMoney:this.amount}).then(r => {
					this.maskShow = false;
					this.$refs.uToast.show({ title: r.data.msg, type: 'success' });
					setTimeout(() => {
						uni.redirectTo({ url:"../energy-wallet/energy-wallet" })
					},3000)
				}).catch(err => {
					this.maskShow = false;
					this.$refs.uToast.show({ title: err, type: 'error' });
				})
			},
			rechargeTypeConfirm(e){
				this.rechargeType = e.value;
				this.rechargeTypeLabel = e.name;
			},
			amountChange(val){
				let amount = this.amount;
				if(amount.indexOf('.') !== -1){
					if (val === '.') return false;
					if(amount.split('.')[1].length >= 2) return false;
				}
				this.amount += val;
			},
			amountBackspace(){
				let amount = this.amount;
				if (amount) this.amount = amount.substr(0, amount.length - 1);
			},
			backClick(){
				if(this.sourcePage == 'wallet'){
				  uni.redirectTo({ url:"../energy-wallet/energy-wallet" })
				}else{
				  uni.switchTab({ url:'/pages/index/index' })
				}
			}
		}
	}
</script>
