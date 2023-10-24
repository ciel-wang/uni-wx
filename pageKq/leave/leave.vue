<template>
  <view>
    <movable-area style="width: 100%;height: 100%;">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      <scroll-view scroll-y style="height: calc(100% - 67px);width: 100%;">
        <u-form :model="form" ref="uForm" :border-bottom="false" label-width="160">
          <my-card :showHead="false" :showFoot="false" margin="0 20rpx">
            <u-form-item label="提交人" prop="empId" required>
							<view class="u-flex">
								<u-input v-model="form.empName" disabled disabledColor="#ffffff" placeholder="请填写" input-align="right" />
								<u-button 
									customStyle="width:150rpx;margin-left:10rpx" size="mini" type="primary" plain
									v-if="vuex_useInfo.bindEmpType == 2" 
									@click="getEmp({ come: 'empId' })">代他人提交</u-button>
							</view>
            </u-form-item>
            
            <u-form-item :label="vuex_useInfo.bindEmpType != 2 || empType == 'GRADE' ? '年/班级' : '所在部门'" prop="deptName">
              <u-input v-model="form.deptName" disabled disabledColor="#ffffff" placeholder="自动填写" input-align="right" />
            </u-form-item>
            
            <u-form-item :label="receiptTypeArr[receiptType-1]+'类型'" prop="typeRoleName" required @click="typeRoleShow = true;">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.typeRoleName" disabled disabledColor="#ffffff" placeholder="请选择" input-align="right" />
            </u-form-item>
						
            <u-form-item label="交通工具" prop="receiptVehicle" v-if="receiptType == 2">
              <view class="u-flex u-width-100" style="justify-content: flex-end;">
								<view class="u-m-r-4">
									<u-tag text="飞机" size="mini" name="1" :type="vehicleType == 1 ? 'primary' : 'info'" @click="vehicleChange" />
								</view>
								<view class="u-m-r-4">
									<u-tag text="火车" size="mini" name="2" :type="vehicleType == 2 ? 'primary' : 'info'" @click="vehicleChange" />
								</view>
								<view class="u-m-r-4">
									<u-tag text="汽车" size="mini" name="3" :type="vehicleType == 3 ? 'primary' : 'info'" @click="vehicleChange" />
								</view>
                <u-tag text="其他" size="mini" name="4" :type="vehicleType == 4 ? 'primary' : 'info'" @click="vehicleChange" />
              </view>
            </u-form-item>
            
            <u-form-item label="单程往返" prop="isOneWay" v-if="receiptType == 2">
              <view class="u-flex u-width-100" style="justify-content: flex-end;">
								<view class="u-m-r-4">
									<u-tag text="单程" size="mini" name="1" class="u-m-r-10" :type="isOneWayType == 1 ? 'primary' : 'info'" @click="isOneWayChange" />
								</view>
                <u-tag text="往返" size="mini" name="0" :type="isOneWayType == 0 ? 'primary' : 'info'" @click="isOneWayChange" />
              </view>
            </u-form-item>
            
            <u-form-item label="出发城市" prop="fromCity" v-if="receiptType == 2" @click="cityShow = true;btnType = 'from'">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.fromCity" disabled disabledColor="#ffffff" placeholder="请填写" input-align="right" />
            </u-form-item>
            
            <u-form-item label="目的城市" prop="toCity" v-if="receiptType == 2" @click="cityShow = true;btnType = 'toCity'">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.toCity" disabled disabledColor="#ffffff" placeholder="请填写" input-align="right" />
            </u-form-item>
            
            <u-form-item 
							v-if="receiptType != 4" 
							label="开始时间" required
							:prop="receiptType != 4 ? 'startTime' : ''" 
							@click="startTimeShow = true;">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.startTime" placeholder="请填写" disabled disabledColor="#ffffff" input-align="right" />
            </u-form-item>
            
            <!-- 补卡时间 -->
            <u-form-item v-if="receiptType == 4" prop="bkTimeSteps" label="补卡时间" required>
              <view class="u-flex-col u-width-100">
                <view v-model="form.bkTimeSteps" v-if="Array.isArray(bkTimeSteps) && bkTimeSteps.length > 0">
                  <view v-for="(item, index) in bkTimeSteps" :key="index" class="u-flex u-row-right u-m-b-14">
                    <text class="u-border-bottom fw700" style="color: #121212;padding:12rpx;">{{ item }}</text>
                    <u-icon size="50" color="#c0c4cc" name="minus-circle" @click="deleteClick(index)"></u-icon>
                  </view>
                </view>
                <view 
                  class="u-flex u-row-right u-width-100" 
                  v-if="Array.isArray(bkTimeSteps) && bkTimeSteps.length <= cardCountMax - 1" 
                  @click="startTimeShow = true;">
                  <text style="color: #c0c4cc;margin-right: 12rpx;">添加补卡时间</text>
                  <u-icon size="50" color="#c0c4cc" name="plus-circle"></u-icon>
                </view>
              </view>
            </u-form-item>
						
            <u-form-item 
							v-if="receiptType != 4" 
							label="结束时间" required
							:prop="receiptType != 4 ? 'endTime' : ''" 
							@click="endTimeClick">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.endTime" placeholder="请填写" input-align="right" disabled disabledColor="#ffffff" />
            </u-form-item>
            
            <u-form-item v-if="Array.isArray(jbTimeTabel) && jbTimeTabel.length > 0 && receiptType == 3" prop="jbTimeSteps" :borderBottom="false">
              <view class="u-width-96">
                <view class="u-m-b-10">为了方便统计，请填写每日加班时长</view>
								<view>
									<view class="u-border u-flex fw700 u-p-t-10 u-p-b-10 u-text-center">
										<view class="u-border-right u-width-50">加班日期</view>
										<view class="u-width-50">加班时长(小时)</view>
									</view>
									<view class="u-border u-flex u-p-t-10 u-p-b-10 u-text-center" v-for="(v, i) in jbTimeTabel" :key="i" style="border-top: none;">
										<view class="u-border-right u-width-50">{{ v.dayDate }}</view>
										<view class="u-width-50 u-p-l-10 u-p-r-10">
											<u-input v-model="v.minute" type="number" @blur="hourBlur" inputAlign="center" :maxlength="4" />
										</view>
									</view>
								</view>
              </view>
            </u-form-item>
            
            <u-form-item label="总时长(小时)" labelWidth="200" prop="duration" v-if="receiptType != 4">
              <u-input v-model="form.duration" placeholder="自动计算" disabled disabledColor="#ffffff" input-align="right" />
            </u-form-item>
						
            <u-form-item :label="receiptTypeArr[receiptType-1]+'事由'" prop="receiptCause" required>
							<u--textarea
								v-model="form.receiptCause" 
								placeholder="请填写" 
								count border="none" :maxlength="100" autoHeight
								@blur="receiptCauseBlur"></u--textarea>
            </u-form-item>
						
            <u-form-item label=" " labelWidth="0" prop="receiptImgs" :border-bottom="false">
              <view>
                <my-upload
                  ref="uUpload"
                  :action="imgAction"
                  max-count="3"
                  width="188rpx" height="188rpx"
                  name="file"
                  :multiple="true"
                  :file-list="fileList"
                  :header="{ token: vuex_urlobj.token,sid:vuex_urlobj.sid }"
                  @on-success="fileUpload"
                  @on-error="fileError"
                  :show-progress="showProgress"
                  :before-upload="beforeUpload"
                  :beforeRemove="beforeRemove"
                ></my-upload>
              </view>
            </u-form-item>
            <view class="u-font-20">支持上传JPG、JPEG、PNG格式的图片，单张图片大小不能超过5M</view>
          </my-card>
          
          <my-card 
						:showHead="false" :showFoot="false" margin="20rpx 20rpx 0"
						v-if="vuex_useInfo.bindEmpType != 2 || (vuex_useInfo.bindEmpType == 2 && form.empType == 1)">
            <u-form-item label="是否离校">
							<u-radio-group v-model="form.isLeave" size="38" iconSize="30" @change="isLeaveChange">
								<u-radio v-for="(item, index) in radioArr" :key="index" :name="item.value" customStyle="margin-right:30rpx;">
								  {{ item.label }}
								</u-radio>
							</u-radio-group>
            </u-form-item>
            <u-form-item label="外出去向" prop="leaveCause" required v-if="form.isLeave == 1">
              <u-input v-model.trim="form.leaveCause" placeholder="请输入外出去向" input-align="right" @blur="leaveCauseBlur" />
            </u-form-item>
          </my-card>

          <my-card v-if="receiptType == 2" :show-head="false" :showFoot="false" margin="20rpx 20rpx 0">
            <u-form-item label="同行人" @click="getEmp({ come: 'together' })">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.togetherEmps" disabled disabledColor="#ffffff" placeholder="请选择同行人" input-align="right" />
            </u-form-item>
          </my-card>

          <my-card :head-border-bottom="true" :foot-border-top="false" title="审批流程">
						<my-time-axis>
							<template v-slot:content>
							  <view class="u-flex u-row-between u-col-top">
							    <view class="u-order-title">发起人</view>
							    <view class="u-text-right u-flex-col u-col-bottom">
										<u-avatar
											v-if="form.empName"
											shape="square" size="80" 
											:text="form.empName && form.empName.substr(form.empName.length-2)" 
											:fontSize="32" bg-color="#007cff"></u-avatar>
							      <view v-if="curEmpInfo.empId == form.empId">{{ curEmpInfo.empName }}提交</view>
							      <view v-else>{{ curEmpInfo.empName }}代{{ form['empName'] }}提交</view>
							    </view>
							  </view>
							</template>
						</my-time-axis>
						<my-time-axis>
						  <template v-slot:content>
						    <view class="u-flex u-row-between u-col-top">
						      <view class="u-order-title">审批人</view>
						      <view class="u-flex u-col-top">
						        <view class="u-text-center u-m-r-10 u-flex-col u-col-center" style="width: 100rpx;" v-if="form.auditEmpIds">
											<u-avatar
												shape="square" size="80" 
												:text="form.auditEmpName && form.auditEmpName.substr(form.auditEmpName.length-2)" 
												:fontSize="32" bg-color="#007cff"></u-avatar>
						          <view class="u-line-1">{{ form['auditEmpName'] }}</view>
						        </view>
						        <view 
											class="custom-icon custom-icon-tianjia" 
											style="font-size: 80rpx;" 
											@click="getEmp({ come: 'auditEmpIds' })"></view>
						      </view>
						    </view>
						  </template>
						</my-time-axis>
						<my-time-axis :isShowLine="false">
						  <template v-slot:content>
						    <view class="u-flex u-row-between u-col-top">
						      <view class="u-order-title">抄送人</view>
						      <view class="u-flex u-flex-wrap u-col-top" style="max-width: 70%;">
						        <view 
											class="u-text-center u-m-r-10 u-m-b-10" style="width: 100rpx;"
											v-if="Array.isArray(duplicateEmpList) && duplicateEmpList.length > 0" 
											v-for="(v, i) in duplicateEmpList" :key="i">
						          <view class="u-rela u-flex u-row-center">
												<u-avatar
													shape="square" size="80" 
													:text="v.empName && v.empName.substr(v.empName.length-2)" 
													:fontSize="32" bg-color="#007cff"></u-avatar>
						            <view class="del" @click="delClick(i)">
													<u-icon name="close" color="#fff"></u-icon>
												</view>
						          </view>
						          <view class="u-line-1">{{ v.empName }}</view> 
						        </view>
						        <view 
											class="custom-icon custom-icon-tianjia" 
											style="font-size: 80rpx;" 
											@click="getEmp({ come: 'duplicateEmpIds' })"></view>
						      </view>
						    </view>
						  </template>
						</my-time-axis>
          </my-card>
        </u-form>
      </scroll-view>
    </movable-area>
		
		<my-button @click="submit">提交</my-button>
		
		<u-action-sheet
			:show="typeRoleShow" 
			:actions="typeRoleList"
			@close="typeRoleShow = false"
			@select="typeRoleConfirm"></u-action-sheet>
		<u-datetime-picker
			:mode="receiptType == 3 ? 'date' : 'datetime'"
			:show="startTimeShow" v-model="startTimeValue"
			:maxDate="new Date('2050/05/31').getTime()"
			:minDate="0"
			@confirm="startTimeChange"
			@cancel="startTimeShow = false"
			@close="startTimeShow = false"
		></u-datetime-picker>
		<u-datetime-picker
			:mode="receiptType == 3 ? 'date' : 'datetime'"
			:show="endTimeShow" v-model="endTimeValue"
			:maxDate="receiptType == 3 ? form.endTimeMax : new Date('2050/05/31').getTime()"
			:minDate="form.endTimeMin"
			@confirm="endTimeChange"
			@cancel="endTimeShow = false"
			@close="endTimeShow = false"
		></u-datetime-picker>
		<w-picker
		  :visible.sync="cityShow"
		  mode="linkage"
		  :options="cityList"
		  :level="3"
		  default-type="value"
		  @confirm="cityConfirm"
		  ref="linkage" ></w-picker>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">{{ maskValue }}</view>
		</u-overlay>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import config from '@/config/index.js';
import { receiptTyperolelist, limitTime, getDuration, sendForm, updateForm } from '../kq.js';
import { transDate } from '@/utils/my_function.js'
import { city } from '@/utils/city.js'
import wPicker from "@/components/w-picker/w-picker.vue";

export default {
	components:{ wPicker },
  data() {
    return {
      receiptType: '',
      form: {
				empName:"",typeRoleName:"",startTime:"",endTime:"", receiptCause:"",
				receiptVehicle: '1', isOneWay: true, bkTimeSteps:[], isLeave:0, duration:'',
				endTimeMax:0
			},
      receiptsForm: {
				empName:"",typeRoleName:"",startTime:"",endTime:"",receiptCause:"",
				receiptVehicle: '1', isOneWay: true, bkTimeSteps: [],isLeave:0, duration:'' ,
				endTimeMax:0
			},
      rules: {
        empName: [{
					required: true,
					message: '请选择',
					trigger: ['change', 'blur']
				}],
        typeRoleName: [{
					required: true,
					message: '请选择',
					trigger: ['change', 'blur']
				}],
        bkTimeSteps: [{
					validator: (rule, value, callback) => {
						return this.$u.test.array(value) && value.length > 0;
					},
					message: '请选择',
					trigger: ['change', 'blur']
				}],
        receiptCause: [{
					required: true,
					message: '请填写',
					trigger: ['blur']
				}],
      },
      maskShow: false,
      maskValue: '',
      typeRoleShow: false,
      typeRoleList: [],
      startTimeShow: false,
			startTimeValue:Number(new Date()),
      endTimeShow: false,
			endTimeValue:Number(new Date()),
      imgAction: `${config.baseUrl}/iot-wx/kq/receipt/upload/imgs`,
      imgList: [],
      duplicateEmpList: [],
      receiptVehicleList: [
				{ label: '飞机', value: '1' }, 
				{ label: '火车', value: '2' }, 
				{ label: '汽车', value: '3' }, 
				{ label: '其他', value: '4' },
			],
      isOneWayList: [{ value: 1, label: '单程' }, { value: 0, label: '往返' }],
      isOneWayType: '1',
      vehicleType: '1',
      fileList: [],
      jbTimeTabel: [],
      sourceType: "",
      bkTimeSteps: [],
      cardCountMax: 1,
      radioArr:[{value:1,label:"是"},{value:0,label:'否'}],
      empType:"",
      showProgress:false,
			cityShow:false,
			cityList:city(),
			btnType:"",
			receiptTypeArr:['请假','出差','加班','补卡'],
			curEmpInfo:{}
    };
  },
  onLoad(v) {
    if (v.come == 'mykq') {
      this.mykq = 'mykq';
    }
    this.sourceType = v.sourceType;
    this.fileList = [];
    this.receiptType = v.type;
    let receiptsForms = uni.getStorageSync('receiptsForm_key');
		if(receiptsForms && v.type != receiptsForms.receiptType){
			receiptsForms = null;
			uni.removeStorageSync('receiptsForm_key');
		}
		this.bkTimeSteps = receiptsForms && receiptsForms.bkTimeSteps || [];
		this.jbTimeTabel = receiptsForms && receiptsForms.jbTimeSteps || [];
		this.duplicateEmpList = receiptsForms && receiptsForms.duplicateEmpList || [];
		let imgList = receiptsForms && receiptsForms.receiptImgs && receiptsForms.receiptImgs.split(',') || [];
		this.imgList = imgList;
		this.fileList = imgList.map(v => ({ url: v }));
		this.isOneWayType = receiptsForms && receiptsForms.isOneWay ? 1 : 0;
		this.vehicleType = receiptsForms && receiptsForms.receiptVehicle ? receiptsForms.receiptVehicle : 1;
		
		let { empName='', empId='', deptName='' } = this.vuex_useInfo;
		this.curEmpInfo = { empName, empId, deptName };
		if(receiptsForms){
			this.form = uni.$u.deepClone(receiptsForms);
			this.receiptsForm = uni.$u.deepClone(receiptsForms);
			if (Array.isArray(receiptsForms.receiptTogether) && receiptsForms.receiptTogether.length) {
			  let ids = [];
			  let emps = [];
			  receiptsForms.receiptTogether.forEach(i => {
			    ids.push(i.id);
			    emps.push(i.empName);
			  });
			  if (emps.length > 3) {
			    this.form.togetherEmps = emps.slice(0, 3).join(',') + `等${emps.length}人`;
			  } else {
			    this.form.togetherEmps = emps.join(',');
			  }
			  this.form['receiptTogethers'] = ids.join(',');
			}
			if (receiptsForms.typeRoleId && (!receiptsForms.limitMaxTime || !receiptsForms.limitMinTime || !receiptsForms.cardCountMax)) {
			  limitTime({ typeRoleId: receiptsForms.typeRoleId, type: 2 }).then(r => {
			    if (r.data.code == 200) {
			      let data = r.data.data;
			      this.cardCountMax = data.limitMaxCount;
			      if (this.receiptType == 4 && this.cardCountMax == 0) {
			        this.$refs.uToast.show({ message: '本月补卡次数已超额，不能再进行补卡', type: 'error' });
			        this.bkTimeSteps = [];
			      }
			      if (Array.isArray(data.limitDays) && data.limitDays.length > 0) {
			        this.form.limitMaxTime = data.limitDays[0].LEAVETIME_MAX_MINUTE;
			        this.form.limitMinTime = data.limitDays[1].LEAVETIME_MIN_MINUTE;
			      }
			    }
			  });
			}
		}
		if(!receiptsForms || receiptsForms && !receiptsForms.empId){
			this.form['empName'] = empName;
			this.form['empId'] = empId;
			this.form['deptName'] = deptName;
			this.receiptsForm['empName'] = empName;
			this.receiptsForm['empId'] = empId;
			this.receiptsForm['deptName'] = deptName;
			this.receiptsForm['receiptType'] = v.type;
			uni.setStorageSync('receiptsForm_key', this.receiptsForm);
		}
    receiptTyperolelist({ roleType: this.receiptType }).then(r => {
      if (r.data.code == 200) {
        let d = r.data.data;
        let arr = [];
        if (this.receiptType == 1) {
					arr = d.qj.map(v => ({ value: v.id, name: v.roleName }))
        }
        if (this.receiptType == 2) {
					arr = d.cc.map(v => ({ value: v.id, name: v.roleName }))
        }
        if (this.receiptType == 3) {
					arr = d.jb.map(v => ({ value: v.id, name: v.roleName }))
        }
        if (this.receiptType == 4) {
					arr = d.bk.map(v => ({ value: v.id, name: v.roleName }))
        }
        this.typeRoleList = arr;
      }
    });
  },
  onReady() {
		
    if(this.receiptType == 1){
      uni.setNavigationBarTitle({ title:'请假' })
    }else if(this.receiptType == 2){
      uni.setNavigationBarTitle({ title:'出差' })
    }else if(this.receiptType == 3){
      uni.setNavigationBarTitle({ title:'加班' })
    }else {
      uni.setNavigationBarTitle({ title:'补卡' })
    }
		if(this.receiptType != 4){
			this.rules = {
				...this.rules,
				startTime: [{
					required: true,
					message: '请选择',
					trigger: ['change', 'blur']
				}],
				endTime: [{
					required: true,
					message: '请选择',
					trigger: ['change', 'blur']
				}]
			}
		}
		this.$refs.uForm.setRules(this.rules);
  },
  watch:{
    'form.isLeave':{
      handler(val){
        let obj = {}
        if(val == 1){
          obj['leaveCause'] = [{
            required:true,
            message:"请填写外出去向",
            trigger: ['change', 'blur']
          }]
        }else{
          obj['leaveCause'] = []
        }
        this.rules = {...this.rules,...obj}
        this.$refs.uForm.setRules(this.rules);
      },
      deep:true
    }
  },
  methods: {
    submit() {
      this.$refs.uForm.validate().then(() => {
				if (!this.form.auditEmpIds) {
				  this.$refs.uToast.show({ message: '请先选择审批人', type: 'error' });
				  return;
				}
				this.form['receiptType'] = this.receiptType;
				this.form['receiptTogether'] = this.form['receiptTogethers'];
				let f = this.form;
				let max = f.limitMaxTime;
				let min = f.limitMinTime;
				if (this.receiptType == 1 && (f.workTime*1 > max || f.workTime*1 < min)) {
				  this.$refs.uToast.show({ message: `请假时长不在${min}-${max}范围内`, type: 'error' });
				  return;
				}
				let form = uni.$u.deepClone(this.form)
				if (this.receiptType == 1 || this.receiptType == 2) {
				  let startTime = form.startTime + ':00';
				  form.startTime = startTime;
				  if (form.endTime) {
				    form.endTime = form.endTime + ':59';
				  }
				}
				if (this.receiptType == 4) {
				  let jbArr = form.bkTimeSteps || [];
				  form.bkTimeSteps = jbArr.map(v => v + ':00');
				}
				this.maskShow = true;
				this.maskValue = '正在提交，请等待...';
				if (this.sourceType == 'edit') {
				  updateForm(form).then(r => {
				    this.maskShow = false;
				    this.$refs.uToast.show({ message: r.data.msg, type: 'success' });
				    setTimeout(() => {
				      this.backClick()
				    }, 2000);
				    uni.removeStorageSync('receiptsForm_key');
				  }).catch(err => {
				    this.maskShow = false;
				    this.$refs.uToast.show({ message: err, type: 'error' });
				  });
				} else {
				  sendForm(form).then(r => {
				    this.maskShow = false;
				    this.$refs.uToast.show({ message: r.data.msg, type: 'success' });
				    setTimeout(() => {
				      this.backClick()
				    }, 2000);
				    uni.removeStorageSync('receiptsForm_key');
				  }).catch(err => {
				    this.maskShow = false;
				    this.$refs.uToast.show({ message: err, type: 'error' });
				  });
				}
			});
    },
    typeRoleConfirm(v) {
      this.form['typeRoleName'] = v.name;
      this.form['typeRoleId'] = v.value;
      this.form.auditEmpIds = '';
      this.receiptsForm['auditEmpIds'] = '';
      this.receiptsForm['typeRoleName'] = v.name;
      this.receiptsForm['typeRoleId'] = v.value;
      limitTime({ typeRoleId: v.value, type: 2 }).then(r => {
        if (r.data.code == 200) {
          let d = r.data.data;
          this.cardCountMax = d.limitMaxCount;
          if (this.receiptType == 4 && this.cardCountMax == 0) {
            this.$refs.uToast.show({ message: '本月补卡次数已超额，不能再进行补卡', type: 'error' });
            this.bkTimeSteps = [];
            this.form.bkTimeSteps = [];
            this.receiptsForm.bkTimeSteps = [];
          }
          if (Array.isArray(d.limitDays) && d.limitDays.length > 0) {
            this.receiptsForm.limitMaxTime = d.limitDays[0].LEAVETIME_MAX_MINUTE;
            this.receiptsForm.limitMinTime = d.limitDays[1].LEAVETIME_MIN_MINUTE;
          }
					uni.setStorageSync('receiptsForm_key', this.receiptsForm);
        }
      });
    },
    startTimeChange(e) {
			if(this.receiptType == 4){
				let result = uni.$u.timeFormat(e.value,'yyyy-mm-dd hh:MM');
				this.bkTimeSteps.push(result);
				this.form.bkTimeSteps = this.bkTimeSteps;
				this.receiptsForm.bkTimeSteps = this.bkTimeSteps;
				uni.setStorageSync('receiptsForm_key', this.receiptsForm);
				this.startTimeShow = false;
				return;
			}
			this.form.endTimeMin = e.value;
			this.receiptsForm.endTimeMin = e.value;
			if(this.receiptType == 3){
				let result = uni.$u.timeFormat(e.value,'yyyy-mm-dd');
				this.form['startTime'] = result;
				this.receiptsForm['startTime'] = result;
				this.form['endTime'] = "";
				this.receiptsForm['endTime'] = "";
				this.jbTimeTabel = [];
				this.form['jbTimeSteps'] = [];
				this.receiptsForm['jbTimeSteps'] = [];
				this.form.endTimeMax = e.value + 7 * 24 * 60 * 60 * 1000;
				this.receiptsForm.endTimeMax = e.value + 7 * 24 * 60 * 60 * 1000;
			}else{
				let result = uni.$u.timeFormat(e.value,'yyyy-mm-dd hh:MM');
				this.form['startTime'] = result;
				this.receiptsForm['startTime'] = result;
				this.form['endTime'] = "";
				this.receiptsForm['endTime'] = "";
				this.form.workTime = '';
				this.form.duration = "";
				this.receiptsForm.workTime = '';
				this.receiptsForm.duration = '';
			}
			uni.setStorageSync('receiptsForm_key', this.receiptsForm);
			this.startTimeShow = false;
    },
    endTimeClick() {
      if (this.form.startTime) {
        this.endTimeShow = true;
      } else {
        this.$refs.uToast.show({ message: '请先选择开始时间', type: 'error' });
      }
    },
    endTimeChange(e) {
			if(this.receiptType == 3){
				let result = uni.$u.timeFormat(e.value,'yyyy-mm-dd');
				this.form['endTime'] = result;
				this.receiptsForm['endTime'] = result;
				if (this.form['startTime']) {
				  let startDate = this.form['startTime'];
				  let endDate = this.form['endTime'];
				  var sd = new Date(this.iosTransDate(startDate)).getTime(),
							ed = new Date(this.iosTransDate(endDate)).getTime(),
							timeDiff = ed - sd;
				  let arr = [];
				  for (var i = 0; i <= timeDiff; i += 86400000) {
				    var v = new Date(sd + i);
				    arr.push({
				      dayDate: uni.$u.timeFormat(v, 'yyyy-mm-dd'),
				      minute: 0
				    });
				  }
				  this.jbTimeTabel = arr;
				  this.form['jbTimeSteps'] = arr;
				  this.receiptsForm['jbTimeSteps'] = arr;
				}
				uni.setStorageSync('receiptsForm_key', this.receiptsForm);
				this.endTimeShow = false;
			}else{
				let result = uni.$u.timeFormat(e.value,'yyyy-mm-dd hh:MM');
				this.form['endTime'] = result;
				this.receiptsForm['endTime'] = result;
				uni.setStorageSync('receiptsForm_key', this.receiptsForm);
				this.endTimeShow = false;
				let params = {};
				params['empId'] = this.form.empId;
				params['startTime'] = this.form.startTime + ':00';
				params['endTime'] = this.form.endTime + ':59';
				getDuration(params).then(r => {
				  if (r.data.code == 200) {
				    let d = r.data.data
				    this.form.duration = (d.totalMinute/60).toFixed(1)
				    this.$set(this.form, 'duration', (d.totalMinute / 60).toFixed(1));
				    this.form.workTime = (d.totalMinute / 60).toFixed(1);
				    this.receiptsForm.workTime = (d.totalMinute / 60).toFixed(1);
				    this.receiptsForm.duration = (d.totalMinute / 60).toFixed(1);
				    uni.setStorageSync('receiptsForm_key', this.receiptsForm);
				  }
				}).catch(err => {
					this.$refs.uToast.show({ message: err, type: 'error' });
				});
			}
    },
    hourBlur(v) {
      this.form.jbTimeSteps = this.jbTimeTabel;
      this.receiptsForm.jbTimeSteps = this.jbTimeTabel;
      let arr = this.jbTimeTabel;
      let str = 0;
      arr.forEach(v => {
				v.minute = !v.minute || v.minute > 24 ? 0 : Math.round(v.minute * Math.pow(10, 1)) / Math.pow(10, 1);
				if(v.minute) str += v.minute * 1;
      });
      this.$set(this.form, 'duration', str);
      this.receiptsForm.duration = str;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    beforeUpload(index, list) {
      this.maskValue = '正在上传，请等待...';
      this.maskShow = true;
			this.showProgress = true;
      return true;
    },
    fileError(res, index, lists, name) {
      this.maskShow = false;
			this.showProgress = false;
    },
    fileUpload(data, index, lists, name) {
      this.maskShow = false;
      this.showProgress = false;
      if (data.code == 200) {
        this.imgList.push(data.data.absUrl);
        this.receiptsForm.receiptImgs = this.imgList.join(',');
        uni.setStorageSync('receiptsForm_key', this.receiptsForm);
        this.$refs.uToast.show({ message: '上传成功', type: 'success' });
      } else {
        this.$refs.uToast.show({ message: data.msg, type: 'error' });
      }
    },
    beforeRemove(index, lists) {
      this.fileList = [];
      this.imgList.splice(index, 1);
      this.receiptsForm.receiptImgs = this.imgList.join(',');
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    isOneWayChange(index) {
      if (index == 1) {
        this.form['isOneWay'] = true;
        this.receiptsForm['isOneWay'] = true;
        this.isOneWayType = index;
      } else {
        this.form['isOneWay'] = false;
        this.receiptsForm['isOneWay'] = false;
        this.isOneWayType = index;
      }
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    vehicleChange(index) {
      this.form['receiptVehicle'] = index;
      this.receiptsForm['receiptVehicle'] = index;
      this.vehicleType = index;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    getEmp(v) {
      let f = this.form;
      if (v.come == 'auditEmpIds' && !(f.empId && f.typeRoleId)) {
        this.$u.toast('请先选择提交人和单据类型');
        return;
      }
      uni.redirectTo({
        url: `../selectedEmp/selectedEmp?come=${v.come}&type=${this.receiptType}&mykq=${this.mykq}&sourceType=${this.sourceType}`
      });
    },
    fromCityBlur(v) {
      this.receiptsForm['fromCity'] = v;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    toCityBlur(v) {
      this.receiptsForm['toCity'] = v;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    receiptCauseBlur(e) {
      this.receiptsForm['receiptCause'] = this.form.receiptCause;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    isLeaveChange(v){
      this.receiptsForm['isLeave'] = v;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    leaveCauseBlur(v){
      this.receiptsForm['leaveCause'] = v;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    delClick(v) {
      this.duplicateEmpList.splice(v,1);
      let arr = [];
      this.duplicateEmpList.forEach(i => {
        arr.push(i.id);
      });
      this.receiptsForm.duplicateEmpIds = arr.join(',');
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
		cityConfirm(e){
			let arr = e.value;
			if(this.btnType === 'from'){
				this.$set(this.form,'fromCity',arr.join('-'));
				this.$set(this.receiptsForm,'fromCity',arr.join('-'));
			}else{
				this.$set(this.form,'toCity',arr.join('-'));
				this.$set(this.receiptsForm,'toCity',arr.join('-'));
			}
			uni.setStorageSync('receiptsForm_key', this.receiptsForm);
		},
    deleteClick(i) {
      this.bkTimeSteps.splice(i, 1);
      this.form.bkTimeSteps = this.bkTimeSteps;
      this.receiptsForm.bkTimeSteps = this.bkTimeSteps;
      uni.setStorageSync('receiptsForm_key', this.receiptsForm);
    },
    backClick() {
      if (this.mykq) {
        uni.redirectTo({ url: '../../mykq/mykq' });
      } else {
        uni.switchTab({ url:'/pages/index/index' })
      }
    },
  }
};
</script>

<style scoped>
>>> .u-form-item--left {
  align-items: flex-start;
}
.del {
  position: absolute;
  top: -12rpx;
  right: -6rpx;
  z-index: 100;
  font-size: 20rpx;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  border-radius: 10rpx;
  background-color: red;
}
</style>
