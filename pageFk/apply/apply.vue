<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
			
      <scroll-view scroll-y style="height: 100%;width: 100%;">
        <u-form :model="form" ref="uForm" :border-bottom="false" label-width="140">
          <my-card margin="0 20rpx" padding="10rpx 30rpx">
						<u-form-item prop="interviewees" class="formItem" :border-bottom="false" @click="intervieweesClick">
							<view class="u-flex">
								<view class="u-text-center u-m-r-20">
									<u-icon name="gongdan-beifangre1" custom-prefix="custom-icon" />
									<view>被访人</view>
								</view>
								<u-input v-model="form.interviewees" disabled disabledColor="#ffffff" placeholder="请添加" />
							</view>
						</u-form-item>
          </my-card>

          <my-card v-if="vuex_useInfo.bindEmpType != 2" padding="10rpx 30rpx">
            <u-form-item prop="visitors" class="formItem" :border-bottom="false">
              <view class="u-flex">
								<view class="u-text-center u-m-r-20">
								  <u-icon name="gongdan-fangke1" custom-prefix="custom-icon" />
								  <view>来访人</view>
								</view>
								<view v-model="form.visitors" v-if="visitList.length > 0" style="flex: 1;">
								  <view 
										v-for="(item, index) in visitList" :key="index" 
										class="u-border-bottom u-flex u-row-between u-p-t-20 u-p-b-20 u-m-b-10">
								    <text class="u-flex-12 fw700" style="color: #121212;">
											{{ item.visitorName.length > 8 ? item.visitorName.substr(0,8)+'...' : item.visitorName }} {{ item.visitorPhone }}
										</text>
								    <u-icon size="50" color="#c0c4cc" name="minus-circle" @click="deleteClick(index)"></u-icon>
								  </view>
								  <view class="u-border-bottom u-flex u-row-between u-p-t-20 u-p-b-20" @click="visitClick">
								    <text>添加来访人员</text>
								    <u-icon size="50" color="#c0c4cc" name="plus-circle"></u-icon>
								  </view>
								</view>
								<view v-else @click="visitClick">
									<u-input disabled disabledColor="#ffffff" placeholder="请添加" />
								</view>
							</view>
            </u-form-item>
          </my-card>

          <my-card>
            <u-form-item
            	v-if="vuex_useInfo.bindEmpType != 2"
              label="来访单位" label-width="200rpx" 
              prop="visitorCompany" 
              leftIcon="grid" :leftIconStyle="lefticonstyle" 
              class="formItem"
							@blur="visitorCompanyBlur">
							<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
              <u-input v-model.trim="form.visitorCompany" placeholder="请填写" input-align="right" maxlength="50" />
            </u-form-item>
            <u-form-item 
              label="到访时间" label-width="200rpx" 
              prop="visitorTime" 
              leftIcon="calendar" :leftIconStyle="lefticonstyle" 
              class="formItem"
							@click="visitDateShow = true;">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.visitorTime" disabled disabledColor="#ffffff" placeholder="请选择" input-align="right" />
            </u-form-item>
            
            <u-form-item 
              label="离访时间" label-width="200rpx" 
              prop="levalTime" 
              leftIcon="calendar" :leftIconStyle="lefticonstyle" 
              class="formItem"
							@click="levalTimeClick">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.levalTime" disabled disabledColor="#ffffff" placeholder="请选择" input-align="right" />
            </u-form-item>
            
            <u-form-item 
              label="到访区域" label-width="200rpx" 
              prop="visitArea" 
              leftIcon="map" :leftIconStyle="lefticonstyle" 
              class="formItem"
							@click="visitAreaShow = true">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.visitArea" disabled disabledColor="#ffffff" placeholder="请选择" input-align="right" />
            </u-form-item>
            
            <u-form-item
              label="到访事由" label-width="200rpx"
              prop="visitorCause"
              leftIcon="list" :leftIconStyle="lefticonstyle"
              class="formItem"
							@click="handlerSelect('visitorCause')">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
              <u-input v-model="form.visitorCause" disabled disabledColor="#ffffff" placeholder="请选择" input-align="right" />
            </u-form-item>
          </my-card>

          <my-card v-if="vuex_useInfo.bindEmpType == 2">
          	<u-form-item
          		label="人数" 
          		prop="visitorPersonCount" 
          		leftIcon="account" :leftIconStyle="lefticonstyle" 
          		class="formItem"
							@click="keyboardNumShow = true" >
							<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
          		<u-input v-model="form.visitorPersonCount" :placeholder="`最大可填人数${visitorMaxEmpNum}人`"input-align="right" disabled disabledColor="#ffffff" />
          	</u-form-item>
          	
          	<u-form-item 
          		label="邀请有效时长" label-width="240"
          		prop="invitationMinuteExpire" 
          		leftIcon="clock" :leftIconStyle="lefticonstyle" 
          		class="formItem" 
							@click="handlerSelect('invitationMinuteExpire')">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
          		<u-input v-model="form.invitationMinuteExpireLabel" disabled disabledColor="#ffffff" placeholder="请选择" input-align="right" />
          	</u-form-item>
          </my-card>
        </u-form>
			
				<view style="padding-bottom: 160rpx;">
					<view class="agreement">
						<u-checkbox-group v-model="agreement" @change="checkboxChange" size="38">
							<u-checkbox name="isAgreement" iconSize="30"></u-checkbox>
						</u-checkbox-group>
						<view class="u-p-l-6 u-flex" @click="popupshow = true">
							勾选代表同意
							<text class="c007AFF u-m-l-6">《注意事项》</text>
						</view>
					</view>
				
					<view class="u-m-t-30 u-m-l-60 u-tips-color u-flex">
						<u-icon name="server-fill" size="40" class="u-m-r-4"></u-icon>技术支持:
						<text class="u-m-r-30 u-m-l-20 c007AFF" @click="phoneClick('15353510079')">15353510079</text>
						<text class="c007AFF" @click="phoneClick('13720614891')">13720614891</text>
					</view>
					
				</view>
			</scroll-view>	
    </movable-area>
		
		<my-button @click="btnClick" stype="even" v-if="vuex_useInfo.bindEmpType != 2" :disabled="btnDisabled">
			<template slot="left">邀请多人随行</template>
			发起预约
		</my-button>
		<my-button @click="btnClick" v-if="vuex_useInfo.bindEmpType == 2" :disabled="btnDisabled">发起邀约</my-button>
		
		<u-popup :show="popupshow" mode="bottom" height="50%" closeable @close="popupshow = false">
			<view class="u-text-center u-p-20 u-font-30 bgfff" style="position: fixed;z-index: 2;width: 100%;">注意事项</view>
			<view style="padding: 82rpx 30rpx 20rpx;">
				<u-parse :content="strings"></u-parse>
			</view>
		</u-popup>
		
		<u-action-sheet
			:show="actionSheetShow" 
			:actions="actionSheetData"
			:title="actionSheetTitle"
			@close="actionSheetShow = false"
			@select="actionSheetChange"></u-action-sheet>
		<u-keyboard
		  ref="uKeyboard" 
		  mode="number"
		  :show="keyboardNumShow"
		  @change="visitorPersonCountChange" 
		  @backspace="visitorPersonCountBackspace"
			@cancel="keyboardNumShow = false"
			@confirm="keyboardNumShow = false"></u-keyboard>
		<u-datetime-picker 
			:mode="dateType === 'datetime' ? 'datetime' : 'date'"
			:show="visitDateShow" v-model="visitorTimeLabel"
			:maxDate="new Date('2050/05/31').getTime()"
			:minDate="new Date().getTime()"
			@confirm="visitDateConfirm"
			@cancel="visitDateShow = false"
			@close="visitDateShow = false"
		></u-datetime-picker>
		<u-datetime-picker
			:mode="dateType === 'datetime' ? 'datetime' : 'date'"
			:show="departureDateShow" v-model="levalTimeLabel"
			:minDate="departureMinDate"
			:maxDate="departureMaxDate"
			@confirm="departureDateConfirm"
			@cancel="departureDateShow = false"
			@close="departureDateShow = false"
		></u-datetime-picker>
		<w-picker
		  :visible.sync="visitAreaShow"
		  mode="linkage"
		  :options="visitAreaList"
		  :level="3"
		  default-type="value"
		  @confirm="visitAreaConfirm"
		  ref="linkage" ></w-picker>
			
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在提交，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
  </view>
</template>

<script>
import { deleteEmptyArr } from '@/utils/my_function.js'
import { initFkCfg } from '@/api/common/index.js';
import { submit, targetInviteSubmit } from '../api/apply.js';
import wPicker from "@/components/w-picker/w-picker.vue";

export default {
	components:{ wPicker },
  data() {
    return {
      form: {visitorCompany:"",visitorTime:"",levalTime:"",visitArea:"",visitorCause:"",visitorPersonCount:"",invitationMinuteExpire:""},
			lefticonstyle: { 'font-size': '34rpx' },
			visitList: [],
			visitDateShow: false,
			visitMindate: uni.$u.timeFormat(new Date()),
			departureDateShow: false,
			departureMinDate: '',
			departureMaxDate: '',
			defaultLeaveTime:'23:59:59',
			betweenTime:4,
			visitAreaList: [],
			visitAreaShow: false,
			visitReasonsList: [],
			visitorMaxEmpNum:99,
			keyboardNumShow:false,
			invitationMinuteExpireShow:false,
			invitationMinuteExpireList:[
				{value:0,name:"离访时间"},
				{value:10,name:"10分钟"},
				{value:20,name:"20分钟"},
				{value:30,name:"30分钟"},
				{value:40,name:"40分钟"},
				{value:50,name:"50分钟"},
				{value:60,name:"60分钟"}
			],
			actionSheetShow:false,
			actionSheetData:[],
			actionSheetTitle:'',
			
      agreement: false,
      popupshow: false,
			strings: '',
			btnDisabled:false,
			maskShow: false,
			maxDays: '',
			dateType:"date",
			applyForms: {},
      type: 'select',
      rules: {
        interviewees: [{
					required: true,
					message: '请添加被访人员信息',
					trigger: ['change', 'blur']
				}],
        visitors: [{
					validator: (rule, value, callback) => {
						return this.$u.test.array(value) && value.length > 0;
					},
					message: '请添加来访人员信息',
					trigger: ['change', 'blur']
				}],
				visitorCompany: [{
					required: true,
					message: '请填写来访单位',
					trigger: ['change', 'blur']
				}],
        visitorTime: [{
					required: true,
					message: '请选择到访时间',
					trigger: ['change', 'blur']
				}],
        levalTime: [{
					required: true,
					message: '请选择离访时间',
					trigger: ['change', 'blur']
				}],
        visitArea: [{
					required: true,
					message: '请选择到访区域',
					trigger: ['change', 'blur']
				}],
        visitorCause: [{
					required: true,
					message: '请选择到访事由',
					trigger: 'blur'
				}],
				visitorPersonCount:[{
					required: true,
					message: '请输入人数',
					trigger: ['change', 'blur']
				}],
				invitationMinuteExpire:[{
					required: true,
					message: '请选择邀请有效时长',
				}]
      },
			visitorTimeLabel:"",
			levalTimeLabel:""
    };
  },
  onLoad(option) {
    try {
      const applyForm = uni.getStorageSync('applyForm_key');
      if (applyForm) {
        if (applyForm.targetVisitorEmpName) {
					let targetVisitorEmpName = applyForm.targetVisitorEmpName.length > 8 ? applyForm.targetVisitorEmpName.substr(0,8)+'...' : applyForm.targetVisitorEmpName;
          this.form.interviewees = targetVisitorEmpName + ' ' + applyForm.targetVisitorEmpPhone;
        }
        this.form['targetVisitorEmpPhone'] = applyForm.targetVisitorEmpPhone;
        this.form['targetVisitorEmpName'] = applyForm.targetVisitorEmpName;
        if (applyForm.visitForm) {
          this.visitList = applyForm.visitForm;
        }
        this.form.visitors = this.visitList;
        this.form.visitorCompany = applyForm.visitorCompany;
        this.form.visitorTime = applyForm.visitorTime;
        this.form.levalTime = applyForm.levalTime;
        this.form.visitArea = applyForm.visitArea;
        this.form['visitorAreaId'] = applyForm.visitorAreaId;
        this.form.visitorCause = applyForm.visitorCause;
				this.form.visitorPersonCount = applyForm.visitorPersonCount;
				this.form.invitationMinuteExpireLabel = applyForm.invitationMinuteExpireLabel;
				this.form.invitationMinuteExpire = applyForm.invitationMinuteExpire;
        this.applyForms = applyForm;
      }
    } catch (e) {
      console.log(e);
    }
    this.initPageData();
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
		if(this.vuex_useInfo.bindEmpType == 2){
		  uni.setNavigationBarTitle({ title:'教职工邀约' })
		}else{
		  uni.setNavigationBarTitle({ title:'访客预约' })
		}
  },
  methods: {
    btnClick(type) {
      this.$refs.uForm.validate().then(() => {
				if (!this.agreement) return this.$u.toast('请勾选协议');
				let form = uni.$u.deepClone(this.form);
				if(this.dateType === 'datetime'){
					form.visitorTime = form.visitorTime + ':00';
					form.levalTime = form.levalTime + ':59';
					let start = new Date(this.iosTransDate(form.visitorTime)).getTime(), 
							end = new Date(this.iosTransDate(form.levalTime)).getTime();
					let diff = end - start;
					if(diff > 24*60*60*1000*this.maxDays){
						return this.$refs.uToast.show({
							message: `最大只可预约${this.maxDays}天`,
							type: 'error',
							icon: false
						});
					}
				}
				if(this.vuex_useInfo.bindEmpType != 2){
					if(type === 'left'){
						this.$u.route('/pageFk/retinue-ask/retinue-ask',{dateType:this.dateType,visitorMaxEmpNum:this.visitorMaxEmpNum});
					}else{
						this.maskShow = true;
						submit(form).then(res => {
							this.maskShow = false;
							this.btnDisabled = true;
							uni.removeStorageSync('applyForm_key');
							uni.removeStorageSync('goodsHistory_key');
							this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
							setTimeout(() => {
								this.backClick();
							}, 2000);
						}).catch(err => {
							this.maskShow = false;
							this.$refs.uToast.show({ message: err, type: 'error', icon: false });
						});
					}
				}else{
					// 员工邀约界面按钮
					this.maskShow = true;
					targetInviteSubmit(form).then(res => {
						this.maskShow = false;
						this.btnDisabled = true;
						uni.removeStorageSync('applyForm_key');
						this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
						setTimeout(() => {
							this.$u.route('/pageFk/retinue-details/retinue-details',{visitorNo:res.data.data.visitorNo})
						}, 3000);
					}).catch(err => {
						this.maskShow = false;
						this.$refs.uToast.show({ message: err, type: 'error', icon: false });
					});
				}
			});
    },
    
    initPageData() {
      this.visitAreaList = [];
      this.visitReasonsList = [];
      initFkCfg().then(res => {
        if (res.data.code == 200) {
          let d = res.data.data;
          this.strings = d.FK_RULE_DESCRIPTION;
					this.maxDays = d.FK_APPOINTMENT_MAX_DYAS || 1;
					this.dateType = d.FK_YUYUE_DATE_OR_DATETIME_OPTIONS || 'date';
					this.visitorMaxEmpNum = d.VISITOR_FOLLOW_UP_MAX_PERSON_COUNT || 6;
					this.defaultLeaveTime = d.VISITOR_ZW_YY_TIME || '23:59:59';
					this.betweenTime = d.VISITOR_DEFAULT_YY_DURATION || 2;
					
					this.visitAreaList = deleteEmptyArr(d.areaSelectData,2);
          let data = d.causes[0].val;
          data = data.split('#');
					let arr2 = data.map((v,i) => ({value: i,name: v}))
					this.visitReasonsList = arr2;
        }
      });
    },
		// 点击添加被访人员跳转
		intervieweesClick() {
		  this.$u.route('/pageFk/interviewees/interviewees');
		},
		// 点击添加来访人员跳转
		visitClick() {
			this.$u.route('/pageFk/visitor/visitor');
		},
		// 删除已选来访人员
		deleteClick(i) {
		  this.visitList.splice(i, 1);
		  this.form.visitors = this.visitList;
		  this.applyForms.visitForm = this.visitList;
		  uni.removeStorageSync('applyForm_key');
		  uni.setStorageSync('applyForm_key', this.applyForms);
		},
		visitorCompanyBlur(e) {
		  this.form.visitorCompany = e;
		  this.applyForms.visitorCompany = e;
		  uni.setStorageSync('applyForm_key', this.applyForms);
		},
    // 点击到访日期确定时
    visitDateConfirm(e) {
			if(this.dateType === 'datetime'){
				let result = uni.$u.timeFormat(e.value,'yyyy-mm-dd hh:MM');
				this.form.visitorTime = result;
				this.applyForms.visitorTime = result;
				
				let leave = e.value + this.betweenTime*60*60*1000;
				let end = uni.$u.timeFormat(e.value,'yyyy-mm-dd ') + this.defaultLeaveTime;
				if(new Date(this.iosTransDate(end))*1 - e.value <= 0){
					this.visitDateShow = false;
					this.$refs.uToast.show({ message: `当前预约时间过晚，当天最晚离访时间为${this.defaultLeaveTime}`, type: 'warning', icon: false });
					return false;
				}
				if(new Date(this.iosTransDate(end))*1 - leave <= 0){
					this.form.levalTime = end.substr(0,16);
					this.applyForms.levalTime = end.substr(0,16);
				}else{
					this.form.levalTime = uni.$u.timeFormat(leave,'yyyy-mm-dd hh:MM');
					this.applyForms.levalTime = uni.$u.timeFormat(leave,'yyyy-mm-dd hh:MM');
				}
				this.visitDateShow = false;
			}
			if(this.dateType === 'date'){
				let result = uni.$u.timeFormat(e.value,'yyyy-mm-dd');
				this.form.visitorTime = result;
				this.applyForms.visitorTime = result;
				this.form.levalTime = result;
				this.applyForms.levalTime = result;
				this.visitDateShow = false;
			}
			uni.setStorageSync('applyForm_key', this.applyForms);
			this.$forceUpdate();
    },
    levalTimeClick() {
			let visitorTime = this.form.visitorTime;
			if(!visitorTime) return this.$refs.uToast.show({ message: `请先选择到访时间！`, type: 'warning', icon: false })
			
			let time = new Date(this.iosTransDate(visitorTime)).getTime();
			this.departureMinDate = time;
			let defaultLeaveTime = this.defaultLeaveTime ? this.defaultLeaveTime : '23:59:59';
			let end = uni.$u.timeFormat(time,'yyyy-mm-dd ') + this.defaultLeaveTime;
			
      if (this.maxDays == 1) {
				if(this.dateType === 'datetime'){
					this.departureMaxDate = new Date(this.iosTransDate(end)).getTime();
					this.departureDateShow = true;
					return false;
				}
        this.departureDateShow = false;
      } else if (this.maxDays == 0) {
        this.departureMaxDate = new Date('2050/05/31').getTime();
        this.departureDateShow = true;
      } else {
        let departureMaxDate = new Date(this.iosTransDate(end)) * 1 + (this.maxDays - 1) * 24 * 60 * 60 * 1000;
        this.departureMaxDate = departureMaxDate;
        this.departureDateShow = true;
      }
    },
    // 点击离访日期确定时
    departureDateConfirm(e) {
			if(this.dateType === 'datetime'){
				let end = uni.$u.timeFormat(e.value,'yyyy-mm-dd ') + this.defaultLeaveTime;
				
				if(this.form.visitorTime && e.value - new Date(this.iosTransDate(this.form.visitorTime))*1 <= 0){
					this.departureDateShow = false;
					return this.$refs.uToast.show({ message: `离访时间不能小于到访时间`, type: 'warning', icon: false })
				}
				if(new Date(this.iosTransDate(end))*1 - e <= 0){
					this.departureDateShow = false;
					this.$refs.uToast.show({ message: `当前离访时间过晚，当天最晚离访时间为${this.defaultLeaveTime}`, type: 'warning', icon: false })
					return false;
				}
			}
			let result = uni.$u.timeFormat(e.value,this.dateType === 'datetime' ? 'yyyy-mm-dd hh:MM' : 'yyyy-mm-dd');
      this.form.levalTime = result;
      this.applyForms.levalTime = result;
      uni.setStorageSync('applyForm_key', this.applyForms);
			this.departureDateShow = false;
    },
    // 点击区域确定时
		visitAreaConfirm(e) {
    // visitAreaConfirm({ detail:{ value }}) {
      this.form.visitArea = '';
      this.applyForms.visitArea = '';
			// value.map((val, index) => {
			//   if (val.text == null) {
			//     this.form.visitArea += this.form.visitArea == '' ? val.text : '';
			//     this.applyForms.visitArea = this.form.visitArea;
			//   } else {
			//     this.form.visitArea += this.form.visitArea == '' ? val.text : '-' + val.text;
			//     this.applyForms.visitArea = this.form.visitArea;
			//   }
			//   if (val.value == null) {
			//     this.form['visitorAreaId'] = value[0].value;
			//     this.applyForms['visitorAreaId'] = value[0].value;
			//   } else {
			//     this.form['visitorAreaId'] = val.value;
			//     this.applyForms['visitorAreaId'] = val.value;
			//   }
			// });
			this.form.visitArea = e.result;
			this.applyForms.visitArea = e.result;
			this.form['visitorAreaId'] = e.value[2];
			this.applyForms['visitorAreaId'] = e.value[2];
			this.$forceUpdate();
      uni.setStorageSync('applyForm_key', this.applyForms);
    },
		handlerSelect(type){
			if(type === 'visitorCause'){
				this.actionSheetTitle = "请选择到访事由";
				this.actionSheetData = this.visitReasonsList;
			}
			if(type === 'invitationMinuteExpire'){
				this.actionSheetTitle = "请选择邀请有效时长";
				this.actionSheetData = this.invitationMinuteExpireList;
			}
			this.selectType = type;
			this.actionSheetShow = true;
		},
		actionSheetChange(e){
			if(this.selectType === 'visitorCause'){
				this.form['visitorCause'] = e.name;
				this.applyForms.visitorCause = e.name;
				uni.setStorageSync('applyForm_key', this.applyForms);
			}
			if(this.selectType === 'invitationMinuteExpire'){
				this.form.invitationMinuteExpireLabel = e.name;
				this.form.invitationMinuteExpire = e.value;
				this.$set(this.form,'invitationMinuteExpire',e.value)
				this.applyForms.invitationMinuteExpireLabel = e.name
				this.applyForms.invitationMinuteExpire = e.value;
				uni.setStorageSync('applyForm_key', this.applyForms);
			}
		},
		visitorPersonCountChange(val) {
			let s = this.form.visitorPersonCount ? this.form.visitorPersonCount + val : val;
			if(s*1 <= this.visitorMaxEmpNum){
				this.$set(this.form,'visitorPersonCount',s+'')
				this.applyForms.visitorPersonCount = s+'';
				uni.setStorageSync('applyForm_key', this.applyForms);
			}
		},
		visitorPersonCountBackspace() {
		  if (this.form.visitorPersonCount.length) {
		    this.form.visitorPersonCount =  this.form.visitorPersonCount.substr(0, this.form.visitorPersonCount.length - 1);
				this.applyForms.visitorPersonCount =  this.form.visitorPersonCount;
				uni.setStorageSync('applyForm_key', this.applyForms);
		  }
		},
    // 勾选注意事项
    checkboxChange(e) {
      this.agreement = e.length ? true : false;
    },
		phoneClick(phone) {
		  uni.makePhoneCall({ phoneNumber: phone });
		},
		backClick() {
		  uni.switchTab({ url: '/pages/index/index' });
		},
  }
};
</script>

<style scoped>
.formItem {
  background-color: #ffffff;
  padding: 20rpx 30rpx 20rpx 20rpx;
  border-bottom: 0;
}
>>> .uni-input-input {
  color: #121212;
  font-weight: 800;
}
>>> .u-form-item {
  color: #696969;
}
.agreement {
  display: flex;
  margin: 0rpx 35rpx 20rpx;
  padding-left: 30rpx;
}
.icontitle {
  line-height: 0rpx;
  width: 140rpx;
  padding-bottom: 10rpx;
}
.c007AFF{
	color: #007AFF;
}
</style>
