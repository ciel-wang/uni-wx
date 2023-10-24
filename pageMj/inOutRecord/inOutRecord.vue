<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<my-card margin="0 20rpx">
					<view class="u-flex u-col-center">
					  <u-avatar :src="vuex_useInfo.faceUrl+'?'+new Date().getTime()" size="140"></u-avatar>
					  <view class="u-m-l-30" style="max-width: calc(100% - 170rpx);">
					    <view class="u-line-1">{{vuex_useInfo.empName}}</view>
					    <view class="u-m-t-10">{{vuex_useInfo.empCode}}</view>
					  </view>
					</view>
				</my-card>
				
				<my-card showHead headBorderBottom>
					<view slot="head" class="u-flex">
						<u-icon name="shuxian" custom-prefix="custom-icon"></u-icon>
						<text class="fw700">通行记录</text>
					</view>
					
					<my-time-axis v-for="(item,index) in inOutRecord" :key="index" :isShowLine="index != inOutRecord.length - 1">
						<template v-slot:node>
						  <text class="u-m-r-6">{{item.date}}</text>
						  <u-icon name="tongzhi" custom-prefix="custom-icon" color="#19be6b" :size="34"></u-icon>
						</template>
						<view slot="content" class="u-flex u-row-between u-borderR-20 u-p-30 u-info-light-bg">
						  <view>
								<view class="u-m-b-16 u-flex">
									<u-tag v-if="item.doorDirection == 1" size="mini" text="入校" />
									<u-tag v-if="item.doorDirection == 2" size="mini" text="出校" />
									<text 
										class="u-m-l-10" 
										:class="[item.temperature > 37.2 ? 'u-error' : '']"
										v-show="item.temperature">{{item.temperature}}℃</text>
								</view>
						    <view>{{item.time}} {{item.week}}</view>
						  </view>
						  <view>
						    <u-avatar :src="item.faceUrl+'?'+new Date().getTime()" size="110" mode="square"></u-avatar>
						  </view>
						</view>
					</my-time-axis>
				</my-card>
			</scroll-view>
		</movable-area>
	</view>
</template>

<script>
	import { studentInOutData, teacherInOutData } from '../mj.js';
	export default {
		data() {
			return {
				inOutRecord:[],
			}
		},
		onLoad() {
		  this.initData()
		},
		methods: {
			initData() {
			  let weekArr = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六','星期日']
			  if(this.vuex_useInfo.bindEmpType != 2){
			    studentInOutData().then(r => {
			      let d = r.data.data.dataList;
			      d.records.forEach(v => {
			        v.date = v.swipeTime.substr(5,5)
			        v.time = v.swipeTime.substr(10)
			        v.week = weekArr[new Date(v.swipeTime.replace(/\-/g, '/')).getDay()]
			        v.faceUrl = r.data.data.staticPrefix + v.faceUrl
			      })
			      this.inOutRecord = d.records
			    })
			  }else{
			    teacherInOutData().then(r => {
			      let d = r.data.data.dataList;
			      d.records.forEach(v => {
			        v.date = v.swipeTime.substr(5,5)
			        v.time = v.swipeTime.substr(10)
			        v.week = weekArr[new Date(v.swipeTime.replace(/\-/g, '/')).getDay()]
			        v.faceUrl = r.data.data.staticPrefix + v.faceUrl
			      })
			      this.inOutRecord = d.records
			    })
			  }
			},
			backClick(){
				uni.switchTab({ url:"/pages/index/index" })
			}
		}
	}
</script>
