<template>
	<view class="receiptPage u-p-t-30">
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<view class="u-p-b-120">
					<!-- 被访人和单据信息 -->
					<my-card :showFoot="false" showHead :headBorderBottom="false" margin="0 30rpx 30rpx">
						<view slot="head" class="u-flex">
							<view class="u-width-50 u-m-r-20 u-line-1 fw700">单号：{{visitorNo}}</view>
							<u-icon name="fuzhi" custom-prefix="custom-icon" size="38" @click="copyVisitorNo"></u-icon>
						</view>
						<view>
							<view class="iconClass">
								<u-icon :name="stateIcon" custom-prefix="custom-icon" size="140" :color="stateColor" />
							</view>
							<!-- 被访人 -->
							<view class="u-p-l-10 u-m-t-10 u-flex">
								<view class="u-text-center u-m-r-20">
									<u-avatar :src="formInfo.staticPrefix + formInfo.targetEmpFaceUrl" size="100" @click="imgClick(formInfo.targetEmpFaceUrl)"></u-avatar>
									<view class="u-font-28">被访人</view>
								</view>
								<view class="u-p-l-20">
									<text class="fw700">{{ formInfo.targetEmpName }}</text>
									<view class="u-type-primary u-m-t-10" @click="phoneClick(formInfo.targetEmpPhone)">
										{{ formInfo.targetEmpPhone }}
									</view>
								</view>
							</view>
							<!-- 单据内容 -->
							<u-cell-group :border="false" customStyle="margin-top:20rpx;padding-bottom:20rpx">
								<u-cell title="到访时间:" :border="false" :value="formInfo.visitorTime"></u-cell>
								<u-cell title="离访时间:" :border="false" :value="formInfo.levalTime"></u-cell>
								<u-cell title="到访事由:" :border="false" :value="formInfo.visitorCause"></u-cell>
								<u-cell title="到访区域:" :border="false" :value="formInfo.visitorArea"></u-cell>
							</u-cell-group>
						</view>
					</my-card>
					
					<!-- 访客信息部分 -->
					<my-card :showFoot="false" showHead headBorderBottom>
						<view slot="head" class="u-flex u-row-between u-col-center fw700">
							{{formInfo.receiptsType == 1 ? '来访访客' : '邀约访客'}}（{{ formInfo.visitors.length }} / {{formInfo.visitorPersonCount}}）
						</view>
						<view class="u-flex u-flex-wrap u-text-center">
							<view v-for="(item,index) in formInfo.visitorsArr" :key="item.id" class="u-m-b-20 u-width-25 u-flex-col u-col-center">
								<u-avatar :src="formInfo.staticPrefix + item.visitorImgUrl2" size="100" @click="imgClick(item.visitorImgUrl2)"></u-avatar>
								<view class="u-line-1 fw700">{{item.visitorName}}</view>
							</view>
							<view class="u-m-b-20 u-width-25" @click="handleView">
								<u-icon name="more-circle" size="102" color="#909399"></u-icon>
								<view class="u-m-t-8">更多</view>
							</view>
						</view>
					</my-card>
					
					<!-- 拒绝原因部分 -->
					<my-card :showHead="false" v-if="visitorState == 4">
						<view class="u-flex">
							<text>拒绝原因：</text>
							<text>{{ formInfo.rejectCause }}</text>
						</view>
					</my-card>
				</view>
			</scroll-view>
		</movable-area>
		
		<!-- 访客页面的按钮 -->
		<view v-if="( sourcePage === 'appointment' && (vuex_useInfo.bindEmpType != 2 || isNoticTarget) ) && (visitorState == '8' || visitorState == 1)">
			<my-button stype="even" @click="visitorBtnClick">
				<template slot="left">取消预约</template>
				<template v-if="visitorState == 8">提交</template>
				<template v-else>重新提交</template>
			</my-button>
		</view>
		<view v-if="( sourcePage === 'appointment' && (vuex_useInfo.bindEmpType != 2 || isNoticTarget) ) && visitorState == '3' && new Date().getTime() < new Date(iosTransDate(formInfo.visitorTime)).getTime()">
		  <my-button @click="cancelClick">取消预约</my-button>
		</view>
		
		<!-- 被访人预约单据页面的按钮 -->
		<view v-if="isAuthBtn && (vuex_useInfo.bindEmpType == 2 && sourcePage === 'appointment' || (isNoticTarget && sourcePage === 'targetInvite')) && formInfo.receiptsType == 1 && visitorState == '1'">
			<my-button stype="even" @click="targetBtnClick">
				<template slot="left">拒绝</template>
				同意
			</my-button>
		</view>
		<view v-if="isAuthBtn && vuex_useInfo.bindEmpType == 2 && formInfo.receiptsType == 1 && visitorState == '4'">
		  <my-button @click="reExaminationClick">重新审核</my-button>
		</view>
		
		<!-- 被访人邀约单据页面的按钮 -->
		<my-button stype="even" @click="targetInviteBtnClick" v-if="formInfo.receiptsType == 2 && visitorState == 8">
			<template slot="left">取消邀约</template>
			提交邀约
		</my-button>
		<my-button 
			stype="even" 
			@click="targetInviteBtnClick" 
			v-if="isAuthBtn && formInfo.receiptsType == 2 && visitorState == 1 && formInfo.targetEmpId === vuex_useInfo.empId">
			<template slot="left">取消邀约</template>
			同意
		</my-button>
		<!-- 填单人非被访人 -->
		<my-button 
			@click="cancelClick" 
			v-if="formInfo.receiptsType == 2 && visitorState == 1 && formInfo.targetEmpId !== vuex_useInfo.empId">
			取消邀约</my-button>
		
		<view v-if="formInfo.receiptsType == 2 && visitorState == '3' && new Date().getTime() < new Date(iosTransDate(formInfo.visitorTime)).getTime()">
		  <my-button @click="cancelClick">取消邀约</my-button>
		</view>
		
		<!-- 审批拒绝时表单 -->
		<u-popup :show="popupFormShow" mode="bottom" width="650rpx" height="600rpx" @close="popupFormShow = false">
			<view class="u-p-t-60 u-p-l-30" style="margin-bottom: 200rpx;">
				<u-form :model="form" ref="uForm" label-width="140">
				  <u-form-item label="拒绝原因" :border-bottom="false" v-if="btnType === 'targetCancel'">
				    <u-input v-model="form.rejectCause" placeholder="请填写拒绝原因" />
				  </u-form-item>
					<u-form-item label="访问线路" :border-bottom="false" v-else @click="visitorLineIdShow = true">
						<u-input disabled disabledColor="#ffffff" v-model="form.visitorLine" placeholder="请选择访问线路" />
					</u-form-item>
				</u-form>
			</view>
		  
			<my-button @click="formSubmit">确定</my-button>
		</u-popup>
		
		<multiple-select
			v-model="visitorLineIdShow"
			:data="visitorLineDic"
			@confirm="visitorLineConfirm"
		></multiple-select>
		
		<u-modal 
			:show="confirmShow" title="提示" 
			:content="confirmContent" 
			:showCancelButton="true" 
			@confirm="handleConfirm" @cancel="confirmShow = false"></u-modal>
		
		<u-overlay :show="submitMaskShow">
			<view class="w-overlay">正在提交，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import multipleSelect from "../momo-multipleSelect/momo-multipleSelect";
	import uniCopy from '@/components/xb-copy/uni-copy.js'
	import { details, auditConsent, auditReject, cancel, resubmit, immediateSubmit, reqLines } from '../api/approval.js';
	
	export default{
		components:{ multipleSelect },
		data(){
			return{
				formInfo:{visitorQrCode:'123456',visitorCardNum:'visitorCardNum',visitors:[],visitorsArr:[],staticPrefix:''},
				visitorNo:'1234561',
				stateIcon:"",
				stateColor:"",
				visitorState:"",
				popupFormShow:false,
				form:{},
				submitMaskShow:false,
				confirmShow:false,
				confirmContent:"",
				btnType:"",
				sourcePage:"",
				isNoticTarget:false,
				isAuthBtn:true,
				visitorLineIdShow:false,
				visitorLineDic:[]
			}
		},
		onLoad(option) {
			this.visitorNo = option.visitorNo;
			this.isNoticTarget = option.type ? true : false;
			this.sourcePage = option.sourcePage ? option.sourcePage : option.type === 'targetVisitor' ? 'targetInvite' : 'appointment';
			this.initData();
		},
		methods:{
			handleView(){
				if(this.formInfo.visitorsArr.length === 0) return;
				let flag = this.vuex_useInfo.bindEmpType != 2 && this.sourcePage === 'appointment' && (this.visitorState == '3' || this.visitorState == '5' || this.visitorState == '6') && this.formInfo.receiptsType == 1;
				this.$u.route('/pageFk/visitorEmpInfoDetails/visitorEmpInfoDetails',{visitorNo:this.visitorNo,isShowQrcode:flag ? 1 : 0})
			},
			handleConfirm(){
				this.confirmShow = false;
				if(this.btnType === 'cancel'){
					let params = {};
					params['visitorNo'] = this.visitorNo;
					params['targetEmpPhone'] = this.formInfo.targetEmpPhone;
					this.submitMaskShow = true;
					cancel(params).then(res => {
					  this.submitMaskShow = false;
					  this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
					  setTimeout(() => {
					    this.backClick()
					  },2000)
					  this.initData();
					}).catch(err => {
						this.submitMaskShow = false;
						this.$refs.uToast.show({ message: err, type: 'error' });
					});
				}
			},
			targetInviteBtnClick(type){
				if(type === 'left'){
					this.cancelClick()
				}else{
					if(this.visitorState == 8){
						// 直接提交邀约
						this.receiptSubmit()
					}else{
						// 审核同意
						this.btnType = "targetInviteAgree";
						this.popupFormShow = true;
					}
				}
			},
			visitorBtnClick(type){
				if(type === 'left'){
					this.cancelClick()
				}else{
					if(this.visitorState == 8){
						// 立即提交访客单
						this.receiptSubmit()
					}else{
						// 访客重新提交页面
						let params = {};
						params['visitorNo'] = this.visitorNo;
						this.submitMaskShow = true;
						resubmit(params).then(res => {
						  this.submitMaskShow = false;
						  this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
						  setTimeout(() => {
						    this.backClick()
						  },2000)
						  this.initData();
						}).catch(err => {
							this.submitMaskShow = false;
							this.$refs.uToast.show({ message: err, type: 'error' });
						});
					}
				}
			},
			receiptSubmit(){
				this.submitMaskShow = true;
				immediateSubmit({visitorNo:this.visitorNo}).then(r => {
					this.submitMaskShow = false;
					this.$refs.uToast.show({ message: r.data.msg, type: 'success' });
					setTimeout(() => {
						this.backClick()
					},2000)
				}).catch(err => {
					this.submitMaskShow = false;
					this.$refs.uToast.show({ message: err, type: 'error' });
				})
			},
			// 访客取消预约/被访人取消邀约
			cancelClick(){
				this.btnType = "cancel";
				this.confirmContent = `确定要取消${this.formInfo.receiptsType == 1 ? '预约' : '邀约'}？`;
				this.confirmShow = true;
			},
			targetBtnClick(type){
				this.btnType = type === 'left' ? "targetCancel" : "targetAgree";
				this.popupFormShow = true;
			},
			// 表单提交
			formSubmit(){
				if(!this.form.rejectCause && this.btnType === 'targetCancel') return this.$refs.uToast.show({ message: "请输入拒绝原因", type: 'warning' });
				if(!this.form.visitorLineIds && ['targetInviteAgree','targetAgree','reExamination'].includes(this.btnType)){
					return this.$refs.uToast.show({ message: "请选择访问线路", type: 'warning' });
				}
				let params = {};
				params['visitorNo'] = this.visitorNo;
				params['targetEmpPhone'] = this.formInfo.targetEmpPhone;
				this.submitMaskShow = true;
				if(this.btnType === 'targetCancel'){
					params['rejectCause'] = this.form.rejectCause;
					auditReject(params).then(res => {
					  this.submitMaskShow = false;
					  this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
					  setTimeout(() => {
					    this.backClick()
					  },2000)
					  this.initData();
					  this.popupFormShow = false;
					}).catch(err => {
						this.submitMaskShow = false;
						this.$refs.uToast.show({ message: err, type: 'error' });
					});
					return;
				}
				// 被访人同意事件
				if(['targetInviteAgree','targetAgree','reExamination'].includes(this.btnType)){
					params['visitorLineIds'] = this.form.visitorLineIds;
					auditConsent(params).then(res => {
					  this.submitMaskShow = false;
					  this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
					  setTimeout(() => {
					    this.backClick()
					  },2000)
					  this.initData();
						this.popupFormShow = false;
					}).catch(err => {
						this.submitMaskShow = false;
						this.$refs.uToast.show({ message: err, type: 'error' });
					});
				}
			},
			// 被访人重新审核
			reExaminationClick(){
				this.btnType = "reExamination";
				this.popupFormShow = true;
			},
			visitorLineConfirm(e){
				this.form.visitorLine = e.map(v => v.label).join(',');
				this.form.visitorLineIds = e.map(v => v.value).join(',');
			},
			initData(){
				details({ visitorNo: this.visitorNo }).then(r => {
					if(r.data.code === 200){
						let d = r.data.data;
						this.isAuthBtn = d.VISITOR_IS_SHOW_AUDIT_BTN == 0 ? false : true;
						d.visitorPersonCount = d.receiptsType == 1 ? d.visitorPersonCount*1 +1 : d.visitorPersonCount;
						let visitorsArr = d.visitors.filter(v => v.visitorCertificateCode);
						d.visitors = visitorsArr;
						d.visitorsArr = visitorsArr.length > 7 ? visitorsArr.slice(0,7) : visitorsArr;
						d.levalTime = this.vuex_cfg.dateType === 'datetime' ? d.levalTime.substr(0,16) : d.levalTime.substr(0,10);
						d.visitorTime = this.vuex_cfg.dateType === 'datetime' ? d.visitorTime.substr(0,16) : d.visitorTime.substr(0,10)
						this.formInfo = {...d};
						this.visitorState = d.visitorState;
						if (d.visitorState == 1) {
						  this.stateIcon = 'shenpi-daishenhe';
						  this.stateColor = '#FF9934';
						} else if (d.visitorState == 2) {
						  this.stateIcon = 'shenpi-yichexiao';
						  this.stateColor = '#BABABA';
						} else if (d.visitorState == 3) {
						  this.stateIcon = 'shenpi-yitongyi';
						  this.stateColor = '#00C431';
						} else if (d.visitorState == 4) {
						  this.stateIcon = 'shenpi-yijujue';
						  this.stateColor = '#FF1400';
						} else if (d.visitorState == 5) {
						  this.stateIcon = 'shenpi-yitongyi';
						  this.stateColor = '#00C431';
						} else if (d.visitorState == 6) {
						  this.stateIcon = 'shenpi-yitongyi';
						  this.stateColor = '#00C431';
						} else if (d.visitorState == 71 || d.visitorState == 72) {
						  this.stateIcon = 'shenpi-yichaoshi';
						  this.stateColor = '#FF4500';
						}else if(d.visitorState == 8){
							this.stateIcon = 'yaoqingzhong';
							this.stateColor = '#2DBD90';
						}
						reqLines({ visitorAreaId:d.visitorAreaId }).then(r => {
							if(r.data.code != 200) return;
							let arr = r.data.data.map(v => ({ value:v.id,label:v.lineName }));
							this.visitorLineDic = arr;
						})
					}
				})
			},
			phoneClick(phone){
				uni.makePhoneCall({ phoneNumber: phone });
			},
			imgClick(img){
				uni.previewImage({urls:[this.formInfo.staticPrefix+img]})
			},
			copyVisitorNo(){
				uniCopy({
					content:`${this.visitorNo}`,
					success:(res)=>{
						uni.showToast({ title: "复制成功",icon:'success', duration:3000 })
					},
					error:(e)=>{
						uni.showToast({ title: "复制失败",icon:'error' ,duration:3000 })
					}
				})
			},
			backClick(){
				// #ifdef H5
					if(this.isNoticTarget) return WeixinJSBridge.call('closeWindow');
				// #endif
				if(this.sourcePage === 'appointment'){
					return this.$u.route('/pageFk/appointmentrecord/appointmentrecord')
				}
				if(this.sourcePage === 'targetInvite'){
					return this.$u.route('/pageFk/inviteRecord/inviteRecord')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.receiptPage{
		.iconClass{
			position: absolute;
			top: 20rpx;right: 20rpx;
			z-index: 10;
		}
		/deep/.u-cell{ align-items: flex-start;}
		/deep/.u-cell__value {
		  color: #303333 !important;
		  font-size: 28rpx;
		}
		/deep/.u-cell__body{
			padding: 10rpx 16rpx !important;
		}
		/deep/.u-cell_title {
		  font-size: 28rpx;
			color: #909399;
		}
	}
</style>
