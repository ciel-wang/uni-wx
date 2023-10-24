<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
				 <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<u-gap height="20" bgColor="#f8f8f8"></u-gap>
			<my-card padding="0" margin="0 20rpx">
				<u-cell title="账户状态">
				  <u-icon slot="icon" size="32" name="zhanghu" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
					<view slot="value">
						<u-tag v-if="accountState" :text="accountState" type="primary" shape="circle" size="medium"/>
					</view>
				</u-cell>
				<u-cell title="消费码">
				  <u-icon slot="icon" size="32" name="xiaofeima1" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
					<view slot="value">
						<u-tag v-if="qrCodeState" :text="qrCodeState" type="primary" shape="circle" size="medium"/>
					</view>
				</u-cell>
				<u-cell title="卡片状态">
				  <u-icon slot="icon" size="32" name="cardbox" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
					<view slot="value">
						<u-tag v-if="cardState" :text="cardState" type="primary" shape="circle" size="medium"/>
					</view>
				</u-cell>
			</my-card>
		</movable-area>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				accountState:"",
				qrCodeState:"",
				cardState:''
			}
		},
		onLoad(options) {
			let { accountState, qrCodeState, cardState } = options;
			let arr = ['未发卡','正常','报损','挂失','解挂','退卡'];
			this.accountState = accountState == 1 ? "启用" : accountState == 2 ? '停用' : '未启用';
			this.qrCodeState = qrCodeState == 0 ? '未启用' : '启用';
			this.cardState = arr[cardState*1];
		},
		methods: {
			backClick(){
			  uni.redirectTo({ url:"/pages/home/personal/personal" })
			}
		}
	}
</script>
