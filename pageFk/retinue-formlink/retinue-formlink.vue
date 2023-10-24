<template>
	<view>
		<scroll-view scroll-y style="height: 100%;width: 100%;">
			<my-card :showHead="false" :showFoot="false" v-if="timestamp > 0 && visitorState == 8">
				<view class="u-flex u-row-between u-col-center">
					<view style="width: calc(100% - 200rpx);">
						<view class="u-m-b-10" v-if="sourceType === 'appointment'">{{ formInfo.empName }} | 诚邀您随行</view>
						<view class="u-m-b-10" v-else>{{ formInfo.targetEmpName }} | 诚邀您到访</view>
						<view class="u-m-b-10 u-line-1 fw700 u-flex" v-if="sourceType === 'appointment'">
							<text class="u-m-r-10">{{ formInfo.visitorCompany }} </text>
							<text>{{ formInfo.visitorArea }}</text>
						</view>
						<view class="u-m-b-10 u-line-1 fw700 u-flex" v-else>
							<text class="u-m-r-10">{{formInfo.targetEmpCompany}}</text>
							<text>{{ formInfo.visitorArea }}</text>
						</view>
						<view class="u-m-b-10">到访时间：{{ formInfo.visitorTime }}</view>
						<view>离访时间：{{ formInfo.levalTime }}</view>
					</view>
					<view class="red u-text-center" v-if="timestamp > 0">
						<u-image src="https://qs.aiwld.com.cn/static/app/linktop2.png" width="150rpx" height="150rpx" customStyle="margin: 0 auto;"></u-image>
						<text class="u-m-r-4">距离失效: </text>
						<u-count-down :time="timestamp"></u-count-down>
					</view>
				</view>
			</my-card>
			
			<u-form :model="form" ref="uForm" :border-bottom="false" label-width="140" class="u-p-b-120" v-if="timestamp > 0 && visitorState == 8">
				<my-card :showFoot="false" showHead headBorderBottom>
					<view slot="head">请填写以下个人信息</view>
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
								:auto-upload="timestamp > 0 ? true : false"
								:header="fileHeader"
								:action="CodeAction"
								name="file"
								:show-progress="showProgress"
								v-model="form.imgBase64"
								:form-data="{mode:'VISITOR_IMG'}"
								:show-tips="false"
								:show-upload-list="true"
								@on-success="fileUpload"
								@on-error="maskShow = false;"
								:before-upload="beforeUpload"
							></my-upload>
						</view>
						<view class="u-font-20 u-text-center u-light-color">请上传清晰的个人照片，以便入园通行</view>
					</view>
					
					<u-form-item v-if="sourceType === 'targetInvite'" label="来访单位" prop="visitorCompany" required>
					  <u-input v-model="form.visitorCompany" trim adjust-position :cursor-spacing="4" placeholder="请填写" />
					</u-form-item>
					
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
							width="200rpx" height="200rpx" radius="10rpx"
							style="overflow: hidden;"></u-image>
						<view class="u-delete-icon" @click="deleteItem2">
							<u-icon name="close" size="20" color="#ffffff"></u-icon>
						</view>
					</view>
					<my-upload
						v-if="isShowCertificate && certificateUrl.length === 0"
						ref="uUpload6"
						:multiple="false"
						max-count="1"
						upload-text="上传证件照片"
						:header="fileHeader"
						:action="CodeAction"
						name="file"
						:auto-upload="timestamp > 0 ? true : false"
						:show-progress="showProgress"
						v-model="form.certificateUrl"
						:form-data="{mode:'VISITOR_CERTIFICATE_IMG'}"
						:show-tips="false"
						:show-upload-list="true"
						@on-success="certificateUpload"
						@on-error="maskShow = false"
						:before-upload="beforeUpload"
					></my-upload>
					
					<u-form-item label="来访人员" prop="visitorName" required>
						<u-input v-model.trim="form.visitorName" placeholder="请填写" />
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
					  <u-input disabled disabledColor="#ffffff" v-model="form.visitorCarNum" placeholder="请填写" />
					</u-form-item>
				</my-card>
				
				<my-card :showFoot="false" showHead headBorderBottom>
					<view slot="head">添加携带物品</view>
					<u-form-item label="物品名称">
						<u-input v-model.trim="form.goodsName" placeholder="请填写物品名称" />
					</u-form-item>
					
					<u-form-item label="数量" @click="keyboardNumShow = true">
					  <u-input v-model="form.goodsNum" placeholder="请填写物品数量" disabled disabledColor="#ffffff" />
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
						  :action="goodsAction"
						  :multiple="true"
						  max-count="3"
						  name="file"
						  width="190"
						  :show-progress="showProgress"
						  :header="fileHeader"
						  @on-success="goodsUpload"
						  @on-error="maskShow = false;"
						  :before-upload="beforeUpload"
						  :auto-upload="timestamp > 0 ? true : false"
						></my-upload>
					</view>
				</my-card>
				
				<u-gap height="140" bgColor="#f8f8f8"></u-gap>
			</u-form>
			
			<my-button @click="submit" v-if="timestamp > 0 && visitorState == 8">接受邀约</my-button>
			
			<view v-if="timestamp <= 0 || visitorState != 8" class="u-p-t-30" style="height: 100%;">
				<my-card :showHead="false" :showFoot="false" margin="0 30rpx 30rpx">
					<view class="u-flex u-row-between u-col-center">
						<view>
							<view class="u-font-32 fw700">已生成邀请码</view>
							<view class="red u-m-t-10 u-m-b-10">抱歉，邀请人数已满或邀请已失效</view>
							<view v-if="visitorState == 3">单据已审核通过，请按时到场</view>
							<view v-if="visitorState == 1">单据审核中</view>
							<view v-if="visitorState == 2">单据已撤销</view>
							<view v-if="visitorState == 4">单据已拒绝</view>
							<view v-if="visitorState == 71 || visitorState == 72">单据已超时</view>
						</view>
						<view>
							<u-image 
								src="https://qs.aiwld.com.cn/static/app/linktop.png" 
								width="150rpx" height="150rpx" customStyle="margin: 0 auto;"></u-image>
						</view>
					</view>
				</my-card>
				<view style="min-height: calc(100% - 260rpx);margin: 30rpx;padding: 30rpx;border-radius: 20rpx;background-color: #fff;position: relative;">
					<u-search 
						v-model.trim="visitorCertificateCode" 
						shape="round" :showAction="false" 
						height="70" 
						placeholder="请输入证件编号" focus 
						@search="infoSearch"
						@clear="infoSearch"></u-search>
					<view 
						v-if="!empInfo.visitorCertificateCode" 
						style="position: absolute;top: 50%;left:0;transform: translateY(-50%);width: 100%;text-align: center;">
						<u-image 
							src="https://qs.aiwld.com.cn/static/app/linkbottom.png" 
							width="300rpx" height="300rpx" customStyle="margin: 20rpx auto;"></u-image>
						<view class="u-tips-color" v-if="!isSearch">您可以输入证件编号进行查看填单信息</view>
						<view class="u-tips-color" v-if="isSearch">未查询到结果,请检查证件编号是否输入正确</view>
					</view>
					<view v-else class="u-m-t-40">
						<view class="u-p-l-10 u-m-t-10 u-flex u-row-between">
							<view class="u-flex" style="max-width: calc(100% - 70rpx);">
								<u-avatar 
									:src="staticPrefix + empInfo.visitorImgUrl2" size="100" 
									@click="imgClick(empInfo.visitorImgUrl2)"></u-avatar>
								<view class="u-p-l-20">
								  <view class="u-line-1">{{ empInfo.visitorName }}</view>
								  <view class="u-primary u-m-t-10"> {{ empInfo.visitorPhone }} </view>
								</view>
							</view>
							<view @click="qrcodeShow = true" v-if="empInfo.visitorCardNum">
								<tki-qrcode
									ref="qrcode1" 
									cid="qrcode1"
									:val="empInfo.visitorCardNum" 
									:size="60" 
									:loadMake="true" 
									:onval="true" />
							</view>
						</view>
						<u-cell-group :border="false" class="u-m-t-20">
							<u-cell
								:title="empInfo.certificateType ? empInfo.certificateType+':' : '身份证号:'"
								:border="false"
								:value="empInfo.visitorCertificateCode"></u-cell>
						  <u-cell title="来访公司:" :border="false" :value="empInfo.visitorCompany"></u-cell>
						  <u-cell title="车牌号码:" :border="false" :value="empInfo.visitorCarNum"></u-cell>
							<u-cell v-if="isShowSourceAddr" title="来源地:" :border="false" :value="empInfo.sourceAddress"></u-cell>
						  <u-cell title="携带物品:" :border="false" :value="empInfo.visitorGoods"></u-cell>
							<view class="u-flex u-m-b-10 u-flex-wrap u-p-l-16 u-p-r-16 img_class">
							  <view v-for="v in empInfo.visitorGoodImgs" :key="v" @click="imgClick(v)">
							    <u-image borderRadius="10" width="180rpx" height="180rpx" :src="staticPrefix + v"></u-image>
							  </view>
							</view>
						</u-cell-group>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<u-popup :show="qrcodeShow" mode="center" round="10" width="80%" @close="qrcodeShow = false">
			<my-card margin="0" :border="false" showHead headBorderBottom>
				<template slot="head">
					<view class="u-flex">
						<u-icon name="grid" color="#2979ff"></u-icon>
						<view class="u-flex u-m-l-10 fw700">
							<text>{{ isVisitorQrCode ? '访客码' : '通行码'}}【</text>
							<view class="u-line-1" style="max-width: 70%;">{{ empInfo.visitorName }}</view>
							<text>】</text>
						</view>
					</view>
				</template>
				
				<view style="margin: 50rpx auto;text-align: center;" v-if="qrcodeShow">
					<tki-qrcode
						ref="qrcode2" 
						cid="qrcode2"
						:val="isVisitorQrCode == true ? empInfo.visitorQrCode : empInfo.visitorCardNum" 
						:size="460" 
						:loadMake="true" 
						:onval="true" />
				</view>
					
				<view style="color: #2979ff;text-align: center;font-weight: 700;" class="u-flex u-row-center u-p-b-30">
					<text class="u-m-r-60" @click="isVisitorQrCode = !isVisitorQrCode">{{isVisitorQrCode ? '切换通行码' : '切换访客码'}}</text>
					<!-- #ifdef H5 -->
					<view @click="copyQrcode">复制二维码链接</view>
					<!-- #endif -->
					
					<!-- #ifdef MP-WEIXIN -->
					<button open-type="share" class="u-reset-button u-m-0">分享二维码链接</button>
					<!-- #endif -->
				</view>
			</my-card>
		</u-popup>
		
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
		
		<u-overlay :show="timestamp > 0 ? maskShow : false">
			<view class="w-overlay">正在上传，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import config from '@/config/index.js';
	import { city } from '@/utils/city.js'
	import { details, retinueSubmit } from '../api/approval.js';
	import { inviteEmpSubmit } from '../api/apply.js';
	import uniCopy from '@/components/xb-copy/uni-copy.js'
	import wPicker from "@/components/w-picker/w-picker.vue";
	
	export default {
		components:{ wPicker },
		data() {
			return {
				timestamp:null,
				form:{ visitorCarNum: "", goodsNum:"",visitorCertificateCode:"",visitorName:"",visitorSex:1, note:''},
				imgBase64:"",
				fileHeader:{appId:"",sid:""},
				fileAction: `${config.baseUrl}/iot-wx/visitor/upload/pic?token=`,
				showProgress:true,
				CodeAction:`${config.baseUrl}/iot-wx/commons/upload`,
				keyboardCarShow: false,
				goodsAction:`${config.baseUrl}/iot-wx/visitor/goods/upload/pic?token=`,
				keyboardNumShow:false,
				maskShow:false,
				rules: {
					visitorCompany: [{
						required: true,
						message: '请填写来访单位',
						trigger: 'blur'
					}],
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
						trigger: ['blur','change']
					}]
				},
				visitorNo:"",
				formInfo:{},
				sourceType:"appointment",
				visitorState:"",
				visitorCertificateCode:"",
				empInfo:{visitorGoodImgs:[]},
				isSearch:false,
				staticPrefix:"",
				sourceAdrShow:false,
				sourceAdrDic:city(),
				isShowSourceAddr:false,
				isShowCertificate:false,
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
				dateType:'date',
				certificateUrl:"",
				qrcodeShow:false,
				isVisitorQrCode:true,
			}
		},
		onReady() {
			if(this.sourceType === "appointment"){
			  uni.setNavigationBarTitle({ title:'随行邀约' })
			}else{
				uni.setNavigationBarTitle({ title:'访客邀约' })
			}
		},
		onLoad(option) {
			this.isShowSourceAddr = option.S == 1 ? true : false;
			this.isShowCertificate = option.C == 1 ? true : false;
			this.sourceType = option.T;
			this.visitorNo = option.N || "";
			this.dateType = option.dateType || 'date';
			this.fileHeader.appId = option.appId || "";
			this.fileHeader.sid = option.sid || "";
			this.form.appId = option.appId;
			this.form.sid = option.sid;
			this.initData()
		},
		onShareAppMessage(res){
			let path = `/pageFk/qrcode-link/qrcode-link?id=${this.empInfo.id}&num=${this.visitorNo}&t=${this.dateType}&sid=${this.form.sid}`
			return {
				title: '自定义分享标题',
				path: path,
			}
		},
		methods: {
			copyQrcode(){
				let url = `${config.linkUrl}/#/pageFk/qrcode-link/qrcode-link?id=${this.empInfo.id}&num=${this.visitorNo}&t=${this.dateType}&sid=${this.form.sid}`
				uniCopy({
					content:url,
					success:(res)=>{
						uni.showToast({ title: "复制成功", icon: 'success',duration:3000 })
					},
					error:(e)=>{
						uni.showToast({ title: "复制失败", icon: 'error', duration:3000 })
					}
				})
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
									this.form.visitorCertificateCode = data.data.idCardNo;
									this.form.visitorName = data.data.name;
								}else{
									this.$refs.uToast.show({ message:"解析失败，请重新上传识别！",type: "error" });
								}
							},
						})
					}
				})
			},
			initData(){
				details({visitorNo:this.visitorNo,visitorCertificateCode:this.visitorCertificateCode}).then(r => {
					if(r.data.code === 200){
						let { visitorCompany, visitorArea, visitorTime, levalTime, visitors=[],serverTime,invitationExpireTime, targetEmpName, targetEmpCompany, visitorState, staticPrefix, visitorQrCode,visitorCardNum } = r.data.data;
						this.visitorState = visitorState;
						this.staticPrefix = staticPrefix;
						levalTime = this.dateType === 'date' ? levalTime.substr(0,10) : levalTime.substr(0,16);
						visitorTime = this.dateType === 'date' ? visitorTime.substr(0,10) : visitorTime.substr(0,16);
						let empName = visitors.length ? visitors[0].visitorName : '';
						this.formInfo = { visitorCompany, visitorArea, visitorTime, levalTime, empName, targetEmpName,targetEmpCompany };
						this.timestamp = (new Date(this.iosTransDate(invitationExpireTime)).getTime() - new Date(this.iosTransDate(serverTime)).getTime())/1000;
						
						if(this.timestamp > 0 && visitorState == 8){
							if(this.isShowSourceAddr){
								this.$nextTick(() => {
									this.$refs.uForm.setRules({
										...this.rules,
										sourceAddress: [{
											required:true,
											message: '请选择来源地',
											trigger: ['change', 'blur']
										}]
									})
								})
							}else{
								this.$nextTick(() => this.$refs.uForm.setRules(this.rules))
							}
						}else{
							if(this.visitorCertificateCode){
								this.isSearch = true;
								let item = visitors.length ? visitors[0] : {};
								item.visitorGoodImgs = item.visitorGoodImgs ? item.visitorGoodImgs.split(',') : [];
								item.visitorCompany = item.visitorCompany ? item.visitorCompany : visitorCompany;
								item.visitorQrCode = item.visitorQrCode ? item.visitorQrCode : visitorQrCode;
								item.visitorCardNum = item.visitorCardNum ? item.visitorCardNum : visitorCardNum;
								this.empInfo =  item;
							}
						}
					}
				})
			},
			imgClick(img){
				uni.previewImage({urls:[this.staticPrefix+img]})
			},
			infoSearch(){
				if(this.visitorCertificateCode){
					this.isSearch = true;
					this.initData()
				}
			},
			submit(){
				this.$refs.uForm.validate().then(() => {
					let form = {...this.form};
					if(!this.imgBase64) return this.$refs.uToast.show({ message: '请上传来访人员照片', type: 'warning'});
					if(this.isShowCertificate && !this.certificateUrl) return this.$refs.uToast.show({ message: '请上传证件照', type: 'warning' });
					form.visitorCarNum = form.visitorCarNum ? form.visitorCarNum : ""
					form.visitorImgUrl = this.imgBase64;
					form.certificateUrl = this.certificateUrl;
					form.visitorNo = this.visitorNo;
					
					let imgArr = this.$refs.uUpload4.lists.filter(v => v.progress === 100).map(v => v.response.msg).join(',')
					form.visitorGoodImgs = imgArr;
					form.visitorGoods = '';
					if(form.goodsName){
						form.visitorGoods += form.goodsName;
					}
					if(form.goodsNum){
						form.visitorGoods += ','+form.goodsNum;
					}
					if(form.note){
						form.visitorGoods += ','+form.note;
					}
					let diffTime = Math.ceil((this.timestamp / 60));
					if(this.sourceType === 'appointment'){
						retinueSubmit(form).then(r => {
							this.$refs.uToast.show({ message: r.data.msg, type: 'success'});
							uni.setStorageSync('emp_visitorCertificateCode',form.visitorCertificateCode)
							uni.reLaunch({ url:'../success/success?diffTime='+diffTime })
						}).catch(err => {
							this.$refs.uToast.show({ message: err, type: 'error'});
						})
					}else{
						inviteEmpSubmit(form).then(r => {
							this.$refs.uToast.show({ message: r.data.msg, type: 'success'});
							uni.setStorageSync('emp_visitorCertificateCode',form.visitorCertificateCode)
							uni.reLaunch({ url:'../success/success?diffTime='+diffTime })
						}).catch(err => {
							this.$refs.uToast.show({ message: err, type: 'error'});
						})
					}
				})
			},
			certificateTypeConfirm(e){
				this.form.certificateType = e.name;
			},
			carChange(val) {
				if(this.form.visitorCarNum.length < 9){
					this.form.visitorCarNum += val;
				}
			},
			carBackspace() {
			  if (this.form.visitorCarNum.length) {
			    this.form.visitorCarNum = this.form.visitorCarNum.substr(0, this.form.visitorCarNum.length - 1);
			  }
			},
			sourceAdrConfirm(e){
				// let arr = value.map(v => v.text);
				this.$set(this.form,'sourceAddress',e.value.join('-'));
			},
			goodsNumChange(val) {
			  this.form.goodsNum += val;
			},
			goodsNumBackspace() {
			  if (this.form.goodsNum.length) {
			    this.form.goodsNum = this.form.goodsNum.substr(0, this.form.goodsNum.length - 1);
			  }
			},
			beforeUpload(index, list) {
			  this.maskShow = true;
			  return true;
			},
			fileUpload(data, index, lists, name) {
				this.maskShow = false;
				this.showProgress = false;
			  if (data.code == 200) {
			    this.imgBase64 = data.data.absUrl;
			    this.$refs.uToast.show({ message: '上传成功', type: 'success' });
			  } else {
			    this.$refs.uToast.show({ message: data.msg, type: 'error'
			    });
					this.deleteItem();
			  }
			},
			deleteItem() {
			  this.imgBase64 = '';
			  this.$refs.uUpload.clear();
			},
			goodsUpload(data, index, lists, name){
				this.maskShow = false;
				this.showProgress = false;
				if (data.code == 200) {
				  this.$refs.uToast.show({ message: '上传成功', type: 'success' });
				} else {
				  this.$refs.uToast.show({ message: data.msg, type: 'error' });
				}
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
		}
	}
</script>

<style lang="scss" scoped>
.u-delete-icon {
  position: absolute;
  top: -10rpx;
  right: 6rpx;
  z-index: 10;
  background-color: #fa3534;
  border-radius: 100rpx;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/.u-cell__value {
	color: #303333 !important;
	font-size: 28rpx;
	font-weight: 700;
	text-align: left;
	padding-left: 16rpx;
}
/deep/.u-cell {
	align-items: flex-start;
}
/deep/.u-cell__body{
	padding: 10rpx 16rpx !important;
}
/deep/.u-cell_title {
	font-size: 28rpx;
	width: 120rpx !important;
}
.img_class{
	&>view:nth-child(2){
		margin: 0 calc((100% - 540rpx)/2);
	}
}
.avatar /deep/.u-list-item{
	border-radius: 200rpx !important;
}
</style>
