<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			<view class="u-p-20">
				<u-search
					placeholder="请输入学生学号/姓名" 
					v-model="moreParamQuery"
					:showAction="false" 
					bgColor="#fff" height="72rpx"
					@search="search"
					@clear="search"></u-search>
			</view>
			<scroll-view scroll-y style="height: calc(100% - 120rpx);width: 100%;" @scrolltolower="scrolltolower">
        <u-empty text="没有数据" mode="list" v-if="studentArr.length == 0"></u-empty>
        <my-card padding="0" margin="0" v-else>
					<u-cell-group :border="false">
					  <u-cell v-for="(item,index) in studentArr" :key="index" @click="cellItemClick(item)">
							<view slot="title" class="u-flex">
								<u-avatar size="80" :text="item.empName && item.empName.substr(0,1)" :fontSize="32" randomBgColor></u-avatar>
								<text class="u-m-l-10">{{ item.empName }}</text>
							</view>
					    <text slot="value">{{ item.gradeName + item.className }}</text>
					  </u-cell>
					</u-cell-group>
				</my-card>
      </scroll-view>
    </movable-area>
		
		<u-popup :show="popupShow" bgColor="#f8f8f8" round="10" @close="popupShow = false">
			<view class="u-text-center u-p-30">紧急联系人</view>
			<view v-for="(item,index) in stuParentArr" :key="index" class="bgfff u-flex u-row-around u-p-20 u-p-t-30 u-p-b-30 u-border-bottom">
				<view class="u-width-60 u-line-1">{{item.parentsName}}</view>
				<view class="u-width-30 u-line-1">{{item.relation}}</view>
				<view @click="callPhoneClick(item.parentsPhone)">
					<u-icon name="phone-fill" size="32"></u-icon>
				</view>
			</view>
			<u-button type="primary" plain shape="circle" customStyle="margin:30rpx;width:calc(100% - 60rpx);" @click="popupShow = false">取消</u-button>
		</u-popup>
  </view>
</template>

<script>
  import { getStudentList, searchParent } from '@/api/home/home.js'
  export default {
    data() {
      return {
        moreParamQuery:"",
        studentArr:[],
        loadStatus: "loading",
        loadText: {
        	loadmore: "轻轻上拉加载更多",
        	loading: "努力加载中...",
        	nomore: "没有更多数据了"
        },
        current:1,
        pageCount:0,
        size:20,
        popupShow:false,
        stuParentArr:[]
      }
    },
    onLoad() {
      this.studentArr = []
      this.current = 1
      this.size = 20
      this.pageCount = 0
      this.initStudentList()
    },
    methods: {
      callPhoneClick(phone){
        uni.makePhoneCall({ phoneNumber: phone });
      },
      cellItemClick(val){
        searchParent({id:val.empId}).then(r => {
          this.stuParentArr = r.data.data;
          this.popupShow = true;
        })
      },
      search(){
        this.studentArr = []
        this.current = 1
        this.pageCount = 0
        this.initStudentList()
      },
      initStudentList(){
        let params = {}
        params['current'] = this.current
        params['size'] = this.size
        params['moreParamQuery'] = this.moreParamQuery
        this.loadStatus = "loading";
        getStudentList(params).then(r => {
          if(r.data.code == 200){
            let d = r.data.data
            this.pageCount = d.pages;
            this.studentArr = [...this.studentArr,...d.records]
            if (this.pageCount == 1) {
            	this.loadStatus = "nomore";
            } else {
            	this.loadStatus = "loadmore";
            }
          }
        })
      },
      scrolltolower() {
      	if (this.current >= this.pageCount) {
      		this.loadStatus = "nomore";
      	} else {
      		this.current = ++this.current;
      		this.initStudentList();
      	}
      },
      backClick(){
        uni.redirectTo({ url:'/pages/home/personal/personal' })
      },
    }
  }
</script>
