<template>
	<view style="width: 100%;height: 100%;">
		<view class="u-m-l-20 u-m-r-20">
			<u-search
				placeholder="请输入学工号/姓名" 
				v-model.trim="empName" 
				:showAction="false"
				height="70" 
				@search="search"
				@clear="search">
			</u-search>
		</view>
		
		<scroll-view scroll-y style="height: calc(100% - 70rpx);width: 100%;">
		  <u-empty text="没有数据" mode="search" v-if="recordsList.length <= 0"></u-empty>
		  <view v-else style="display: grid;grid-template-columns: repeat(3,31%);grid-gap: 20rpx;justify-content: center;padding: 30rpx;">
				<my-card margin="0" padding="10rpx" v-for="item in recordsList" :key="item.empCode">
					<view class="u-text-center">
						<u-avatar :src="item.faceUrl + `?${new Date().getTime()}`" mode="square" size="170"></u-avatar>
						<view class="u-m-t-10 u-text-left">{{item.empName}}</view>
						<view class="u-m-t-10 u-m-b-10 u-text-left">{{item.empCode}}</view>
						<view class="u-text-left u-font-26" v-if="sourceType == 'in'">{{item.inOutTime.substr(5)}}</view>
					</view>
				</my-card>
		  </view>
		</scroll-view>
	</view>
</template>

<script>
  import { teacherInOutDetailsData, teacherQjDetailsData } from './mj.js'
  
  export default{
    props:['dayDate','classId','schemaCode'],
    data(){
      return{
        sourceType:'',
        empName:"",
        recordsList:[]
      }
    },
    methods:{
      switchItem(val){
        this.sourceType = val == 0 ? 'out' : val == 1 ? 'qj' : val == 2 ? 'in' : ''
        this.empName = ""
        this.search()
      },
      search(){
        this.recordsList = [];
        this.initdata()
      },
      initdata(){
        let params = {}
        params['dayDate'] = this.dayDate;
        params['classId'] = this.classId;
        params['empName'] = this.empName;
        params['schemaCode'] = this.schemaCode;
        if(this.sourceType == 'qj'){
          teacherQjDetailsData(params).then(r => {
            this.recordsList = r.data.data
          })
        }else{
          params['inOrOut'] = this.sourceType == 'out' ? 2 : 1
          teacherInOutDetailsData(params).then(r => {
            this.recordsList = r.data.data
          })
        }
      },
    }
  }
</script>
