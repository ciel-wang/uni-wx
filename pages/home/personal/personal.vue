<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
				 <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<u-gap height="20" bgColor="#f8f8f8"></u-gap>
			<my-card padding="0" margin="0 20rpx 20rpx">
				<view class="u-cell u-flex u-row-between bgfff" style="padding: 26rpx 32rpx;" v-show="userInfo.bindEmpType != 3">
					<view class="u-flex">
						<u-icon size="32" name="zu7329" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
						<text>个人头像</text>
					</view>
					<u-notice-bar 
						duration="4000"
						customStyle="width:40%;padding:10rpx 4rpx;"
						v-if="userInfo.faceAuditState >= 0 && userInfo.faceAuditState != 1"
						:text="userInfo.faceAuditState == 0 ? '照片上传成功，等待审核中...' : userInfo.faceAuditState == 1 ? '已通过' : userInfo.faceAuditState == 2 ? `管理员已拒绝，原因：${userInfo.rejectCause || ''}` : ''">
					</u-notice-bar>
					<u-image :src="userInfo.faceUrl && userInfo.faceUrl+'?'+new Date().getTime()" width="100rpx" height="100rpx" shape="circle" @click="updateFaceUrl"></u-image>
				</view>
			</my-card>
			
			<my-card padding="0" margin="0 20rpx 20rpx">
				<u-cell title="学号" :value="userInfo.empCode" v-if="userInfo.bindEmpType == 1">
				  <u-icon slot="icon" size="32" name="xuehaoguanli" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
				<u-cell  
				  title="手机号"
				  v-if="userInfo.bindEmpType == 2" 
				  :value="userInfo.empPhone"
				  @click="$u.route('/pageZ/update-phone/update-phone',{phone:userInfo.empPhone,empId:userInfo.empId})">
				  <u-icon slot="icon" size="32" name="shouji" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
				<u-cell
				  title="手机号" 
				  v-if="userInfo.bindEmpType == 3" 
				  :value="userInfo.parent.parentsPhone"
				  @click="$u.route('/pageZ/update-phone/update-phone',{phone:userInfo.parent.parentsPhone,empId:userInfo.empId})">
				  <u-icon slot="icon" size="32" name="shouji" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
				<u-cell 
				  title="车牌号"
				  v-if="userInfo.bindEmpType == 2"
					@click="carNumClick">
				  <u-icon slot="icon" size="32" name="chepaihao" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
					<view slot="value">
						<u-tag v-if="carNumValue" :text="carNumValue" type="primary" shape="circle" size="medium"/>
					</view>
				</u-cell>
			</my-card>
			
			<my-card padding="0" margin="0 20rpx 20rpx">
				<u-cell  title="学生头像" @click="updateFaceUrl" v-if="userInfo.bindEmpType == 3">
				  <u-icon slot="icon" size="32" name="zu7329" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
					<u-image slot="right-icon" :src="userInfo.faceUrl" width="100rpx" height="100rpx" border-radius="100rpx"></u-image>
				</u-cell>
				<u-cell title="学生姓名" v-if="userInfo.bindEmpType == 3" :value="userInfo.empName">
				  <u-icon slot="icon" size="32" name="xingming" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
				<u-cell title="学生学号" v-if="userInfo.bindEmpType == 3" :value="userInfo.empCode">
				  <u-icon slot="icon" size="32" name="xuehaoguanli" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
				<u-cell title="学校" :value="userInfo.schoolName">
				  <u-icon slot="icon" size="32" name="xuexiao" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
				<u-cell title="班级" v-if="userInfo.bindEmpType != 2" :value="userInfo.gradeName + userInfo.className || ''">
				  <u-icon slot="icon" size="32" name="banji" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
				<u-cell 
				  title="学生列表" 
				  v-if="userInfo.bindEmpType == 2" 
				  @click="studentListClick">
				  <u-icon slot="icon" size="32" name="xueshengliebiao" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
			</my-card>
			
			<my-card padding="0" margin="0 20rpx 20rpx">
				<u-cell title="账户与安全" @click="accountClick">
				  <u-icon slot="icon" size="32" name="zhanghuyuanquan" custom-prefix="custom-icon" customStyle="margin-right:10rpx;"></u-icon>
				</u-cell>
			</my-card>
			
			<u-button
				customStyle="width:60%;margin-top:80rpx;" type="info" shape="square" 
				@click="handleSwitchIdentities">切换身份</u-button>
				
			<u-button
				customStyle="width:60%;margin-top:30rpx;" type="error" shape="square" 
				@click="modalShow = true;modalContent = '您确定解除绑定？';btnType = 'userUnbind';">解除绑定</u-button>
		</movable-area> 
		
		<u-popup :show="carShow" height="840" closeable @close="carShow = false">
		  <view>
		    <view class="u-p-30 u-text-center u-font-32 fw700">我的车库</view>
		    
		    <scroll-view scroll-y style="height: 610rpx;">
					<my-card margin="0 20rpx">
						<view class="u-flex u-row-between u-m-b-30" v-for="v in carInfos" :key="v.id">
						  <view class="u-width-66">{{v.plateNum}}</view>
						  <view class="u-width-30 u-flex u-row-between">
						    <u-icon name="edit-pen" size="50" class="u-m-r-60" @click="handleEdit(v.id)"></u-icon>
						    <u-icon name="minus-circle" size="50" @click="handleDelet(v.id)"></u-icon>
						  </view>
						</view>
					</my-card>
		    </scroll-view>
		    
		    <view class="u-p-t-20 u-p-b-20">
		      <u-button 
						customStyle="width:60%;" type="primary" shape="circle" 
						@click="carShow = false;$u.route('/pageZ/update-carNum/update-carNum',{type:'add'});">添加新的爱车</u-button>
		    </view>
		  </view>
		</u-popup>
		
		<u-modal :show="modalShow" title="提示" :content='modalContent' showCancelButton @confirm="modalConfirm" @cancel="modalShow = false"></u-modal>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在上传，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {userInfo, userUnbind ,uploadFaceimg,removePlatenum } from '@/api/home/home.js'
	import config from '@/config/index.js'
	
	export default {
		data() {
			return {
				userInfo:{},
				carNumValue:"",
				carShow:false,
				carInfos:[],
				carId:"",
				modalShow:false,
				modalContent:'',
				btnType:'',
				maskShow:false,
			}
		},
		onLoad() {
			this.initPageData();
		},
		methods: {
			handleEdit(id){
			  this.$u.route('/pageZ/update-carNum/update-carNum',{type:'edit',id})
			},
			handleDelet(id){
			  this.carShow = false;
			  this.modelShow = true
			  this.btnType = 'car'
			  this.modelContent = "您确定要删除此车辆信息？"
			  this.carId = id;
			},
			carNumClick(){
			  if(!this.carNumValue){
			    this.$u.route('/pageZ/update-carNum/update-carNum',{type:'add'})
			  }else{
			    this.carShow = true;
			  }
			},
			updateFaceUrl(){
				uni.chooseImage({
					count:1,
					success: (res) => {
						this.maskShow = true;
						uni.uploadFile({
							url:`${config.baseUrl}/iot-wx/user/upload/faceimg`,
							header:{'token':this.vuex_urlobj.token},
							name:'file',
							filePath:res.tempFilePaths[0],
							success: (r) => {
								let data =JSON.parse(r.data);
								if(data.code == 200){
									this.maskShow = false;
									this.$refs.uToast.show({ message: data.msg, type: "success" });
									this.initPageData();
								}else{
									this.maskShow = false;
									this.$refs.uToast.show({ message: data.msg, type: "error" });
								}
							},
						})
					}
				})
			},
			studentListClick(){
			  uni.navigateTo({ url:'/pageZ/student-list/student-list' })
			},
			accountClick(){
			  uni.navigateTo({
			    url:`/pageZ/account-security/account-security?accountState=${this.userInfo.accountState}&cardState=${this.userInfo.cardState}&qrCodeState=${this.userInfo.qrCodeState}`
			  })
			},
			handleSwitchIdentities(){
			  let bindId = this.userInfo.empId+'_'+this.userInfo.bindEmpType
			  uni.navigateTo({ url:`../switch-identities/switch-identities?bindId=${bindId}` })
			},
			initPageData(){
				userInfo().then(res => {
					if(res.data.code == 200){
			      let data = res.data.data;
			      this.userInfo = data;
						this.carInfos = data.carInfos || [];
						this.carNumValue = data?.carInfos ? data?.carInfos[data.carInfos.length -1]?.plateNum : '';
					}
				})
			},
			modalConfirm(){
				if(this.btnType == 'userUnbind'){
				  userUnbind().then(res => {
				  	if(res.data.code == 200){
				  		this.$refs.uToast.show({ message: res.data.msg, type: "success" });
				  	  uni.removeStorageSync('urlobj_key');
							uni.removeStorageSync('vuex_urlobj');
							uni.removeStorageSync('vuex_menuAuth');
							this.modalShow = false;
				  		setTimeout(() => {
				  	    uni.navigateTo({ url:"../switch-identities/switch-identities" })
				  		},2000)
				  	}
				  }).catch(err => {
						this.modalShow = false;
						this.$refs.uToast.show({ message: err, type: "error" });
					})
					return;
				}
				removePlatenum({id:this.carId}).then(res => {
				  this.carId = ''
				  if(res.data.code == 200){
				  	this.$refs.uToast.show({ message: res.data.msg, type: "success" });
				    this.initPageData();
				  }
				}).catch(err => {
					this.$refs.uToast.show({ message: err, type: "error" });
				})
			},
			backClick(){
				uni.switchTab({ url:'/pages/home/home' })
			}
		}
	}
</script>

<style>

</style>
