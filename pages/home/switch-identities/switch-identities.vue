<template>
	<view class="switch_page">
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
				 <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<scroll-view scroll-y style="height: 100%;width: 100%;">
			  <view class="u-p-60 u-p-t-80">
			    <view class="u-m-b-40 u-font-36 u-text-center fw700">轻触头像切换身份</view>
			    <view class="u-flex u-flex-wrap u-m-t-40">
			      <view v-for="(item,index) in empArr" :key="index" @click="switchItem(item)" class="u-width-50 u-text-center u-m-t-40 u-flex-col u-col-center">
			        <u-avatar :src="item.faceUrl" size="140"></u-avatar>
			        <view class="u-m-t-8 u-m-b-8">{{item.empName}}</view>
			        <view v-if="item.bindEmpType == 1">{{item.empCode}}</view>
			        <text v-if="item.bindEmpType != 1">{{item.empPhone}}</text>
			        
			        <view class="u-flex u-row-center" style="color: #696969;" v-if="item.bindId == bindId">
			          <view style="width: 14rpx;height: 14rpx;border-radius: 14rpx;background-color: #19be6b;margin-right: 8rpx;"></view>
			          <view>{{tip}}<span class="ani_dot" v-show="tip == '正在退出'">...</span></view>
			        </view>
			      </view>
			      
			      <view class="u-width-50 u-text-center u-m-t-40">
			        <i class="custom-icon custom-icon-tianjia" style="font-size: 140rpx;color: #C8C9CC;" @click="addClick"></i>
			      </view>
			    </view>
			  </view>
			</scroll-view>
		</movable-area>
	</view>
</template>

<script>
	import { getUserIdentity, userInfo } from '@/api/home/home.js'
	import { getMunuAuth } from '@/api/common/index.js';
	
	export default {
		data() {
			return {
				empArr:[],
				tip:"当前使用",
				bindId:"",
			}
		},
		onLoad(val) {
		  this.bindId = val.bindId;
		},
		onShow() {
		  this.tip = "当前使用"
		  getUserIdentity().then(r => {
		    this.empArr = r.data.data;
		    if(this.empArr.length == 0) uni.navigateTo({ url:"/pages/login/login" });
		  })
		},
		methods: {
			switchItem(val){
			  this.$u.vuex('vuex_urlobj.token', val.token);
			  this.$u.vuex('vuex_urlobj.bindEmpType', val.bindEmpType);
			  this.$u.vuex('vuex_urlobj.bindId', val.bindId);
				this.$u.vuex('vuex_urlobj.bindWxId', val.bindWxInfo.id);
			  this.tip = "正在退出";
				// userInfo().then(r => {
				//   let d = r.data.data;
				//   this.$u.vuex('vuex_useInfo', d);
				// })
			  // getMunuAuth().then(r => {
			  //   if(r.data.code == 200){
			  //     this.$u.vuex('vxe_menuAuth',r.data.data)
			  //   }
			    uni.switchTab({ url:'/pages/index/index' })
			  // })
			},
			addClick(){
			  this.tip = "正在退出"
			  setTimeout(() => {
			    this.$u.route('/pages/login/login')
			  },2000)
			},
			backClick(){
			  this.$u.route({ type:'redirectTo', url:'/pages/home/personal/personal' })
			}
		}
	}
</script>

<style lang="scss">
.switch_page{
	.ani_dot {
	  font-family: simsun;    
	}
	:root .ani_dot { /* 这里使用Hack是因为IE6~IE8浏览器下， vertical-align解析不规范，值为bottom或其他会改变按钮的实际高度*/
	  display: inline-block;
	  width: 1.5em;
	  vertical-align: bottom;
	  overflow: hidden;
	}
	@-webkit-keyframes dot {
	  0% { width: 0; margin-right: 1.5em; }
	  33% { width: .5em; margin-right: 1em; }
	  66% { width: 1em; margin-right: .5em; }
	  100% { width: 1.5em; margin-right: 0;}
	}
	.ani_dot {
	  -webkit-animation: dot 3s infinite step-start;
	}
	
	@keyframes dot {
	  0% { width: 0; margin-right: 1.5em; }
	  33% { width: .5em; margin-right: 1em; }
	  66% { width: 1em; margin-right: .5em; }
	  100% { width: 1.5em; margin-right: 0;}
	}
	.ani_dot {
	  animation: dot 3s infinite step-start;
	}
}
</style>
