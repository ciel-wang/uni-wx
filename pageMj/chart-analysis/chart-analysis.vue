<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
      <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="scrolltolower">
        <view v-if="vuex_useInfo.bindEmpType == 2">
          <view class="bgTop u-p-20 cfff u-rela">
            <view class="u-flex u-row-between">
							<view>
								{{dayDate}}
								<!-- <u-icon name="arrow-down-fill" customStyle="margin-left:10rpx;" @click="calendarShow = true"></u-icon> -->
							</view>
              <view class="u-flex" @click="schemeShow = true">
                {{scheme}}
                <u-icon name="setting" size="36" color="#fff" customStyle="margin:0 20rpx 0 10rpx;"></u-icon>
              </view>
            </view>
            <view class="u-flex u-row-around u-col-center u-text-center u-m-t-60 u-m-b-100">
              <view>
                <text class="fw700 u-font-36">{{staticObj.totalStudentCount || 0}}</text>
                <view class="u-m-t-20">总人数(人)</view>
              </view>
              <view>
                <text class="fw700 u-font-36">{{staticObj.countRealTotal || 0}}</text>
                <view class="u-m-t-20">在校人数(人)</view>
              </view>
              <view>
                <text class="fw700 u-font-36">{{staticObj.qjCount || 0}}</text>
                <view class="u-m-t-20">请假人数(人)</view>
              </view>
            </view>
						
            <view class="u-flex u-row-around u-col-center u-flex-wrap u-content-color u-text-center">
              <view class="u-m-b-20 u-width-45">
                <my-card margin="0" box-shadow="0px 4rpx 4rpx #e8e8e8">
                	<text>入校人数</text>
                	<view class="u-flex u-row-center u-m-t-20"><text class="u-font-36 fw700">{{staticObj.inEmpCount || 0}}</text>人</view>
                </my-card>
              </view>
              <view class="u-m-b-20 u-width-45">
								<my-card margin="0" box-shadow="0px 4rpx 4rpx #e8e8e8">
									<text>离校人数</text>
									<view class="u-flex u-row-center u-m-t-20"><text class="u-font-36 fw700">{{staticObj.outEmpCount || 0}}</text>人</view>
								</my-card>
              </view>
              <view class="u-width-45">
								<my-card margin="0" box-shadow="0px 4rpx 4rpx #e8e8e8">
									<text>入校人次</text>
									<view class="u-flex u-row-center u-m-t-20"><text class="u-font-36 fw700">{{staticObj.inCount || 0}}</text>次</view>
								</my-card>
              </view>
              <view class="u-width-45">
								<my-card margin="0" box-shadow="0px 4rpx 4rpx #e8e8e8">
									<text>离校人次</text>
									<view class="u-flex u-row-center u-m-t-20"><text class="u-font-36 fw700">{{staticObj.outCount || 0}}</text>次</view>
								</my-card>
              </view>
            </view>
          </view>
					
          <view>
            <my-card margin="0 30rpx" showHead headBorderBottom :bodyStyle="{padding:'0 30rpx'}" box-shadow="0px 4rpx 4rpx #e8e8e8">
              <view slot="head" class="u-flex u-row-between">
								<view class="u-flex">
									<u-icon name="shuxian" custom-prefix="custom-icon"></u-icon>
									<text class="u-font-32 fw700">详情</text>
								</view>
								
                <u-icon 
                  name="shaixuan1" 
                  custom-prefix="custom-icon" 
                  size="40" color="#000" 
                  @click="classShow = true"></u-icon>
              </view>
              
              <view v-for="(item,index) in inOutRecord" :key="item.id" class="u-p-t-30 u-p-b-30" style="border-bottom: 1rpx dashed #e4e7ed;">
                <view class="u-flex u-row-between u-m-b-30">
                  <view class="u-width-70 u-flex">
                    <view class="u-line-1" style="max-width: 55%;">{{item.gradeName + item.className}}</view>：应到 
                    <text class="fw700">{{item.classStudentCount}} 人</text>
                  </view>
                  <view class="u-flex u-content-color" @click="$u.route('/pageMj/in-out-details/in-out-details',{dayDate:dayDate,classId:item.classId,schemaCode:schemaCode})">
                    查看详情<u-icon name="arrow-right" customStyle="margin-left:10rpx;"></u-icon>
                  </view>
                </view>
                <view class="u-flex u-row-around">
                  <view class="u-text-center">
                    <text>请假</text>
                    <view class="u-m-t-4 fw700" :class="[item.qjCount > 0 ? 'u-error' : '']">{{item.qjCount}}人</view>
                  </view>
                  <view class="u-text-center">
                    <text>在校</text>
                    <view class="u-m-t-4 fw700" :class="[item.inEmpCount > 0 ? 'u-error' : '']">{{item.inEmpCount}}人</view>
                  </view>
                  <view class="u-text-center">
                    <text>不在校</text>
                    <view class="u-m-t-4 fw700" :class="[item.classStudentCount - item.inEmpCount > 0 ? 'u-error' : '']">{{item.classStudentCount - item.inEmpCount}}人</view>
                  </view>
                </view>
              </view>
            </my-card>
          </view>
        </view>
        
        <u-loadmore :status="loadStatus" icon-type="flower" v-if="inOutRecord.length > 0" />
      </scroll-view>
    </movable-area>
		
		<u-action-sheet
			:show="schemeShow" 
			:actions="schemeList"
			title="请选择"
			@close="schemeShow = false"
			@select="schemeConfirm"></u-action-sheet>
		
		<!-- <u-calendar :show="calendarShow" @change="calendarChange"></u-calendar> -->
		
		<u-popup :show="classShow" mode="bottom" closeable @close="classShow = false">
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
		  				<view class="u-m-b-20 u-borderR-8 bgfff u-p-16" v-for="(item1, index1) in item.children" :key="index1">
		  					<view class="item-title u-main-color u-font-26 fw700">
		  						<text>{{item1.label}}</text>
		  					</view>
		  					<view class="u-flex u-flex-wrap">
		  						<view 
		                class="thumb-box" :class="activeArr.includes(item2.id) ? 'activeItem' : ''"
		                v-for="(item2, index2) in item1.children" :key="index2" 
		                @click="selectClass(item2)">
		  							<view class="u-font-24">{{item2.label}}</view>
		  						</view>
		  					</view>
		  				</view>
		  			</view>
		  		</scroll-view>
		  	</block>
		  </view>
		  <view class="u-p-30 u-flex" style="border-top: 10rpx solid #f6f6f6;">
		    <u-button type="info" customStyle="margin-right:20rpx;" @click="activeArr = []">重置</u-button>
		    <u-button type="primary" @click="selectClassSubmit">完成</u-button>
		  </view>
		</u-popup>
  </view>
</template>

<script>
  import { teacherMjStatic, classInOutData, mjList } from '../mj.js';
  import { getGradeClassData} from '@/api/common/index.js'
  
  export default{
    data(){
      return{
        dayDate:uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
        calendarShow:false,
				scheme:"",
				schemaCode:"",
				schemeShow:false,
				schemeList:[],
				staticObj:{inCount:0,inEmpCount:0,outCount:0,outEmpCount:0,qjCount:0,totalStudentCount:0},
				inOutRecord:[],
				pageCount: 1,
				current: 1,
				loadStatus: 'nomore',
				
        classShow:false,
        gradeClassArr:[],
        scrollTop: 0, //tab标题的滚动条位置
        ClassCurrent: 0, // 预设当前项的值
        menuHeight: 0, // 左边菜单的高度
        menuItemHeight: 0, // 左边菜单item的高度
        activeArr:[],
      }
    },
    onLoad() {
      (async () => {
        await this.getSchemeList();
        this.search()
        this.getTeacherMjStaticData();
        getGradeClassData().then(r => {
          var treeDatas = this.data2tree(r.data.data);
          this.gradeClassArr = treeDatas;
        })
      })()
    },
    methods:{
      getSchemeList(){
        return new Promise((resolve) => {
          mjList().then(res => {
						let data = res.data.data?.schemaList;
						if(data && data.length){
							this.schemeList = data.map(v => ({ name:v.schemaName, value:v.schemaCode }));
							this.scheme = data[0].schemaName;
							this.schemaCode = data[0].schemaCode;
						}
						resolve()
          });
        })
      },
      search(){
        this.pageCount = 0
        this.current = 1
        this.inOutRecord = []
        this.initData()
      },
      initData() {
        let params = {}
        params['dayDate'] = this.dayDate;
        params['size'] = 10;
        params['current'] = this.current;
        params['classIds'] = this.activeArr.join(',');
        params['schemaCode'] = this.schemaCode;
        classInOutData(params).then(r => {
          if(r.data.code == 200){
            let d = r.data.data
            this.pageCount = d.pages
            this.inOutRecord = [...this.inOutRecord,...d.records]
          }
        })
      },
      getTeacherMjStaticData(){
        teacherMjStatic({schemaCode:this.schemaCode}).then(r => {
          this.staticObj = r.data.data
        })
      },
      selectClassSubmit(){
        this.classShow = false;
        this.search()
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
      calendarChange(val){
        this.dayDate = val.result;
        this.current = 1
        this.pageCount = 0
      },
      scrolltolower() {
        if (this.current >= this.pageCount) {
          this.loadStatus = 'nomore';
        } else {
          this.current = ++this.current;
          this.initData();
        }
      },
      schemeConfirm(v) {
        this.scheme = v.name;
        this.schemaCode = v.value;
        this.search()
        this.getTeacherMjStaticData();
      },
      backClick() {
        uni.switchTab({ url: '/pages/index/index' });
      }
    },
  }
</script>

<style lang="scss" scoped>
  .bgTop{
    background: url(http://qs.aiwld.com.cn/static/app/bg6.png) no-repeat;
    background-size: 100%;
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
  	height: 100%;
  	left: 0;
  	top: 0;
  }
  .u-tab-view {
  	height: 100%;
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
  .colorRed{
    color: #FA3534;
  }
</style>
