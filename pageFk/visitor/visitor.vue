<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      <scroll-view scroll-y style="height: calc(100% - 67px);width: 100%;">
				<u-form :model="form" ref="uForm" :border-bottom="false" label-width="140">
					<my-card :showFoot="false" showHead headBorderBottom margin="0 20rpx 20rpx">
						<view slot="head" class="u-font-32 u-main-color">添加来访人员</view>
						<view>
						  <view v-if="imgBase64.length > 0" style="position: relative;width: 220rpx;height: 220rpx;margin: 0 auto;">
						    <u-image 
									@click="imageClick(imgBase64)" :src="imgBase64" 
									shape="circle" width="200rpx" height="200rpx" 
									style="overflow: hidden;"></u-image>
						    <view class="u-delete-icon" @click="deleteItem">
									<u-icon name="close" size="20" color="#ffffff"></u-icon>
								</view>
						  </view>
						  <view class="u-row-center avatar u-flex u-row-center" v-else>
								<my-upload
								  ref="uUpload"
								  :multiple="false"
								  max-count="1"
								  :header="fileHeader"
								  :action="CodeAction"
								  name="file"
								  :auto-upload="true"
								  :show-progress="showProgress"
								  v-model="form.img"
									:form-data="{mode:'VISITOR_IMG'}"
								  :show-tips="false"
								  :shomy-upload-list="true"
								  @on-success="fileUpload"
								  @on-error="uploadError"
								  :before-upload="beforeUpload"
								></my-upload>
							</view>
							<view class="u-font-20 u-text-center u-light-color">请上传清晰的个人照片，以便入校通行</view>
						</view>
						
						<u-form-item label="证件类型" prop="certificateType" required @click="certificateTypeShow = true">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						  <u-input v-model="form.certificateType" disabled disabledColor="#ffffff" placeholder="请选择" />
						</u-form-item>
						
						<u-form-item label="证件编号" prop="visitorCertificateCode" required>
							<u-icon slot="right" name="camera-fill" size="60" @click="handlerOCR" color="#3c9cff"></u-icon>
							<u-input v-model.trim="form.visitorCertificateCode" placeholder="请填写" maxlength="18" />
						</u-form-item>
						
						<view v-show="isShowCertificate && certificateUrl.length > 0" style="position: relative;width: 220rpx;height: 220rpx;margin: 10rpx;">
							<u-image 
								@click="imageClick(certificateUrl)" 
								:src="certificateUrl" 
								style="width: 200rpx;height: 200rpx;overflow: hidden;border-radius: 10rpx;"></u-image>
							<view class="u-delete-icon" @click="deleteItem2">
								<u-icon name="close" size="20" color="#ffffff"></u-icon>
							</view>
						</view>
						<my-upload
							v-show="isShowCertificate && certificateUrl.length === 0"
							ref="uUpload6"
							:multiple="false"
							max-count="1"
							upload-text="上传证件照片"
							:header="fileHeader"
							:action="CodeAction"
							name="file"
							:auto-upload="true"
							:show-progress="showProgress"
							v-model="form.certificateUrl"
							:form-data="{mode:'VISITOR_CERTIFICATE_IMG'}"
							:show-tips="false"
							:shomy-upload-list="true"
							@on-success="certificateUpload"
							@on-error="uploadError"
							:before-upload="beforeUpload"
						></my-upload>
						
						<u-form-item label="来访人员" prop="visitorName" required>
						  <u-input v-model.trim="form.visitorName" placeholder="请填写" maxlength="50" />
						</u-form-item>
						
						<u-form-item label="性别">
							<u-radio-group v-model="form.visitorSex" size="38" iconSize="30">
								<u-radio :name="1" customStyle="margin-right:30rpx;">男</u-radio>
								<u-radio :name="2">女</u-radio>
							</u-radio-group>
						</u-form-item>
						
						<u-form-item label="手机号码" prop="visitorPhone" required>
						  <u-input :maxlength="11" type="number" v-model.trim="form.visitorPhone" placeholder="请填写" />
						</u-form-item>
						
						<u-form-item label="来源地" required prop="sourceAddress" v-if="isShowSourceAddr" @click="sourceAdrShow = true">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
							<u-input disabled disabledColor="#ffffff" v-model="form.sourceAddress" placeholder="请填写" />
						</u-form-item>
						
						<u-form-item label="车牌号" prop="visitorCarNum" @click="keyboardCarShow = true">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						  <u-input disabled disabledColor="#ffffff" :value="visitorCarNumVal" v-model="form.visitorCarNum" placeholder="请填写" />
						</u-form-item>
					</my-card>
					
					<my-card :showFoot="false" showHead headBorderBottom>
						<view slot="head">添加携带物品</view>
						<u-form-item label="物品名称">
							<u-input v-model.trim="form.goodsName" placeholder="请填写物品名称" />
						</u-form-item>
						
						<u-form-item label="数量" @click="keyboardNumShow = true">
							<u-input v-model="form.goodsNum" trim placeholder="请填写物品数量" disabled disabledColor="#ffffff" />
						</u-form-item>
						
						<u-form-item label="备注" prop="note">
							<u--textarea 
								v-model="form.note" 
								placeholder="请填写物品型号、数量等" 
								count border="none" maxlength="100" autoHeight></u--textarea>
						</u-form-item>
						
						<view>
							<my-upload
								ref="uUpload4"
								:multiple="true"
								max-count="3"
								name="file"
								width="190"
								:file-list="goodsFileList"
								:action="goodsAction"
								:show-progress="showProgress"
								:header="fileHeader"
								@on-success="goodsUpload"
								@on-error="uploadError"
								:before-upload="beforeUpload"
								:beforeRemove="goodsBeforeRemove"
								:auto-upload="true"
							></my-upload>
						</view>
					</my-card>
					
					<view v-if="visitHistory.length > 0">
					  <view class="u-m-l-40 u-m-b-10">历史来访记录</view>
						<u-swipe-action>
							<u-swipe-action-item 
								v-for="(item, index) in visitHistory" :key="$u.guid()"
								:options="options"
								@click="swipeClick($event,index)">
								<view class="u-p-30 u-line-1" @click="swipeContentClick(index)">
								  <text class="u-m-r-20">{{ item.visitorName }}</text>
								  <text>{{ item.visitorPhone }}</text>
								</view>
							</u-swipe-action-item>
						</u-swipe-action>
					</view>
				</u-form>
      </scroll-view>
    </movable-area>
		
		<my-button @click="submit">确定</my-button>
		
		<u-action-sheet
			:show="certificateTypeShow" 
			:actions="certificateTypeDic"
			title="请选择证件编号"
			@close="certificateTypeShow = false"
			@select="certificateTypeConfirm"></u-action-sheet>
		<w-picker
		  :visible.sync="sourceAdrShow"
		  mode="linkage"
		  :options="sourceAdrDic"
		  :level="3"
		  default-type="value"
		  @confirm="sourceAdrConfirm"
		  ref="linkage" ></w-picker>
		<u-keyboard
		  ref="uKeyboard1" 
		  mode="car" autoChange
		  :show="keyboardCarShow"
		  @change="carChange" 
		  @backspace="carBackspace"
			@cancel="keyboardCarShow = false"
			@confirm="keyboardCarShow = false"></u-keyboard>
		<u-keyboard
		  ref="uKeyboard2" 
		  mode="number"
		  :show="keyboardNumShow"
		  @change="goodsNumChange" 
		  @backspace="goodsNumBackspace"
			@cancel="keyboardNumShow = false"
			@confirm="keyboardNumShow = false"></u-keyboard>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在提交，请等待...</view>
		</u-overlay>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import config from '@/config/index.js';
import { city } from '@/utils/city.js'
import wPicker from "@/components/w-picker/w-picker.vue";

export default {
	components:{ wPicker },
  data() {
    return {
      form: {goodsNum:'',visitorSex:1,note:""},
			fileHeader:{token: '',appId:"",sid:""},
      showProgress: true,
      rules: {
        visitorName: [{
					required: true,
					message: '请填写来访人员姓名',
					trigger: 'blur'
				}],
        visitorPhone: [{
					validator: (rule, value, callback) => {
						return this.$u.test.mobile(value);
					},
					message: '手机号码不正确',
					trigger: 'blur'
				}],
				certificateType: [{
					required: true,
					message: '请选择证件类型',
					trigger: ['blur','change']
				}],
        visitorCertificateCode: [{
					required: true,
					message: '请输入证件编号',
					trigger: 'blur'
				}]
      },
      visitHistory: [],
      imgBase64: '',
      visitForm: [],
      applyForm: {},
      options: [{ text: '删除', style: { backgroundColor: '#dd524d', width: '150rpx' } }],
      keyboardCarShow: false,
      visitorCarNumVal: '',
      maskShow: false,
      maskImgShow: false,
			CodeAction:`${config.baseUrl}/iot-wx/commons/upload`,
			goodsAction:`${config.baseUrl}/iot-wx/visitor/goods/upload/pic`,
			keyboardNumShow:false,
			goodsFileList:[],
			goodsList:[],
			errText:"",
			sourceAdrShow:false,
			sourceAdrDic:city(),
			isShowSourceAddr:true,
			isShowCertificate:true,
			certificateTypeShow:false,
			certificateTypeDic:[
				{value:"身份证",name:"身份证"},
				{value:"军官证",name:"军官证"},
				{value:"驾驶证",name:"驾驶证"},
				{value:"港澳通行证",name:"港澳通行证"},
				{value:"台胞证",name:"台胞证"},
				{value:"护照",name:"护照"},
				{value:"其他",name:"其他"}
			],
			certificateUrl:""
    };
  },
  onReady() {
		this.fileHeader.appId = this.vuex_urlobj.appId
		this.fileHeader.token = this.vuex_urlobj.token
		this.fileHeader.sid = this.vuex_urlobj.sid
  },
  onLoad() {
		this.isShowSourceAddr = this.vuex_cfg?.isShowSourceAddr == 1 ? true : false;
		this.isShowCertificate = this.vuex_cfg?.isShowCertificate == 1 ? true : false;
		if(this.isShowSourceAddr){
			this.$nextTick(() => this.$refs.uForm.setRules({
				...this.rules,
				sourceAddress: [{
					required:true,
					message: '请选择来源地',
					trigger: ['change', 'blur']
				}],
			}))
		}else{
			this.$nextTick(() => this.$refs.uForm.setRules(this.rules))
		}
    if (uni.getStorageSync('visitHistory_key')) {
      this.visitHistory = uni.getStorageSync('visitHistory_key');
    }
    if (uni.getStorageSync('applyForm_key')) {
      this.applyForm = uni.getStorageSync('applyForm_key');
      if (this.applyForm.visitForm) {
        this.visitForm = this.applyForm.visitForm;
      }
    }
  },
  methods: {
    imageClick(img) {
			uni.previewImage({urls:[img]})
    },
		handlerOCR(){
			uni.chooseImage({
				success: (res) => {
					this.maskShow = true;
					uni.uploadFile({
						url:`${config.baseUrl}/iot-wx/commons/idcard/ocr/recognition`,
						name:'file',
						filePath:res.tempFilePaths[0],
						success: (r) => {
							let data =JSON.parse(r.data);
							this.maskShow = false;
							if(data.code == 200 && data.data.idCardNo){
								this.$set(this.form,'visitorCertificateCode',data.data.idCardNo);
								this.$set(this.form,'visitorName',data.data.name.length > 50 ? data.data.name.substr(0,50) : data.data.name);
							}else{
								this.$refs.uToast.show({ message:"解析失败，请重新上传图片识别！",type: "error" });
							}
						},
					})
				}
			})
		},
		certificateTypeConfirm(e){
			this.form.certificateType = e.name;
		},
		goodsUpload(data, index, lists, name){
			this.maskShow = false;
			this.showProgress = false;
			if (data.code == 200) {
				this.goodsList.push(data.msg)
			  this.$refs.uToast.show({ message: '上传成功', type: 'success' });
			} else {
			  this.$refs.uToast.show({ message: data.msg, type: 'error' });
			}
		},
		goodsBeforeRemove(index,lists){
			this.goodsList.splice(index, 1);
		},
		certificateUpload(data, index, lists, name){
			this.maskShow = false;
			this.showProgress = false;
			if (data.code == 200) {
			  this.$refs.uToast.show({ message: '上传成功', type: 'success' });
				this.certificateUrl = data.data.absUrl;
			} else {
				this.deleteItem2();
			  this.$refs.uToast.show({ message: data.msg, type: 'error' });
			}
		},
		deleteItem2() {
			this.certificateUrl = '';
		  this.$refs.uUpload6.clear();
		},
		goodsNumChange(val) {
			let str = this.form.goodsNum || '';
		  this.form.goodsNum = str + val;
		},
		goodsNumBackspace() {
		  if (this.form.goodsNum.length) {
		    this.form.goodsNum = this.form.goodsNum.substr(0, this.form.goodsNum.length - 1);
		  }
		},
    carChange(val) {
      if(this.visitorCarNumVal.length < 9){
        this.visitorCarNumVal += val;
        this.form.visitorCarNum = this.visitorCarNumVal;
      }
    },
    carBackspace() {
      if (this.visitorCarNumVal.length) {
        this.visitorCarNumVal = this.visitorCarNumVal.substr(0, this.visitorCarNumVal.length - 1);
        this.form.visitorCarNum = this.visitorCarNumVal;
      }
    },
		sourceAdrConfirm(e){
			this.$set(this.form,'sourceAddress',e.value.join('-'));
		},
    backClick() {
      uni.navigateBack({ delta:1 })
    },
    beforeUpload(index, list) {
      this.maskShow = true;
      return true;
    },
    fileUpload(data, index, lists, name) {
			this.showProgress = false;
			this.maskShow = false;
      if (data.code == 200) {
        this.imgBase64 = data.data.absUrl || '';
        this.$refs.uToast.show({ message: '上传成功', type: 'success' });
      } else {
        this.$refs.uToast.show({ message: data.msg, type: 'error' });
				this.deleteItem();
      }
    },
		uploadError(err){
			console.log(err);
			this.maskShow = false
		},
    deleteItem() {
      this.imgBase64 = '';
      this.$refs.uUpload.clear();
    },
    submit() {
      this.$refs.uForm.validate().then(() => {
				if (!this.imgBase64) return this.$refs.uToast.show({ message: '请选择来访人员照片', type: 'error' });
				if(this.isShowCertificate && !this.certificateUrl) return this.$refs.uToast.show({ message: '请上传证件照', type: 'warning' });
				let form = {...this.form};
				form.visitorCarNum = form.visitorCarNum ? form.visitorCarNum : ""
				form.visitorImgUrl = this.imgBase64;
				form.certificateUrl = this.certificateUrl;
				form.visitorGoodImgs = this.goodsList.join(',');
				form.visitorGoods = "";
				if(form.goodsName){
					form.visitorGoods += form.goodsName;
				}
				if(form.goodsNum){
					form.visitorGoods += ','+form.goodsNum;
				}
				if(form.note){
					form.visitorGoods += ','+form.note;
				}
				
				form.show = false;
				let exit = this.visitHistory.filter(item => item.visitorCertificateCode != form.visitorCertificateCode)
				exit.unshift(form)
				this.visitHistory = [...exit];
				if (this.visitHistory.length >= 10) {
					this.visitHistory.splice(this.visitHistory.length - 1, 1);
				}
				uni.setStorage({ key: 'visitHistory_key', data: this.visitHistory });
				
				let index = this.visitForm.findIndex(item => item.visitorCertificateCode === form.visitorCertificateCode);
				if(index >= 0){
					this.visitForm[index] = form;
				}else{
					this.visitForm.push(form);
				}
				this.applyForm.visitForm = this.visitForm;
				uni.setStorage({ key: 'applyForm_key', data: this.applyForm });
				uni.redirectTo({ url: '../apply/apply' });
			});
    },
    swipeClick(e,index) {
			if (e.index == 0) {
			  this.visitHistory.splice(index, 1);
			  uni.setStorage({ key: 'visitHistory_key', data: this.visitHistory });
			}
    },
		swipeContentClick(index) {
		  let item = this.visitHistory[index];
		  this.form = item;
		  this.imgBase64 = item.visitorImgUrl;
		  this.certificateUrl = item.certificateUrl;
		  let arr = item.visitorGoodImgs ? item.visitorGoodImgs.split(',').map(v => ({url:v})) : [];
		  this.goodsList = arr.length ? arr.map(v => v.url) : [];
		  this.goodsFileList = arr;
		  this.showProgress = false;
		}
  }
};
</script>

<style lang="scss" scoped>
.u-delete-icon {
  position: absolute;
  top: -10rpx;
  right: 6rpx;
  z-index: 8;
  background-color: $u-error;
  border-radius: 100rpx;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.maskClass {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ffffff;
}
.avatar /deep/.u-list-item{
	border-radius: 200rpx !important;
}
</style>
