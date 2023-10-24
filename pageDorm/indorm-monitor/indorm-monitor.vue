<template>
  <view class="indormmonitorPage">
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
			<view class="top" v-if="vuex_useInfo.bindEmpType != 2">
			  <view @click="$u.route('/pageDorm/dormitory-rules/dormitory-rules',{obj:JSON.stringify(staticObj.dormStsTimeCfgs)})">【出入寝规则】</view>
			  <view 
					class="u-flex u-row-center u-col-center fw700 u-font-40" 
					style="width: 300rpx;height: 300rpx;background-color: #F2F2F2;border-radius: 300rpx;flex-direction: column;margin: 0 auto;">
			    <view class="u-m-b-20">{{nowTime}}</view>
			    <view 
						class="u-flex u-row-center u-col-center" 
						style="width: 110rpx;height: 60rpx;background-color: #FF1700;color: #fff;border-radius: 10rpx;">{{staticObj.currStatus}}</view>
			  </view>
			</view>
			
			<my-card margin="0" :borderRadius="0" showHead headBorderBottom>
				<template slot="head">
					<view
					  class="u-flex u-row-between fw700 u-font-32" 
					  v-if="vuex_useInfo.bindEmpType != 2" 
					  @click="$u.route('/pageDorm/moniter-details/moniter-details')">
					  <text>本月宿舍考勤汇总</text>
					  <u-icon name="arrow-right"></u-icon>
					</view>
					<view v-if="vuex_useInfo.bindEmpType == 2" class="u-flex">
						<u-icon name="shuxian" customPrefix="custom-icon"></u-icon>
					  <view @click="calendarShow = true" class="u-flex">
					    <text class="u-m-r-10">在寝监控 {{dayDate}}</text>
					    <u-icon name="arrow-down"></u-icon>
					  </view>
					</view>
				</template>
			  <view class="u-flex u-flex-wrap">
			    <view class="u-text-center u-width-33">
			      <u-icon name="weigui" custom-prefix="custom-icon" size="60" color="#FF5442"></u-icon>
			      <view class="u-m-t-10 u-m-b-10">未归寝</view>
			      <view class="u-flex u-row-center">
			        <text class="fw700 u-m-l-4" v-if="vuex_useInfo.bindEmpType == 2">{{staticObj.notBack[0]}}</text>
			        <text v-if="vuex_useInfo.bindEmpType == 2">人/</text>
			        <text class="fw700 u-m-r-4">{{staticObj.notBack[1]}}</text>次
			      </view>
			    </view>
			    <view class="u-text-center u-width-33">
			      <u-icon name="weichuhang" custom-prefix="custom-icon" size="60" color="#EB5757"></u-icon>
			      <view class="u-m-t-10 u-m-b-10">未出寝</view>
			      <view class="u-flex u-row-center">
			        <text class="fw700 u-m-l-4" v-if="vuex_useInfo.bindEmpType == 2">{{staticObj.notOut[0]}}</text>
			        <text v-if="vuex_useInfo.bindEmpType == 2">人/</text>
			        <text class="fw700 u-m-r-4">{{staticObj.notOut[1]}}</text>次
			      </view>
			    </view>
			    <view class="u-text-center u-width-33">
			      <u-icon name="qingjia" custom-prefix="custom-icon" size="60" color="#55AE31"></u-icon>
			      <view class="u-m-t-10 u-m-b-10">请假</view>
			      <view class="u-flex u-row-center">
			        <text class="fw700 u-m-l-4">{{staticObj.qjCount}}</text>
			        <text>{{vuex_useInfo.bindEmpType == 2 ? '人' : '次'}}</text>
			      </view>
			    </view>
			    <view class="u-text-center u-width-33 u-m-t-30">
			      <u-icon name="xueshengwangui" custom-prefix="custom-icon" size="60" color="#17ABE3"></u-icon>
			      <view class="u-m-t-10 u-m-b-10">晚归寝</view>
			      <view class="u-flex u-row-center">
			        <text class="fw700 u-m-l-4" v-if="vuex_useInfo.bindEmpType == 2">{{staticObj.lateBack[0]}}</text>
			        <text v-if="vuex_useInfo.bindEmpType == 2">人/</text>
			        <text class="fw700 u-m-r-4">{{staticObj.lateBack[1]}}</text>次
			      </view>
			    </view>
			    <view class="u-text-center u-width-33 u-m-t-30">
			      <u-icon name="wanchuyujing" custom-prefix="custom-icon" size="60" color="#F76510"></u-icon>
			      <view class="u-m-t-10 u-m-b-10">晚出寝</view>
			      <view class="u-flex u-row-center">
			        <text class="fw700 u-m-l-4" v-if="vuex_useInfo.bindEmpType == 2">{{staticObj.lateOut[0]}}</text>
			        <text v-if="vuex_useInfo.bindEmpType == 2">人/</text>
			        <text class="fw700 u-m-r-4">{{staticObj.lateOut[1]}}</text>次
			      </view>
			    </view>
			  </view>
			  <template slot="foot">
					<view v-if="vuex_useInfo.bindEmpType == 2" style="color: #303133;" class="u-flex u-row-between">
						<view class="u-flex"><i class="custom-icon custom-icon-shuxian"></i>详情</view>
						<view v-if="vuex_useInfo.isRelevancyClass" @click="classShow = true">
							<u-icon name="shaixuan1" custom-prefix="custom-icon" size="40" color="#000"></u-icon>
						</view>
					</view>
			  </template>
			</my-card>
			
      <scroll-view scroll-y style="height: calc(100% - 602rpx);width: 100%;" @scrolltolower="scrolltolower">
        <my-card
          margin="0" :borderRadius="0" :bodyStyle="{padding:'0 30rpx'}" 
          v-if="vuex_useInfo.bindEmpType == 2">
          <view v-for="(item,index) in gradeArr" :key="item.id" class="u-p-t-30 u-p-b-30" style="border-bottom: 1rpx dashed #e4e7ed;">
            <view class="u-flex u-row-between u-m-b-30">
              <view class="u-width-70 u-flex">
                <view class="u-line-1" style="max-width: 55%;">{{item.title}}</view>
                <text>：住宿 {{item.LiveStudentCount}} 人</text>
              </view>
              <view @click="$u.route('/pageDorm/moniter-details/moniter-details',{form:JSON.stringify(item),dayDate:dayDate})" class="u-flex">
                查看详情<u-icon name="arrow-right" class="u-m-l-10"></u-icon>
              </view>
            </view>
            <view class="u-flex u-row-around">
              <view class="u-text-center">
                <text>未归寝</text>
                <view class="u-m-t-4 u-flex u-row-center">
                  <text :class="[item.notBack[0] > 0 ? 'u-error-dark' : '']">{{item.notBack[0]}}</text>人/ 
                  <text :class="[item.notBack[1] > 0 ? 'u-error-dark' : '']">{{item.notBack[1]}}</text>次
                </view>
              </view>
              <view class="u-text-center">
                <text>晚归寝</text>
                <view class="u-m-t-4 u-flex u-row-center">
                  <text :class="[item.lateBack[0] > 0 ? 'u-error-dark' : '']">{{item.lateBack[0]}}</text>人/
                  <text :class="[item.lateBack[1] > 0 ? 'u-error-dark' : '']">{{item.lateBack[1]}}</text>次
                </view>
              </view>
              <view class="u-text-center">
                <text>请假</text>
                <view class="u-m-t-4 u-flex u-row-center">
                  <text :class="[item.qjCount > 0 ? 'u-error-dark' : '']">{{item.qjCount}}</text>
                  <text>{{vuex_useInfo.bindEmpType == 2 ? '人' : '次'}}</text>
                </view>
              </view>
              <view class="u-text-center">
                <text>未出寝</text>
                <view class="u-m-t-4 u-flex u-row-center">
                  <text :class="[item.notOut[0] > 0 ? 'u-error-dark' : '']">{{item.notOut[0]}}</text>人/
                  <text :class="[item.notOut[1] > 0 ? 'u-error-dark' : '']">{{item.notOut[1]}}</text>次
                </view>
              </view>
              <view class="u-text-center">
                <text>晚出寝</text>
                <view class="u-m-t-4 u-flex u-row-center">
                  <text :class="[item.lateOut[0] > 0 ? 'u-error-dark' : '']">{{item.lateOut[0]}}</text>人/
                  <text :class="[item.lateOut[1] > 0 ? 'u-error-dark' : '']">{{item.lateOut[1]}}</text>次
                </view>
              </view>
            </view>
          </view>
        </my-card>
      </scroll-view>
    </movable-area>
		
		<u-popup :show="classShow" mode="bottom">
		  <view class="u-menu-wrap">
		  	<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
		  		<view 
		        v-for="(item,index) in gradeClassArr" :key="index"
						class="u-tab-item" :class="[ClassCurrent==index ? 'u-tab-item-active' : '']"
		        :data-current="index" @tap.stop="swichMenu(index)">
		  			<text class="u-line-1">{{item.label}}</text>
		  		</view>
		  	</scroll-view>
		  	<block v-for="(item,index) in gradeClassArr" :key="index">
		  		<scroll-view scroll-y class="bgfff" v-if="ClassCurrent==index">
		  			<view class="u-p-16">
		  				<view class="class-item" v-for="(item1, index1) in item.children" :key="index1">
		  					<view class="item-title">{{item1.label}}</view>
		  					<view class="u-flex u-flex-wrap">
		  						<view 
		                class="thumb-box" :class="activeArr.includes(item2.id) ? 'activeItem' : ''"
		                v-for="(item2, index2) in item1.children" :key="index2" 
		                @click="selectClass(item2)">
		  							<view class="item-menu-name">{{item2.label}}</view>
		  						</view>
		  					</view>
		  				</view>
		  			</view>
		  		</scroll-view>
		  	</block>
		  </view>
		  <view class="u-p-30 u-flex" style="border-top: 10rpx solid #f6f6f6;">
		    <u-button class="u-width-40" type="info" @click="activeArr = []">重置</u-button>
		    <u-button class="u-width-40" type="primary" @click="selectClassSubmit">完成</u-button>
		  </view>
		</u-popup>
		
		<u-datetime-picker
			:show="calendarShow" :value="dateValue"
			mode="date" 
			:maxDate="dateValue" :minDate="0" 
			@confirm="calendarChange" @cancel="calendarShow = false"></u-datetime-picker>
  </view>
</template>

<script>
	import { getGradeClassData } from '@/api/common/index.js'
  import { getStatic, getTeacherGradeData } from '../api/monitor.js'
  export default {
    data() {
      return {
        nowTime:uni.$u.timeFormat(new Date(), 'hh:MM:ss'),
        timer:"",
        gradeArr:[],
        dayDate:uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
        calendarShow:false,
        staticObj:{notBack:[0,0],notOut:[0,0],lateOut:[0,0],lateBack:[0,0],qjCount:0},
        current:1,
        pageCount:0,
        loadStatus: 'nomore',
        classShow:false,
        gradeClassArr:[],
        classIds:"",
        scrollTop: 0, //tab标题的滚动条位置
        ClassCurrent: 0, // 预设当前项的值
        menuHeight: 0, // 左边菜单的高度
        menuItemHeight: 0, // 左边菜单item的高度
        activeArr:[],
				dateValue:Number(new Date())
      }
    },
    onLoad() {
      this.timer = setInterval(() => {
        this.nowTime = uni.$u.timeFormat(new Date(), 'hh:MM:ss')
      },1000)
      this.gradeArr = []
      this.current = 1
      this.pageCount = 0
      this.getStaticList()
      this.getGradeList()
      getGradeClassData().then(r => {
        var treeDatas = this.data2tree(r.data.data);
        this.gradeClassArr = treeDatas;
      })
    },
    methods: {
      selectClassSubmit(){
        this.classShow = false;
        this.classIds = this.activeArr.join(',')
        this.gradeArr = []
        this.current = 1
        this.pageCount = 0
        this.getGradeList()
      },
      selectClass(item){
        if(this.activeArr.includes(item.id)){
          this.activeArr.splice(this.activeArr.findIndex(v => v === item.id), 1)
        }else{
          this.activeArr.push(item.id)
        }
      },
      // 点击左边的栏目切换
      async swichMenu(index) {
      	if(index == this.ClassCurrent) return ;
      	this.ClassCurrent = index;
      	// 如果为0，意味着尚未初始化
      	if(this.menuHeight == 0 || this.menuItemHeight == 0) {
      		await this.getElRect('menu-scroll-view', 'menuHeight');
      		await this.getElRect('u-tab-item', 'menuItemHeight');
      	}
      	// 将菜单菜单活动item垂直居中
      	this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
      },
      // 获取一个目标元素的高度
      getElRect(elClass, dataVal) {
      	new Promise((resolve, reject) => {
      		const query = uni.createSelectorQuery().in(this);
      		query.select('.' + elClass).fields({size: true},res => {
      			// 如果节点尚未生成，res值为null，循环调用执行
      			if(!res) {
      				setTimeout(() => {
      					this.getElRect(elClass);
      				}, 10);
      				return ;
      			}
      			this[dataVal] = res.height;
      		}).exec();
      	})
      },
      data2tree(datas) {
        let obj = {};
        let newArr = datas.reduce((cur,next) => {
          obj[next.schoolId] ? "" : obj[next.schoolId] = true && cur.push({
            id: next.schoolId,
            label: next.schoolName,
            type:1
          });
          return cur;
        },[]) 
        return this.data2treeDG(datas, newArr);
      },
      data2treeDG(datas, dataArray) {
        for(var j = 0; j < dataArray.length; j++) {
          var dataArrayIndex = dataArray[j];
          var childrenArray = [];
          var parentId = dataArrayIndex.id;
          for(var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var schoolId = data.schoolId;
            if(schoolId == parentId) {//判断是否为儿子节点
              var objTemp = {
                id:data.gradeId,
                label:data.gradeName,
                type:2,
                parentId:parentId
              }
              childrenArray.push(objTemp);
            }
          }
          let obj = {};
          let newArr = childrenArray.reduce((cur,next) => {
            obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
            return cur;
          },[]) 
          dataArrayIndex.children = newArr;
          if(childrenArray.length > 0) {//有儿子节点则递归
            this.data3treeDG(datas, childrenArray);
          }
        }
        return dataArray;
      },
      data3treeDG(datas, dataArray) {
        for(var j = 0; j < dataArray.length; j++) {
          var dataArrayIndex = dataArray[j];
          var childrenArray = [];
          var parentId = dataArrayIndex.id;
          for(var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var gradeId = data.gradeId;
            if(gradeId == parentId) {//判断是否为儿子节点
              var objTemp = {
                id:data.classId,
                label:data.className,
                type:3,
                parentId:parentId
              }
              childrenArray.push(objTemp);
            }
          }
          dataArrayIndex.children = childrenArray;
        }
        return dataArray;
      },
      getStaticList(){
        getStatic({dayDate:this.dayDate}).then(r => {
          let d = {...r.data.data};
          if(JSON.stringify(d) != '{}'){
            d.notBack = d.status_3.split('_')
            d.notOut = d.status_4.split('_')
            d.lateOut = d.status_2.split('_')
            d.lateBack = d.status_1.split('_')
            d.qjCount = d.qjCount ? d.qjCount : d.monthQjCount || 0
            this.staticObj = d
          }
        })
      },
      getGradeList(){
        if(this.vuex_useInfo.bindEmpType == 2){
          let params = {}
          params['current'] = this.current;
          params['dayDate'] = this.dayDate;
          params['classIds'] = this.classIds;
          getTeacherGradeData(params).then(r => {
            if(r.data.code == 200){
              let d = r.data.data;
              this.pageCount = d.pages;
              d.records.forEach(v => {
                v.notBack = v.status_3.split('_')
                v.notOut = v.status_4.split('_')
                v.lateOut = v.status_2.split('_')
                v.lateBack = v.status_1.split('_')
                v.LiveStudentCount = v.classLiveStudentCount || v.floorLiveStudenCount || 0
                v.title = (v.gradeName + v.className) || v.floorName
              })
              this.gradeArr = [...this.gradeArr,...d.records]
            }
          })
        }
      },
      calendarChange(e){
        // this.dayDate = val[0];
				this.dayDate = uni.$u.timeFormat(e.value,'yyyy-mm-dd')
				this.calendarShow = false;
        this.gradeArr = []
        this.current = 1
        this.pageCount = 0
        this.getStaticList()
        this.getGradeList()
      },
      scrolltolower(){
        if (this.current >= this.pageCount) {
          this.loadStatus = 'nomore';
        } else {
          this.current = ++this.current;
          this.getGradeList()
        }
      },
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    },
    onUnload() {
      clearInterval(this.timer)
    }
  }
</script>

<style lang="scss" scoped>
  .indormmonitorPage{
    .top{
      padding: 30rpx 30rpx 60rpx;
      background-color: #fff;
      margin-bottom: 20rpx;
    }
  }
  .u-menu-wrap {
    height: 600rpx;
  	display: flex;
  	overflow: hidden;
  }
  .u-tab-view {
  	width: 200rpx;
  	height: 100%;
  }
  .u-tab-item {
  	height: 110rpx;
  	background: #f6f6f6;
  	box-sizing: border-box;
  	display: flex;
  	align-items: center;
  	justify-content: center;
  	font-size: 26rpx;
  	color: #444;
  	font-weight: 400;
  	line-height: 1;
  }
  .u-tab-item-active {
  	position: relative;
  	color: #000;
  	font-size: 30rpx;
  	font-weight: 600;
  	background: #fff;
  }
  .u-tab-item-active::before {
  	content: "";
  	position: absolute;
  	border-left: 4px solid $u-primary;
  	height: 32rpx;
  	left: 0;
  	top: 39rpx;
  }
  .u-tab-view {
  	height: 100%;
  }
  .class-item {
  	margin-bottom: 20rpx;
  	background-color: #fff;
  	padding: 16rpx;
  	border-radius: 8rpx;
  }
  .item-title {
  	font-size: 26rpx;
  	color: $u-main-color;
  	font-weight: bold;
  }
  .item-menu-name {
  	font-weight: normal;
  	font-size: 24rpx;
  }
  .thumb-box {
  	width: 31%;
  	display: flex;
  	align-items: center;
  	flex-direction: column;
  	margin-top: 20rpx;
    border: 1rpx solid #ccc;
    margin-right: 4px;
    padding: 10rpx 0;
    border-radius: 10rpx;
  }
  .activeItem{
    background-color: #2979ff;
    color: #FFFFFF !important;
    border-color: #2979ff;
  }
</style>
