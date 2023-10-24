<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			
			<view class="u-m-l-20 u-m-r-20">
				<u-search
					placeholder="请输入学工号/姓名" 
					v-model.trim="empName" 
					bg-color="#fff" 
					:showAction="false"
					height="70" 
					@search="search"
					@clear="search">
				</u-search>
			</view>
			
			<scroll-view scroll-y style="height: calc(100% - 70rpx);width: 100%;" @scrolltolower="scrolltolower">
				<u-empty text="没有数据" mode="list" v-if="empList.length<=0"></u-empty>
				<my-card padding="0" v-else>
					<u-cell v-for="(v,i) in empList" :key="i" :title="v.empName" :label="v.deptName">
						<u-image
							slot="icon"
							:src="v.faceUrl" 
							customStyle="margin-right:20rpx;"
							width="120rpx" height="120rpx" shape="circle"></u-image>
						<u-switch slot="value" v-model="v.isAuth" size="40" @change="switchChange(v)"></u-switch>
					</u-cell>
				</my-card>
				
				<u-loadmore :status="loadStatus" v-if="empList.length > 0" />
			</scroll-view>
		</movable-area>
		
		<u-modal
			v-model="modalShow" 
			:content="modalContent" showCancelButton
			@confirm="modalConfirm" @cancel="search"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {empAuthList,updateEmpAuth} from '../mj.js'
	export default {
		data() {
			return {
				empName:"",
				loadStatus: "loading",
				pageCount:1,
				current:1,
				modalShow:false,
				empList:[],
				empId:"",
				devId:"",
				doorId:"",
				authType:"",
        modalContent:"确认是否授权"
			}
		},
		onLoad(options) {
			let data = options.data && JSON.parse(options.data) || {};
			this.devId = data.devId;
			this.doorId = data.doorId;
			this.empList = [];
			this.current = 1;
			this.pageCount = 1;
			this.initDate();
		},
		methods: {
			search(){
				this.empList = [];
				this.current = 1;
				this.pageCount = 1;
				this.modalShow = false;
				this.initDate();
			},
			modalConfirm(){
				let params = {};
				params["devId"] = this.devId;
				params["doorId"] = this.doorId;
				params["empId"] = this.empId;
				params["authType"] = this.authType;
				updateEmpAuth(params).then(res => {
					this.$refs.uToast.show({ message: res.data.msg, type: 'success' })
					this.empName = "";
					this.search();
				}).catch(err => {
					this.$refs.uToast.show({ message: err, type: 'error' })
				})
			},
			initDate(){
				let params = {};
				params["current"] = this.current;
				params['size'] = 10;
				params["devId"] = this.devId;
				params["doorId"] = this.doorId;
				params["empName"] = this.empName;
				this.loadStatus = "loading";
				empAuthList(params).then(res => {
					if(res.data.code == 200){
						let data = res.data.data;
						this.pageCount = data.pages;
						data.records.forEach(v => {
              v.deptName = v.empType == 1 ? v.className : v.deptName
							v.faceUrl = v.faceUrl ? v.staticPrefix + v.faceUrl : '/static/img/face.png';
						})
						this.empList = [...this.empList,...data.records];
						this.loadStatus = this.current == 1 ? 'nomore' : 'loadmore';
					}
				})
			},
			switchChange(v){
        this.modalShow = true;
				if(v.isAuth){
					this.empId = v.empId;
					this.authType = 1;
          this.modalContent = "确认是否授权"
				}else{
					this.empId = v.empId;
					this.authType = 2;
          this.modalContent = "确定要取消权限？"
				}
			},
			scrolltolower() {
				if (this.current >= this.pageCount) {
					this.loadStatus = "nomore";
				} else {
					this.current = ++this.current;
					this.initDate();
				}
			},
			backClick(){
				uni.redirectTo({ url:'../auth/auth' })
			}
		}
	}
</script>

<style>
/* 	>>>.u-cell-box{
		width: auto;
		margin: 30rpx;
		border-radius: 30rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	>>>.u-cell-item-box{
		border-radius: 30rpx;
	}
	>>>.u-content{
		border-radius: 0rpx !important;
	} */
</style>
