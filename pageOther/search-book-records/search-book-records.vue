<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			
			<view class="searchStyle">
			  <view class="searchStyle_first">
			    <u-search
			      placeholder="请输入书名/作者/ISBN搜索图书" 
			      v-model.trim="bookName"
			      :showAction="false" margin="0 30rpx" height="70"
			      @search="search" @clear="search"></u-search>
			  </view>
			  <view class="searchStyle_last" @click="popupShow = true">
			    <u-icon name="list" customStyle="margin-right:10rpx;"></u-icon>筛选
			  </view>
			</view>
			<view class="u-p-30">
				<u-checkbox-group size="32" iconSize="26" @change="stateChange">
					<u-checkbox name="ischecked" label="只看可借" :labelSize="28" labelColor="#303133"></u-checkbox>
				</u-checkbox-group>
			</view>
			
			<scroll-view scroll-y style="height: calc(100% - 212rpx);width: 100%;" @scrolltolower="scrolltolower">
				<u-empty text="内容为空" mode="data" v-if="bookList.length === 0"></u-empty>
				<view v-else>
					<my-card margin="0" v-for="(item,index) in bookList" :key="item.id" @click="bookItemClick(item)">
						<view class="u-flex u-col-top u-relative">
							<view style="box-shadow: 4rpx 4rpx 4rpx #e8e8e8;width: 210rpx;height: 300rpx;min-width: 210rpx;">
								<u-image :src="item.coverImg" width="100%" height="100%">
									<view style="font-size: 290rpx;" slot="error" class="custom-icon custom-icon-wodetushu"></view>
								</u-image>
							</view>
							<view class="u-m-l-30 u-width-50">
								<view class="u-line-2 fw700 u-font-36">{{item.bookName}}</view>
								<view class="u-line-1 u-m-t-20 u-m-b-20">{{item.bookAuthor}}</view>
								<view class="u-line-1">{{item.publisherUnit}}</view>
							</view>
							<view 
								class="state_class"
								:class="[item.borrowCount > 0 ? 'u-success-dark' : 'u-warning']">
								{{item.borrowCount > 0 ? "可借" : "已借光"}}
							</view>
						</view>
					</my-card>
				</view>
				<u-loadmore :status="loadStatus" v-if="bookList.length>0"/>
			</scroll-view>
		</movable-area>
		
		<u-popup :show="popupShow" mode="bottom" border-radius="14">
			<my-card margin="0" showHead headBorderBottom showFoot>
				<view slot="head" class="fw700 u-text-center"> 选择馆藏类型 </view>
				<view class="grid_class">
					<view 
						class="grid_item_class" 
						:class="[k == activeIndex ? 'bg_theme' : '']"
						v-for="(v, k) in lbCarrierType" :key="k"
						@click="carrierTypeItemClick(k, v)">{{ v.label }}</view>
				</view>
				<view slot="foot" @click="searchReset" class="u-text-center u-p-t-20 u-p-b-20 u-content-color">取消</view>
			</my-card>
		</u-popup>
	</view>
</template>

<script>
	import { getCfg } from'@/api/home/home.js'
	import { reqSearchBook } from '../library.js'
	
	export default {
		data() {
			return {
				bookName:"",
				popupShow:false,
				current:1,
				pageCount:1,
				loadStatus: "loading",
				lbCarrierType:[],
				activeIndex:0,
				carrierType:0,
				booklistEctypeState:false,
				bookList:[],
				isFirst:true
			}
		},
		onLoad(options) {
			this.bookName = this.isFirst && options.bookName || '';
			this.search();
			getCfg({code:"lbCarrierType"}).then(r => {
				let arr = r.data.data.lbCarrierType.map(v => ({value:v.key,label:v.value}));
				arr.unshift({value:0,label:"全部"})
				this.lbCarrierType = arr;
			})
		},
		methods: {
			bookItemClick(item){
				this.$u.route("../book-details/book-details",{id:item.bookListId})
			},
			stateChange(e){
				this.booklistEctypeState = e.length;
				this.search()
			},
			carrierTypeItemClick(index,item){
				this.activeIndex = index;
				this.carrierType = item.value;
				this.popupShow = false;
				this.search();
			},
			submit(){
				this.popupShow = false;
				this.search();
			},
			searchReset(){
				this.activeIndex = 0;
				this.carrierType = 0;
				this.popupShow = false;
				this.search();
			},
			search(){
				this.isFirst = false;
				let arr = uni.getStorageSync('bookHistory') || [];
				let index = arr.findIndex(v => v === this.bookName);
				if(index < 0 && this.bookName) arr.unshift(this.bookName);
				uni.setStorageSync('bookHistory',arr);
				this.current = 1;
				this.pageCount = 1;
				this.bookList = [];
				this.initData();
			},
			initData(){
				let params = {};
				params["size"] = 10;
				params["current"] = this.current;
				params['bookName'] = this.bookName;
				params['carrierType'] = this.carrierType === 0 ? "" : this.carrierType;
				params['booklistEctypeState'] = this.booklistEctypeState ? 1 : 0;
				reqSearchBook(params).then(r => {
					if(r.data.code === 200){
						let d = r.data.data;
						this.pageCount = d.pages;
						this.bookList = [...this.bookList,...d.records];
						if(d.pages === 1) this.loadStatus = "nomore";
					}
				})
			},
			scrolltolower(){
				if (this.current >= this.pageCount) {
					this.loadStatus = "nomore";
				} else {
					this.current = ++this.current;
					this.initData();
				}
			},
			backClick(){
				uni.navigateBack({ delta:1 })
			}
		}
	}
</script>

<style scoped>
.state_class{
	position: absolute;top: 0;right: 0;
}
</style>
