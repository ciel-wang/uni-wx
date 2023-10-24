<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			
			<view class="searchStyle u-m-b-20">
			  <view class="u-width-83">
			    <u-search
			      placeholder="请输入书名/作者/ISBN搜索图书" 
			      v-model.trim="bookName"
			      :showAction="false" 
			      margin="0 30rpx"
			      height="70"
			      @search="search"></u-search>
			  </view>
			  <view class="u-width-15 u-text-center" @click="scanClick">
			    <u-icon name="saoma" color="#2979ff" custom-prefix="custom-icon" size="36"></u-icon>
					<view class="u-font-24">扫ISBN</view>
			  </view>
			</view>
			
			<scroll-view scroll-y style="height: calc(100% - 134rpx);width: 100%;">
				<my-card margin="0" showHead :bodyStyle="{padding:'0 30rpx'}">
					<view slot="head" class="fw700 u-flex">
						<u-icon name="remen" custom-prefix="custom-icon" size="40" color="red" customStyle="margin-right:10rpx;"></u-icon>热门搜索
					</view>
					<view class="u-flex u-flex-wrap">
						<view 
							class="hot_class" 
							v-for="(item,index) in hotLabels" :key="index"
							@click="searchItemClick(item)"> {{ item }} </view>
					</view>
				</my-card>
				<my-card margin="0" showHead :bodyStyle="{padding:'0 30rpx'}" v-if="historyArr.length">
					<view slot="head" class="u-flex u-row-between fw700">
						历史搜索<u-icon name="shanchu" custom-prefix="custom-icon" size="40" @click="clearHistory"></u-icon>
					</view>
					<view class="u-flex u-flex-wrap">
						<view 
							class="hot_class" 
							v-for="(item,index) in historyArr" :key="index"
							@click="searchItemClick(item)">{{ item }}</view>
					</view>
				</my-card>
				<my-card margin="0" showHead :bodyStyle="{padding:'0 30rpx'}">
					<view slot="head" class="fw700">热门推荐</view>
					<view class="u-flex u-row-around u-flex-wrap">
						<view 
							class="u-width-30 u-m-b-40" 
							v-for="(item,index) in hostBooks" :key="item.id"
							@click="hotBookClick(item)">
							<u-image :src="item.coverImg" width="100%" height="300rpx" customStyle="box-shadow: 4rpx 4rpx 4rpx #e8e8e8;">
								<view style="font-size: 290rpx;color: #c0c4cc;" slot="error" class="custom-icon custom-icon-wodetushu"></view>
							</u-image>
							<view class="u-m-t-20 u-m-b-20 u-line-1 fw700 u-font-36">{{item.bookName}}</view>
							<view class="u-line-1">{{item.bookAuthor}}</view>
						</view>
					</view>
				</my-card>
			</scroll-view>
		</movable-area>
	</view>
</template>

<script>
	import { reqHot } from '../library.js'
	import { reqWxSignature } from '@/api/common/index.js'
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	
	export default {
		data() {
			return {
				bookName:"",
				hotLabels:[],
				historyArr:[],
				hostBooks:[],
			}
		},
		onLoad() {
			this.historyArr = uni.getStorageSync('bookHistory') || [];
			reqHot().then(r => {
				this.hotLabels = r.data.data.hotLabels || [];
				this.hostBooks = r.data.data.hostBooks || [];
			})
			// #ifdef H5
			let url = window.location.href.split('#')[0];
			reqWxSignature({link:url}).then(r => {
				let data = r.data;
				jweixin.config({
					debug: false,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: [ 'scanQRCode' ]
				});
			})
			// #endif
		},
		methods: {
			scanClick(){
				// #ifdef H5
				jweixin.scanQRCode({
				  needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				  scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				  success: (res) => {
				    let result = res.resultStr;
						if(result){
							this.bookName = result.split(',')[1];
							this.search();
						}
				  }
				})
				// #endif
				// #ifdef MP-WEIXIN
				wx.scanCode({
					success:({ result }) => {
						if(!result) return this.$refs.uToast.show({ message:'未识别到有效值，请重试！', type: "warning" });
						this.bookName = result.split(',')[1];
						this.search();
					}
				})
				// #endif
			},
			hotBookClick(item){
				this.$u.route("/pageOther/book-details/book-details",{id:item.id})
			},
			searchItemClick(item){
				this.bookName = item;
				this.search();
			},
			search(){
				let arr = this.historyArr.splice(0,8);
				let index = arr.findIndex(v => v === this.bookName);
				if(index < 0 && this.bookName) arr.unshift(this.bookName);
				uni.setStorageSync('bookHistory',arr);
				this.historyArr = [...arr];
				this.$u.route("/pageOther/search-book-records/search-book-records",{bookName:this.bookName})
			},
			clearHistory(){
				this.historyArr = [];
				uni.removeStorageSync('bookHistory')
			},
			backClick(){
				uni.navigateBack({ delta:1 })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hot_class{
		padding: 14rpx 20rpx;
		border: 1rpx solid #ccc;
		border-radius: 10rpx;
		margin: 0 8rpx 20rpx;
	}
</style>
