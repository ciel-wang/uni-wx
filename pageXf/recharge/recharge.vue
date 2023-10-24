<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
      <view class="u-p-t-30">
        <my-card padding="20rpx" margin="0 20rpx 30rpx" border-radius="30" showHead showFoot head-border-bottom :foot-style="{'line-height':'60rpx'}" :headStyle="{padding:'40rpx 20rpx 20rpx'}">
        	<view slot="head" class="u-flex">
        		<u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
        		<text>账户余额</text>
        		<text class="fw700 u-font-32 u-m-l-20">￥{{balance}}</text>
        	</view>
					
					<u-form>
						<u-form-item label="自定义金额" labelWidth="160" @click="showKeyBoard" >
							<u--input
								:disabled="true" 
								placeholder="请输入金额" 
								placeholderStyle="margin-left:20rpx;color:#909399;" 
								v-model="rechargeAmount"
								customStyle="padding:20rpx;">
							</u--input>
						</u-form-item>
					</u-form>
					
					<view class="u-flex u-col-top u-m-t-30">
						<view style="flex: 0 0 150rpx;">充值金额</view>
						<u-grid :col="3" :border="false" @click="activeAmount" customStyle="width:calc(100% - 150rpx);">
							<u-grid-item v-for="(q,k) in quickPay" :key="k" :name="k" >
								<view class="gridItem" :class="[k == rechargeAmount ? `bg_theme` : '']">{{q}}</view>
							</u-grid-item>
						</u-grid>
					</view>
					
        	<view slot="foot">
        		<view>1.消费数据没有及时上传可能会影响余额的准确性</view>
        		<view>2.用户如有赊账消费，可能会导致余额出现负值，等充值时一并扣除</view>
						<view class="u-flex">3.单笔充值上限<text style="color: red;">{{ czMax }}</text>元</view>
        	</view>
        </my-card>
      </view>
		</movable-area>
		
		<my-button @click="toPay">立即支付</my-button>
		
		<u-keyboard 
			tips="充值金额" mode="number" :show="keyBoard"
			@backspace="backspace" @change="inputAmount" 
			@confirm="keyBoard = false" @cancel="keyBoard = false" />
	</view>
</template>

<script>
	import { recharge, signPackage, reqBasicInfo } from '@/api/common/index.js'
  import { empWalletAmount } from "../xf.js"
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
  
	export default {
		data() {
			return {
				quickPay:{
					10:'10元',
					20:'20元',
					30:'30元',
					50:'50元',
					100:'100元',
					200:'200元'
				},
				payIng: false,
				keyBoard: false,
				rechargeAmount: "10",
				balance: '',
				weChartPay: true,
				bankCardChartPay: false,
				rechargeType: 2, //充值类型1支付宝 2 微信 3 银联卡
				czMax:200
			}
		},
		onLoad(options) {
      this.sourceType = options.sourceType
			if(options.executeScript){
				let s = new Function(options.executeScript);
				s.call(this);
			}
		},
		created() {
			reqBasicInfo().then(r => {
				let d = r.data.data;
				this.czMax = d.CZ_SIGNLE_MAX_MONEY;
				this.$forceUpdate()
			})
			empWalletAmount().then(res => {
			  this.balance = res.data.data.personalWallet
				this.$forceUpdate()
			})
			// #ifdef H5
			signPackage().then(r => {
				let data = r.data.data;
				jweixin.config({
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: [ 'checkJsApi', 'chooseWXPay' ]
				});
			})
			// #endif
		},
		methods: {
			showKeyBoard() {
				this.keyBoard = true;
			},
			activeAmount(k){
				this.rechargeAmount = k
			},
			inputAmount(val) {
				let rechargeAmount = this.rechargeAmount;
				if(rechargeAmount >= this.czMax*1) return false;
				if(rechargeAmount.indexOf('.') !== -1){
					if (val === '.') return false;
					let s = rechargeAmount + val;
					if(rechargeAmount.split('.')[1].length >= 2 || s > this.czMax*1) return false;
				}else{
					let s = rechargeAmount + val;
					if(s > this.czMax*1) return false;
				}
				this.rechargeAmount += val;
			},
			backspace() {
				let rechargeAmount = this.rechargeAmount;
				if (rechargeAmount){
					this.rechargeAmount = rechargeAmount.substr(0, rechargeAmount.length - 1);
				}
			},
			toPay() {
				if (this.rechargeAmount === '') {
					uni.showToast({ icon: 'none', title: '请输入充值金额' })
					return false;
				}
				if (!this.rechargeType) {
					uni.showToast({ icon: 'none', title: '请选择支付方式' })
					return false;
				}
				if (this.rechargeType !== 2) {
					uni.showToast({ icon: 'none', title: '暂不支持' })
					return false
				}
				this.payIng = true
				recharge({ amount: this.rechargeAmount, rechargeType: this.rechargeType }).then(r => {
					this.payIng = false
					let _data = r.data.data
					// #ifdef H5
						jweixin.chooseWXPay({
							timestamp: _data['timeStamp'], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
							nonceStr: _data['nonceStr'], // 支付签名随机串，不长于 32 位
							package: _data['packageData'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
							signType: _data['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							paySign: _data['paySign'], // 支付签名
							success: function(res) {
								uni.showToast({ icon:'none', title:'充值成功' })
								uni.redirectTo({ url:'../wallet/wallet' })
							}
						});
					// #endif
					// #ifdef MP-WEIXIN
						wx.requestPayment({
						  timeStamp: _data['timeStamp'],
						  nonceStr: _data['nonceStr'],
						  package: _data['packageData'],
						  signType: _data['signType'],
						  paySign: _data['paySign'],
						  function(res) {
						  	uni.showToast({ icon:'none', title:'充值成功' })
						  	uni.redirectTo({ url:'../wallet/wallet' })
						  }
						})
					// #endif
				}).catch(err => {
					uni.showToast({ title: '创建订单失败' })
					this.payIng = false
				})
			},
			backClick() {
        if(this.sourceType == 'wallet'){
          uni.redirectTo({ url: "../wallet/wallet" })
        }else{
          uni.switchTab({ url:'/pages/index/index' })
        }
			},
			rechargeTypeChange(type) {
				this.rechargeType = type;
				this.weChartPay = (type === 2)
				this.bankCardChartPay = !this.weChartPay
			}
		}
	}
</script>

<style scoped>
	.gridItem {
		width: 80% !important;
		margin: 0 10rpx 20rpx;
		border: 1rpx solid #DDDDDD;
    border-radius: 20rpx;
		padding: 20rpx 0;
		text-align: center;
	}
</style>
