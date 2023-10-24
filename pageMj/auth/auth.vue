<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
			<view class="u-m-l-20 u-m-r-20">
				<u-search
				  placeholder="请输入门区名称"
				  v-model.trim="doorNameValue"
				  :showAction="false"
				  bg-color="#fff"
				  height="70rpx"
				  @search="search"
					@clear="search"
				></u-search>
			</view>
			
      <scroll-view scroll-y style="height: calc(100% - 70rpx);width: 100%;" @scrolltolower="scrolltolower">
        <u-empty text="没有数据" mode="list" v-if="doorAuthList.length <= 0"></u-empty>
				<view v-else class="u-p-t-20">
					<my-card
						padding="20rpx" margin="0 20rpx 20rpx" 
						border-radius="30" box-shadow="0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1)" 
					  v-for="(v,index) in doorAuthList" :key="index">
					  <view class="u-text-center">
					    <view class="u-flex u-row-around">
					      <view class="u-text-left" style="flex: 0 0 50%;">
					        <view style="font-weight: 700;">{{ v.doorName }}</view>
					        <view class="u-m-t-10 u-line-1">{{ v.title }}</view>
					      </view>
					      <view @click="remoteOpenClick(v)">
					        <u-icon size="50" custom-prefix="custom-icon" name="mj-permission-yuancheng"></u-icon>
					        <view class="u-m-t-10">远程开门</view>
					      </view>
					      <view @click="empAuthClick(v)">
					        <u-icon size="50" custom-prefix="custom-icon" name="mj-permission-shouquan"></u-icon>
					        <view class="u-m-t-10">人员授权</view>
					      </view>
					    </view>
					  </view>
					</my-card>
				</view>
				
				<u-loadmore :status="loadStatus" v-if="doorAuthList.length > 0" />
      </scroll-view>
    </movable-area>
		
		<u-modal
			:show="remoteOpenShow" 
			title="提示" content='确认是否远程开门？' showCancelButton 
			@confirm="remoteOpenConfirm" @close="remoteOpenShow = false" @cancel="remoteOpenShow = false"></u-modal>
		<u-toast ref="uToast" />
  </view>
</template>

<script>
import { doorAuthList, remoteOpen } from '../mj.js';
export default {
  data() {
    return {
      doorNameValue: '',
      doorAuthList: [],
      loadStatus: 'loading',
      pageCount: 1,
      current: 1,
      remoteOpenShow: false
    };
  },
  onLoad() {
    this.doorAuthList = [];
    this.current = 1;
    this.pageCount = 1;
    this.initDate();
  },
  methods: {
    search(v = "") {
      this.doorAuthList = [];
      this.current = 1;
      this.pageCount = 1;
      this.doorNameValue = v;
      this.initDate();
    },
    remoteOpenConfirm() {
      let params = {};
      params['devId'] = this.v.devId;
      params['doorId'] = this.v.doorId;
      remoteOpen(params).then(res => {
				this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
      }).catch(err => {
        this.$refs.uToast.show({ message: err, type: 'error' });
      });
			this.remoteOpenShow = false;
    },
    remoteOpenClick(v) {
      this.v = v;
      this.remoteOpenShow = true;
    },
    initDate() {
      let params = {};
      params['current'] = this.current;
      params['size'] = 10;
      if (this.doorNameValue) {
        params['doorName'] = this.doorNameValue.trim();
      }
      this.loadStatus = 'loading';
      doorAuthList(params).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data;
          if (data.length) {
            data.forEach(v => {
              v.title = v.areaName + '-' + v.devName;
            });
						this.doorAuthList = [...this.doorAuthList,...data];
          }
					this.loadStatus = this.current == 1 ? 'nomore' : 'loadmore';
        }
      });
    },
    scrolltolower() {
      if (this.current >= this.pageCount) {
        this.loadStatus = 'nomore';
      } else {
        this.current = ++this.current;
        this.initData();
      }
    },
    empAuthClick(v) {
      let data = JSON.stringify(v);
      uni.navigateTo({ url: `../empAuth/empAuth?data=${data}` });
    },
    backClick() {
      uni.switchTab({ url:'/pages/index/index' })
    }
  }
};
</script>
