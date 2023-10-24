<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
				
			<view class="wrap">
				<view class="searchStyle">
					<u-search
						placeholder="请输入书名/作者/ISBN搜索图书" 
						v-model.trim="bookName"
						:showAction="false" height="70"
						@search="search" @clear="search"></u-search>
				</view>
				
				<u-tabs ref="tabs" :list="list" :activeStyle="{color:'#f29100'}" :current="current" :scrollable="false" @change="change"></u-tabs>
				<swiper class="swiper-box" :current="swiperCurrent" @change="swiperChange">
				  <swiper-item class="swiper-item" v-for="(v,k) in list" :key="k" :item-id="k">
						
				    <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="scrolltolower">
				    	<u-empty text="内容为空" mode="data" v-if="recordsArr.length == 0"></u-empty>
				    	
				    	<view style="display: grid;grid-template-columns: repeat(3,32%);grid-gap: 20rpx;justify-content: center;padding: 30rpx;" v-else>
								<my-card padding="0" margin="0" v-for="(item,index) in recordsArr" :key="item.borrowId">
									<view class="body_item" @click="itemClick(item)">
										<view class="img_class">
											<u-image :src="item.coverImg+'?'+ Date.now()" width="100%" height="300rpx">
												<view style="font-size: 270rpx;margin-top: -30rpx;color: #c0c4cc;" slot="error" class="custom-icon custom-icon-wodetushu"></view>
											</u-image>
										</view>
										<view class="desc_class">
											<view class="u-line-1 fw700 u-m-b-20">{{item.bookName}}</view>
											<view v-if="current === 0" class="cFF0000">{{item.dayDiff}}天后归还</view>
											<view v-if="current === 2" class="cFF0000">已还</view>
											<view v-if="current === 1" class="cFF0000">逾期{{item.dayDiff}}天</view>
											<view v-if="current === 3 && item.borrowCount > 0" class="u-success-dark">可借</view>
											<view v-if="current === 3 && item.borrowCount <= 0" class="u-warning">已借光</view>
										</view>
									</view>
								</my-card>
				    	</view>
							
				    	<u-loadmore :status="loadStatus" v-if="recordsArr.length>0"/>
				    </scroll-view>
				  </swiper-item>
				</swiper>
			</view>
			
			<u-popup :show="popupShow" mode="bottom" round="30" :customStyle="{height:current === 3 ? '80%' : 'auto'}" @open="popupOpen" @close="popupShow = false">
				<book-details-item ref="bookDetailsItemRef" v-show="current === 3"></book-details-item>
				<view v-show="current !== 3">
					<view class="u-flex u-p-20 bgfff">
						<u-image :src="itemObj.coverImg+'?'+ Date.now()" width="210rpx" height="300rpx">
							<view style="font-size: 290rpx;color: #c0c4cc;" slot="error" class="custom-icon custom-icon-wodetushu"></view>
						</u-image>
						<view class="u-m-l-30 u-flex-1">
							<view class="fw700 u-line-2 u-m-t-20 u-m-b-20 u-font-36">{{itemObj.bookName}}</view>
							<view class="u-line-1">作者：{{itemObj.bookAuthor}}</view>
							<view class="u-m-t-20 u-m-b-20">借阅：{{itemObj.borrowStartDate}}</view>
							<view>归还：{{itemObj.borrowEndDate}}</view>
						</view>
					</view>
					
					<my-card showHead headBorderBottom margin="20rpx 0">
						<view slot="head" class="fw700">书籍详情</view>
						<view>索书号：{{itemObj.bookIndex}}</view>
						<view class="u-m-t-20">定价：{{itemObj.pricing}}</view>
						<view class="u-m-t-20">架位导航：{{itemObj.libraryName}}{{itemObj.bookPeriodicalsNum}}</view>
						<view class="u-m-t-20">条码号：{{itemObj.barCode}}</view>
					</my-card>
					
					<view class="u-flex u-p-10 bgfff" v-show="current === 0">
						<view class="u-width-40 u-text-center" @click="collectClick">
							<u-icon name="guashishenqingshu" custom-prefix="custom-icon" size="40"></u-icon>
							<view>挂失</view>
						</view>
						<u-button type="error" shape="circle" @click="renewClick">续借</u-button>
					</view>
				</view>
			</u-popup>
			
			<u-toast ref="uToast" />
		</movable-area>
	</view>
</template>

<script>
	import bookDetailsItem from '../book-details-item.vue'
	import { transDate } from '@/utils/my_function.js'
	import { reqBorrowList, reqCollectList, reqBookDetails, reqBorrowBookDetails, sendRenewBook } from '../library.js'
	
	export default {
		components:{ bookDetailsItem },
		data() {
			return {
				bookName:"",
				list:[{name:"在借"},{name:"逾期"},{name:"已还"},{name:"收藏"}],
				current: 0,
				swiperCurrent: 0,
				recordsArr:[],
				popupShow:false,
				itemObj:{},
				pageCount:0,
				pageCurrent:1,
				loadStatus: "loading",
				currentItem:{}
			}
		},
		onLoad() {
			this.initData();
		},
		methods: {
			collectClick(){
				
			},
			renewClick(){
				sendRenewBook({id:this.itemObj.borrowId}).then(r => {
					this.$refs.uToast.show({ message: r.data.msg, type: 'success' })
					this.popupShow = false;
				}).catch(err => {
					this.$refs.uToast.show({ message: err, type: 'error' })
				})
			},
			popupOpen(){
				if(this.current === 3){
					this.$nextTick(function(){
						this.$refs.bookDetailsItemRef.openComponts(this.currentItem.bookListId);
					})
				}
			},
			itemClick(item){
				if(this.current !== 3){
					reqBorrowBookDetails({id:item.borrowId}).then(r => {
						if(r.data.code === 200){
							this.popupShow = true;
							this.itemObj = r.data.data;
						}
					})
				}else{
					this.currentItem = item;
					this.popupShow = true;
				}
			},
			search(){
				this.pageCurrent = 1;
				this.pageCount = 1;
				this.recordsArr = [];
				this.initData();
			},
			initData(){
				let params = {};
				params["size"] = 10;
				params["current"] = this.pageCurrent;
				params['bookName'] = this.bookName;
				if([0,1,2].includes(this.current)){
					params['borrowState'] = this.current === 0 ? 1 : this.current === 2 ? 2 : "";
					params['expireState'] = this.current === 1 ? 2 : "";
					reqBorrowList(params).then(r => {
						if(r.data.code === 200){
							let d = r.data.data;
							this.pageCount = d.pages;
							if(this.current === 0 || this.current === 1){
								d.records.forEach(v => {
									let end = new Date(transDate(v.borrowEndDate) +' 23:59:59');
									let diff = this.current === 0 ? end - new Date() : new Date() - end;
									v.dayDiff = Math.ceil(diff/24/60/60/1000);
								})
							}
							this.recordsArr = [...this.recordsArr,...d.records];
							if(this.pageCount === 1) this.loadStatus = "nomore";
						}
					})
				}
				if(this.current === 3){
					reqCollectList(params).then(r => {
						if(r.data.code === 200){
							let d = r.data.data;
							this.pageCount = d.pages;
							this.recordsArr = [...this.recordsArr,...d.records];
							if(this.pageCount === 1) this.loadStatus = "nomore";
						}
					})
				}
			},
			scrolltolower(){
				if (this.pageCurrent >= this.pageCount) {
					this.loadStatus = "nomore";
				} else {
					this.pageCurrent = ++this.pageCurrent;
					this.initData();
				}
			},
			change({index}) {
				this.swiperCurrent = index;
			},
			swiperChange({ detail: { current } }){
				if(current == this.current) return;
				this.current = current;
				this.recordsArr = [];
				this.pageCount = 1;
				this.pageCurrent = 1;
				this.search();
			},
			backClick(){
				uni.navigateBack({ delta:1 })
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
	margin: 20rpx 0;
}
.swiper-item {
	height: 100%;
}
.body_item{
	width: 100%;height: 300rpx;position: relative;
}
.img_class{
	width: 100%;height: 100%;margin: 20rpx;box-shadow: -6rpx -6rpx 8rpx #ccc;
}
.desc_class{
	position: absolute;bottom: 0;left: 0;width: 100%;z-index: 10;background-color: #fff;padding: 20rpx 10rpx;
}
</style>
