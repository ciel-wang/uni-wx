<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			
			<scroll-view scroll-y style="height: calc(100% - 67px);width: 100%;">
				<my-card margin="0 0 20rpx 0" padding="0">
					<u-cell-group>
						<view class="state">
							<u-icon :name="stateIcon" custom-prefix="custom-icon" size="140" :color="stateColor" />
						</view>
						
						<view style="padding: 32rpx 32rpx 12rpx;color: #606266;">
							单号:<text style="color: #909399;margin-left: 16rpx;">{{form.receiptNo}}</text>
						</view>
						
						<u-cell title="提交人:" :value="form.empName" :border="false"></u-cell>
						<u-cell title="所在部门:" :value="form.deptName" :border="false"></u-cell>
						<u-cell :title="typeRoleTitle" :value="form.typeRoleName" :border="false"></u-cell>
						
						<u-cell v-if="form.receiptType == 2" title="交通工具:" :value="form.receiptVehicle1" :border="false"></u-cell>
						<u-cell v-if="form.receiptType == 2" title="单程往返:" :value="form.isOneWay1" :border="false"></u-cell>
						<u-cell v-if="form.receiptType == 2" title="出发城市:" :value="form.fromCity" :border="false"></u-cell>
						<u-cell v-if="form.receiptType == 2" title="目的城市:" :value="form.toCity" :border="false"></u-cell>
						
						<u-cell v-if="form.receiptType != 4" title="开始时间:" :value="form.startTimes" :border="false"></u-cell>
						<u-cell v-if="form.receiptType != 4" title="结束时间:" :value="form.endTimee" :border="false"></u-cell>
						
						<u-cell v-if="form.receiptType == 4" title="补卡时间:" :border="false">
							<view slot="right-icon" style="flex: 1;color: #303133;">
								<view v-for="(v,i) in form.bkTimeSteps" :key="i" class="u-m-b-10">{{ v }}</view>
							</view>
						</u-cell>
						
						<view v-if="form.jbTimeSteps && form.jbTimeSteps.length>0 && form.receiptType == 3">
							<view class="u-border u-flex fw700 u-p-t-10 u-p-b-10 u-text-center">
								<view class="u-border-right u-width-50">加班时间</view>
								<view class="u-width-50">加班时长(小时)</view>
							</view>
							<view 
								class="u-border u-flex u-p-t-10 u-p-b-10 u-text-center" 
								v-for="(v, i) in form.jbTimeSteps" :key="i" 
								style="border-top: none;">
								<view class="u-border-right u-width-50">{{ v.dayDate && v.dayDate.substr(0,10) }}</view>
								<view class="u-width-50 u-p-l-10 u-p-r-10">{{ v.minute && v.minute/60 }}</view>
							</view>
						</view>
						
						<u-cell v-if="form.receiptType != 4" title="总时长(小时):" :value="form.duration" :border="false"></u-cell>
						
						<u-cell :title="receiptCauseTitle" :value="form.receiptCause" :border="false"></u-cell>
						<view class="u-p-r-32 u-p-l-32 u-p-t-12 u-p-b-12 u-flex u-width-100" v-if="form.receiptImgs.length">
							<u-image 
								v-for="(v,i) in form.receiptImgs" :key="i"
								:src="form.staticPrefix + v" 
								width="210rpx" height="210rpx" 
								customStyle="margin-right:10rpx;"
								@click="viewImg(form.staticPrefix+v)"></u-image>
						</view>
					  <u-cell 
							v-if="form.receiptType == 1 && form.empType == 1" 
							title="是否离校" 
							:value="form.isLeave ? '是' : '否'" 
							:border="false"></u-cell>
					  <u-cell 
							v-if="form.receiptType == 1 && form.empType == 1" 
							title="外出去向" 
							:value="form.leaveCause" 
							:border="false"></u-cell>
					</u-cell-group>
				</my-card>
				
				<my-card title="同行人" showHead headBorderBottom border-radius="0" margin="0 0 20rpx 0" v-if="form.receiptTogether.length">
					<view @click="togetherShow = true" class="u-m-b-30">{{togetherName}}</view>
				</my-card>
				
				<my-card title="审批流程" border-radius="0" margin="0" padding="30rpx 30rpx 0">
					<my-time-axis nodeTop="-8">
						<template v-slot:node>
							<view class="u-rela">
								<u-avatar
									shape="square" size="80" 
									:text="form.empName && form.empName.substr(form.empName.length-2)" 
									:fontSize="32" bg-color="#007cff"></u-avatar>
								<view class="custom-icon custom-icon-shenhetongguo minIcon" style="color: #52C41A;"></view>
							</view>
						</template>
						<template v-slot:content>
							<view class="u-flex u-row-between u-col-top u-p-b-30">
								<view>
									<view>发起申请</view>
									<view v-if="form.initiatorEmpName">由{{form.initiatorEmpName}}代{{form.empName}}提交</view>
									<view v-else>{{form.empName}}</view>
								</view>
								<view>{{form.createTime.substr(5,11)}}</view>
							</view>
						</template>
					</my-time-axis>
					
					<my-time-axis nodeTop="-8" v-for="(v,i) in form.auditEmps" :key="i">
						<template v-slot:node>
							<view class="u-rela" v-if="v.empName">
								<u-avatar
									shape="square" size="80" 
									:text="v.empName && v.empName.substr(v.empName.length-2)" 
									:fontSize="32" bg-color="#007cff"></u-avatar>
								<view 
									class="custom-icon custom-icon-shenhezhong minIcon" style="color: #FF9F40;" 
									v-if="v.auditStatus == 1 || v.auditStatus == 2"></view>
								<view class="custom-icon custom-icon-shenhetongguo minIcon" style="color: #52C41A;" v-if="v.auditStatus == 3"></view>
								<view class="custom-icon custom-icon-shenhebutongguo minIcon" style="color: #FF5736;" v-if="v.auditStatus == 4"></view>
							</view>
						</template>
						<template v-slot:content>
								<view class="u-flex u-row-between u-col-top">
									<view>
										<view>审核人</view>
										<view>{{v.empName}}
											<text v-if="v.auditStatus == 1 || v.auditStatus == 2">(审批中)</text>
											<text v-if="v.auditStatus == 3">(已同意)</text>
											<text v-if="v.auditStatus == 4">(已拒绝)</text>
										</view>
									</view>
									<view v-if="v.auditStatus == 3 || v.auditStatus == 4">{{v.auditTime.substr(5,11)}}</view>
								</view>
								<view 
									v-if="v.auditStatus == 3 || v.auditStatus == 4" 
									class="u-m-t-10" style="background-color: #f5f6f8;padding: 8rpx;">{{v.auditCause}}</view>
								<view class="u-p-16"></view>
						</template>
					</my-time-axis>
					
					<my-time-axis nodeTop="-8" v-if="leave > 0 && who == 'you' && (receiptStatus == 2 || receiptStatus ==1)">
						<template v-slot:node>
							<view class="u-rela" v-if="nextAuditEmpId">
								<u-avatar
									shape="square" size="80" 
									:text="nextAuditEmpName && nextAuditEmpName.substr(nextAuditEmpName.length-2)" 
									:fontSize="32" bg-color="#007cff"></u-avatar>
								<view class="custom-icon custom-icon-shenhezhong minIcon" style="color: #FF9F40;"></view>
							</view>
							<view class="u-rela" v-else>
								<u-avatar shape="square" size="80" text="审批人" :fontSize="32" bg-color="#007cff"></u-avatar>
								<view class="custom-icon custom-icon-shenhezhong minIcon" style="color: #FF9F40;"></view>
							</view>
						</template>
						<template v-slot:content>
							<view class="u-flex u-col-top u-p-b-30">
								<view class="u-m-r-20" v-if="nextAuditEmpId">
									<view>审核人</view>
									<view>{{nextAuditEmpName}}</view>
								</view>
								<view>
									<view>请选择审批人</view>
									<view class="custom-icon custom-icon-tianjia" style="font-size: 76rpx;" @click="nextAuditEmpClick"></view>
								</view>
							</view>
						</template>
					</my-time-axis>
					
					<my-time-axis nodeTop="-8" :isShowLine="false">
						<template v-slot:node>
							<u-avatar shape="square" size="80" :fontSize="46" icon="custom-icon-chaosong" bg-color="#007cff"></u-avatar>
						</template>
						<template v-slot:content>
							<view>
								<view>抄送人</view>
								<view>抄送{{form.duplicateEmps.length}}人</view>
								<view class="u-flex u-m-t-10 u-flex-wrap">
									<view 
										v-for="(v,i) in form.duplicateEmps" :key="i" 
										class="u-m-r-10 u-text-center u-m-b-8 u-flex-col u-col-center" 
										style="width: 100rpx;">
										<u-avatar 
											shape="square" size="80" 
											:text="v.empName && v.empName.substr(v.empName.length-2)" 
											:fontSize="32" bg-color="#007cff"></u-avatar>
										<view class="u-line-1">{{v.empName}}</view>
									</view>
								</view>
							</view>
						</template>
					</my-time-axis>
				</my-card>
			</scroll-view>
		</movable-area>
		
		<view v-if="who == 'me' && (receiptStatus != 4  && receiptStatus != 5 && receiptStatus != 7)">
			<my-button stype="even" @click="cancelEditClick">
				<template slot="left">撤销</template>
				修改
			</my-button>
		</view>
		<view v-if="who == 'you' && (receiptStatus == 2 || receiptStatus == 1)">
			<my-button stype="even" @click="rejectAgreeClick">
				<template slot="left">拒绝</template>
				同意
			</my-button>
		</view>
		
		<u-popup v-model="formShow" mode="bottom">
			<u-form :model="form2" ref="uForm" label-width="140" class="u-p-t-60 u-p-l-30" style="margin-bottom: 200rpx;">
				<u-form-item label="拒绝原因" prop="auditCause" v-if="btnType === 'reject'">
					<u-input v-model="form2.auditCause" placeholder="请填写拒绝原因" />
				</u-form-item>
				
				<u-form-item label="审批意见" prop="auditCause" v-if="btnType === 'agree'">
					<u--textarea
						v-model="form2.auditCause" 
						placeholder="请填写审批意见" 
						count border="none" maxlength="200" autoHeight></u--textarea>
				</u-form-item>
			</u-form>
			<u-button type="primary" @click="submit">确定</u-button>
		</u-popup>
		
		<u-popup :show="togetherShow" mode="bottom" height="600rpx" :closeable="true" @close="togetherShow = false">
			<view class="u-text-center u-p-20 u-font-30 bgfff fw700" style="position: fixed;z-index: 2;">同行人</view>
			<view class="u-p-t-82" style="max-height: 500rpx;">
				<view v-for="(v,i) in form.receiptTogether" :key="i" class="u-flex u-p-10 u-p-l-30">
					<u-avatar
						shape="square" size="80" 
						:text="v.empName && v.empName.substr(v.empName.length-2)" 
						:fontSize="32" bg-color="#007cff"></u-avatar>
					<view>{{v.empName}}</view>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { transDate } from '@/utils/my_function.js'
	import {receiptDetails,receiptCancel,receiptReject,receiptAgree} from "../kq.js"
	export default {
		data() {
			return {
				form:{duplicateEmps:[],empName:"",auditEmps:[],createTime:"",receiptImgs:[],receiptTogether:[]},
				receiptStatus:"",
				stateIcon:"",
				stateColor:"",
				typeRoleTitle:"",
				receiptCauseTitle:"",
				who:"",
				receiptId:"",
				leave:1,
				nextAuditEmpId:"",
				nextAuditEmpName:"",
				auditStatus:"",
				togetherName:"",
				togetherShow:false,
				
				form2:{},
				formShow:false,
				btnType:""
			}
		},
		onLoad(options) {
			this.who = options.who;
			this.id = options.id;
			if(options.form){
				let arr = JSON.parse(options.form)
				this.nextAuditEmpId = arr[0].auditEmpId;
				this.nextAuditEmpName = arr[0].empName;
			}
		},
		onShow() {
			this.initData();
		},
		methods: {
			cancelEditClick(type){
				if(type === 'left'){
					receiptCancel({id:this.receiptId}).then(r => {
						this.$refs.uToast.show({ message: r.data.msg, type: 'success', })
						setTimeout(()=>{
							uni.redirectTo({ url:'../oabills/oabills?who=me' })
						},1500)
					}).catch(err => {
						this.$refs.uToast.show({ message: err, type: 'error' })
					})
					return;
				}
				let form = {...this.form};
				form.duplicateEmpList = form.duplicateEmps;
				form.duplicateEmpIds = form.duplicateEmps.map(v => v.id).join(",");
				
				if(form.auditEmps.length){
					form.auditEmpIds = form.auditEmps[0].id;
					form.auditEmpName = form.auditEmps[0].empName;
				}
				
				form.receiptImgs = form.receiptImgs && form.receiptImgs.map(v => form.staticPrefix + v).join(",")
				
				let jbsteps = form.jbTimeSteps ? form.jbTimeSteps : [];
				form.jbTimeSteps = jbsteps.map(v => ({ dayDate:v.dayDate ? v.dayDate.substr(0,10) : '',minute:Number((v.minute/60).toFixed(2)) }));
				
				form.endTimeMax = form.startTime ? this.$u.timeFormat((new Date(transDate(form.startTime)).getTime())+7*24*60*60*1000, 'yyyy-mm-dd') : 0;
				form.startTime = form.startTimes
				form.endTime = form.endTimee;
				form.isLeave = form.isLeave ? 1 : 0;
				uni.setStorageSync("receiptsForm_key", form);
				uni.navigateTo({ url:`../leave/leave?type=${form.receiptType}&sourceType=edit` })
			},
			rejectAgreeClick(type){
				this.btnType = type === 'left' ? 'reject' : 'agree';
				this.formShow = true;
			},
			viewImg(img){
				uni.previewImage({ urls:[img] })
			},
			initData(){
				receiptDetails({id:this.id}).then(r => {
					if(r.data.code == 200){
						let d = r.data.data;
            d.deptName = d.deptName ? d.deptName : (d.gradeName + d.className)
						this.receiptId = d.id;
						if(d.auditEmps.length){
							let arr = d.auditEmps
							arr.forEach(v => {
								if(d.currEmpId == v.id){
									this.auditStatus = v.auditStatus;
									return;
								}
							})
						}
						if(d.receiptTogether && d.receiptTogether.length>0){
							let arr = []
							d.receiptTogether.forEach(v => {
								arr.push(v.empName)
							})
							if(arr.length > 3){
								this.togetherName = arr.slice(0,3).join(",") + `等${arr.length}人`
							}else{
								this.togetherName = arr.join(",")
							}
						}
						this.leave = d.leave - d.auditEmps.length;
						if(d.receiptVehicle == 1){
							d.receiptVehicle1 = "飞机"
						}
						if(d.receiptVehicle == 2){
							d.receiptVehicle1 = "火车"
						}
						if(d.receiptVehicle == 3){
							d.receiptVehicle1 = "汽车"
						}
						if(d.receiptVehicle == 4){
							d.receiptVehicle1 = "其他"
						}
						if(d.isOneWay){
							d.isOneWay1 = "单程"
						}else{
							d.isOneWay1 = "往返"
						}
						if(d.receiptType == 3){
							d.startTimes = d.startTime.substr(0,10)
							d.startTime = d.startTime.substr(0,10)
							if(d.endTime){
								d.endTimee = d.endTime.substr(0,10)
								d.endTime = d.endTime.substr(0,10)
							}
						}else{
							if(d.startTime){
								d.startTimes = d.startTime.substr(0,16)
							}
							if(d.endTime){
								d.endTimee = d.endTime.substr(0,16)
							}
						}
						if(d.receiptType == 4 && d.bkTimeSteps){
							let arr = [];
							d.bkTimeSteps.forEach(v => {
								arr.push(v.substr(0,16))
							})
							d.bkTimeSteps = arr;
						}
						if(d.receiptImgs && d.receiptImgs.length>5){
							d.receiptImgs = d.receiptImgs.split(",")
						}else{
							d.receiptImgs = [];
						}
						d.duration = (d.duration/60).toFixed(1);
						if(d.receiptStatus == 2){
							this.stateIcon = "shenpi-shenpizhong";
							this.stateColor = "#ff9227";
						}
						if(d.receiptStatus == 3){
							this.stateIcon = "shenpi-yitongyi";
							this.stateColor = "#00C431";
						}
						if(d.receiptStatus == 4){
							this.stateIcon = "shenpi-yijujue";
							this.stateColor = "#d81e06";
						}
						if(d.receiptStatus == 5){
							this.stateIcon = "shenpi-yichexiao";
							this.stateColor = "#cdcdcd";
						}
            if(d.receiptStatus == 7){
            	this.stateIcon = "yizuofei";
            	this.stateColor = "#cdcdcd";
            }
						
						this.receiptStatus = d.receiptStatus;
						if(d.receiptType == 1){
							this.typeRoleTitle = "请假类型:"
							this.receiptCauseTitle = "请假事由:"
						}
						if(d.receiptType == 2){
							this.typeRoleTitle = "出差类型:"
							this.receiptCauseTitle = "出差事由:"
						}
						if(d.receiptType == 3){
							this.typeRoleTitle = "加班类型:"
							this.receiptCauseTitle = "加班事由:"
						}
						if(d.receiptType == 4){
							this.typeRoleTitle = "补卡类型:"
							this.receiptCauseTitle = "补卡事由:"
						}
						this.form = r.data.data
					}
				})
			},
			submit(){
				let { auditCause } = this.form2;
				if(this.btnType === 'reject'){
					if(!auditCause) return this.$refs.uToast.show({ message: "请填写拒绝原因", type: 'error' });
					receiptReject({ receiptId:this.receiptId, auditCause }).then(r => {
						this.$refs.uToast.show({ message: r.data.msg, type: 'success' })
						setTimeout(()=>{
							uni.redirectTo({ url:'../oabills/oabills?who=you' })
						},1500)
						this.formShow = false;
					}).catch(err => {
						this.$refs.uToast.show({ message: r.data.msg, type: 'error' })
					})
					return;
				}
				if(!auditCause) return this.$refs.uToast.show({ message: "请填写审批意见", type: 'error' });
				if(this.leave >0 && !this.nextAuditEmpId){
					this.$refs.uToast.show({ message: "请选择审批人", type: 'error' })
					return;
				}
				receiptAgree({ auditCause, receiptId:this.receiptId, nextAuditEmpId:this.nextAuditEmpId }).then(r => {
					this.$refs.uToast.show({ message: r.data.msg, type: 'success' })
					this.formShow = false;
					setTimeout(()=>{
						uni.redirectTo({ url:'../oabills/oabills?who=you' })
					},2000)
				}).catch(err => {
					this.$refs.uToast.show({ message: err, type: 'error' })
				})
			},
			nextAuditEmpClick(){
				let form = {}
				form.empId = this.form.empId;
				form.typeRoleId = this.form.typeRoleId;
				form.who = this.who;
				form.id = this.id;
				uni.navigateTo({ url:`../selectedEmp/selectedEmp?come=details&form=${JSON.stringify(form)}` })
			},
			backClick(){
				uni.navigateTo({ url:`../oabills/oabills?who=${this.who}` })
			}
		},
	}
</script>

<style scoped>
	>>>.u-cell{
		align-items: baseline;
	}
	>>>.u-cell__body{
		padding: 10rpx 30rpx !important;
		align-items: flex-start !important;
	}
	>>>.u-cell_title{
		min-width: 120rpx !important;
		max-width: 180rpx !important;
	}
	>>>.u-cell__value{
		text-align: left;
		margin-left: 20rpx;
		flex: inherit !important;
	}
	.minIcon{
		position: absolute;
		top: 15px;
		right: -4px;
		z-index: 10;
	}
	.state{
		position: absolute;
		right: 0;
		top: 0;
		z-index: 99;
	}
</style>
