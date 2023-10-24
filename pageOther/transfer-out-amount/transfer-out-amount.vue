<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="u-p-30 u-flex" @click="rechargeTypeShow = true">
				<text>转出到：</text>
				<text class="fw700 u-m-r-10">{{ rechargeTypeLabel }}</text>
				<u-icon name="arrow-right"></u-icon>
			</view>
			
			<my-card :showHead="false">
				<view>转出金额</view>
				<view class="u-m-t-30 u-flex u-border-bottom" @click="keyBoardShow = true">
					<text class="fw700 u-font-54 u-m-r-6">￥</text>
					<u--input
						disabled disabledColor="#ffffff" fontSize="48"
						:placeholder="'可转出'+maxAmount+'元'"
						placeholderStyle="fontSize:28rpx;fontWeight:400;"
						v-model="amount" >
					</u--input>
				</view>
			</my-card>
		</movable-area>
		
		<my-button @click="toPay">确认转出</my-button>
		
		<u-action-sheet
			:show="rechargeTypeShow" 
			:actions="rechargeTypeDic"
			title="选择钱包"
			@close="rechargeTypeShow = false"
			@select="rechargeTypeConfirm"></u-action-sheet>
		<u-keyboard
		  ref="uKeyboard" 
		  mode="number" tips="转出金额"
		  :show="keyBoardShow"
		  @change="amountChange" 
		  @backspace="amountBackspace"
			@cancel="keyBoardShow = false"
			@confirm="keyBoardShow = false"></u-keyboard>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在提交，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { transferXf } from '../energy.js'
	import { reqBasicInfo, getWalletName } from '@/api/common/index.js';
	
	export default {
		data() {
			return {
				rechargeType:0,
				rechargeTypeLabel:"个人钱包",
				rechargeTypeShow:false,
				rechargeTypeDic:[],
				amount:"",
				keyBoardShow:false,
				maskShow:false,
				maxAmount:0
			}
		},
		created() {
			reqBasicInfo().then(r => {
				if(r.data.code == 200){
					let data = r.data.data;
					getWalletName().then(r => {
						if(r.data.code == 200){
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
						}
					})
				}
			})
		},
		onLoad(option) {
			this.maxAmount = option.amount;
		},
		methods: {
			toPay(){
				if(![0,1,2,3].includes(this.rechargeType)) return uni.showToast({ icon: 'none', message: '请选择转出钱包' });
				if(!this.amount) return uni.showToast({ icon: 'none', message: '请输入转出金额' });
				if(this.amount > this.maxAmount) return uni.showToast({ icon: 'none', message: '超出最大可转出金额' });
				this.maskShow = true;
				transferXf({transferToWallet:this.rechargeType,transferMoney:this.amount}).then(r => {
					this.maskShow = false;
					if(r.data.code === 200){
						this.$refs.uToast.show({ message: r.data.msg, type: 'success' });
						setTimeout(() => {
							uni.redirectTo({ url:"../energy-wallet/energy-wallet" })
						},3000)
					}else{
						this.$refs.uToast.show({ message: r.data.msg, type: 'error' });
					}
				}).catch(() => this.maskShow = false)
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
			backlevel(){
				uni.redirectTo({ url:"../energy-wallet/energy-wallet" });
			}
		}
	}
</script>

<style scoped>
	>>>.u-input__content__field-wrapper__field{ font-weight: 700;}
</style>
