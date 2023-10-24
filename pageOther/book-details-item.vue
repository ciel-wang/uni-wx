<template>
	<view style="height: 100%;width: 100%;">
		<scroll-view scroll-y style="height: calc(100% - 110rpx);width: 100%;">
			<view class="u-flex u-col-center bgfff u-p-20 u-m-b-20">
				<u-image :src="bookInfo.coverImg" width="210rpx" height="300rpx">
					<view style="font-size: 290rpx;color: #c0c4cc;" slot="error" class="custom-icon custom-icon-wodetushu"></view>
				</u-image>
				<view class="u-m-l-30" style="width: calc(100% - 220rpx);">
					<view class="fw700 u-line-2 u-m-t-20 u-m-b-20 u-font-36">{{bookInfo.bookName}}</view>
					<view class="u-line-1">作者：{{bookInfo.bookAuthor}}</view>
					<view class="u-line-1 u-m-t-20 u-m-b-20">分类：{{bookInfo.typeName}}</view>
					<view>已借：{{bookInfo.yjCount}}人次</view>
					<view class="u-m-t-20 u-m-b-20 u-flex">状态：
						<text :class="[bookInfo.borrowCount > 0 ? 'u-success-dark' : 'u-warning']">
							{{bookInfo.borrowCount > 0 ? '可借' : '已借光'}}
						</text>
					</view>
				</view>
			</view>
			
			<view class="bgfff u-p-t-20 u-p-b-20">
				<view class="tag_class">图书简介</view>
				<view class="u-p-l-20 u-p-r-20 u-m-t-20" >
					<u-read-more
						ref="uReadMore" 
						toggle :showHeight="200" 
						fontSize="28rpx"
						:shadowStyle="{padding:'30rpx'}">
						<u-parse :content="bookInfo.bookContent" @load="load"></u-parse>
					</u-read-more>
				</view>
			</view>
			
			<view class="bgfff u-p-t-20 u-m-t-20 u-p-b-20">
				<view class="tag_class">馆藏信息</view>
				<view class="u-relative" v-for="(item,index) in bookListEctypes" :key="index">
					<view 
						style="position: absolute;top: 0;right: 20rpx;font-size: 32rpx;"
						:class="[item.bookState == 6 ? 'u-error' : 'u-success-dark']">
						{{formatterLabel(item.bookState)}}
					</view>
					<view class="u-p-l-20 u-m-t-20">索书号：{{item.bookIndex}}</view>
					<view class="u-p-l-20 u-m-t-20">架位导航：{{item.libraryName}} {{item.bookPeriodicalsNum}}</view>
					<view class="u-p-l-20 u-m-t-20 u-p-b-20">条码号：{{item.barCode}}</view>
					<view class="u-p-l-20 u-p-b-20" v-show="item.borrowEndDate">预计归还：{{item.borrowEndDate.substr(0,10)}}</view>
					<u-gap height="20" bg-color="#f8f8f8" v-if="index != bookListEctypes.length-1"></u-gap>
				</view>
			</view>
			
			<u-gap height="20" class="u-p-b-120" bg-color="#f8f8f8"></u-gap>
			
		</scroll-view>
		
		<view class="u-flex bgfff foot_class">
			<view class="u-width-40 u-text-center" @click="collectClick">
				<u-icon name="shoucang" custom-prefix="custom-icon" size="40" :color="bookInfo.isCollect ? 'u-error' : ''"></u-icon>
				<view>收藏</view>
			</view>
			<u-button type="error" shape="circle" @click="borrowInAdvanceClick">预借</u-button>
		</view>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { reqBookDetails, sendCollectBook } from './library.js'
	
	export default{
		data(){
			return{
				bookInfo:{},
				bookListEctypes:[],
				bookStateDic:[
					{value:1,label:"可借"},
					{value:2,label:"破损"},
					{value:3,label:"遗失"},
					{value:4,label:"保留"},
					{value:5,label:"注销"},
					{value:6,label:"借出"}
				],
				bookListId:0
			}
		},
		methods:{
			load(){
				console.log(22222222);
				this.$refs.uReadMore.init();
			},
			openComponts(id){
				this.bookListId = id;
				reqBookDetails({id}).then(r => {
					let {coverImg,bookName,bookAuthor,borrowCount,bookContent,isCollect,typeName,yjCount,bookListEctypes} = r.data.data;
					this.bookInfo = {coverImg,bookName,bookAuthor,borrowCount,bookContent,isCollect,typeName,yjCount};
					this.bookListEctypes = bookListEctypes || [];
					this.$nextTick(() => {
						this.$refs.uReadMore.init();
					})
				})
			},
			formatterLabel(value){
				let item = this.bookStateDic.find(v => v.value == value);
				return item ? item.label : ""
			},
			collectClick(){
				sendCollectBook({bookListId:this.bookListId}).then(r => {
					this.$refs.uToast.show({ message: r.data.msg, type: 'success' })
					this.bookInfo.isCollect = !this.bookInfo.isCollect;
				}).catch(err => {
					this.$refs.uToast.show({ message: err, type: 'error' })
				})
			},
			borrowInAdvanceClick(){
				this.$u.toast("此功能暂未开放")
			},
		}
	}
</script>

<style scoped>
.tag_class{
	padding: 20rpx;text-align: center;width: 200rpx;
	border-radius: 0 20rpx 20rpx 0;color: #fff;
	background-color: #0D3858;
}
.foot_class{
	width: 100%;
	padding: 10rpx;
	box-sizing: border-box;
}
</style>
