<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<u-form :model="form" ref="uForm" :border-bottom="false" label-width="200">
				<my-card :showFoot="false" :showHead="false" margin="0 30rpx">
					<u-form-item label="人数" prop="visitorPersonCount" required @click="keyboardNumShow = true">
						<u-input 
							:value="visitorPersonCount" 
							v-model="form.visitorPersonCount" 
							:placeholder="`最大可填${visitorMaxEmpNum}人`"
							input-align="right" 
							disabled disabledColor="#ffffff" />
					</u-form-item>
					
					<u-form-item label="邀请有效时长" prop="invitationMinuteExpire" required @click="invitationMinuteExpireShow = true">
						<u-icon slot="right" name="edit-pen"></u-icon>
						<u-input 
							v-model="form.invitationMinuteExpireLabel" 
							disabled disabledColor="#ffffff" placeholder="请选择" 
							input-align="right" />
					</u-form-item>
				</my-card>
			</u-form>
		</movable-area>
		
		<my-button @click="handleSubmit">生成邀请码</my-button>
		
		<u-action-sheet
			:show="invitationMinuteExpireShow" 
			:actions="invitationMinuteExpireList"
			title="请选择邀请有效时长"
			@close="invitationMinuteExpireShow = false"
			@select="invitationMinuteExpireConfirm"></u-action-sheet>
		<u-keyboard
		  ref="uKeyboard" 
		  mode="number"
		  :show="keyboardNumShow"
		  @change="visitorPersonCountChange" 
		  @backspace="visitorPersonCountBackspace"
			@cancel="keyboardNumShow = false"
			@confirm="keyboardNumShow = false"></u-keyboard>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在提交，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { submit } from '../api/apply.js';
	
	export default {
		data() {
			return {
				form:{visitorPersonCount:'',invitationMinuteExpire:''},
				keyboardNumShow:false,
				visitorPersonCount:"",
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
				rules: {
					visitorPersonCount:[{
						required: true,
						message: '请输入人数',
						trigger: ['blur','change']
					}],
					invitationMinuteExpire:[{
						required: true,
						message: '请选择邀请有效时长',
					}]
				},
				applyForm:{},
				maskShow:false,
				visitorMaxEmpNum:99,
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(option) {
			this.dateType = option.dateType || "datetime";
			this.applyForm = uni.getStorageSync('applyForm_key');
			let visitorMaxEmpNum = option.visitorMaxEmpNum || 99;
			this.visitorMaxEmpNum = visitorMaxEmpNum - this.applyForm.visitForm.length + 1;
			this.form.invitationMinuteExpireLabel = "离访时间"
			this.form.invitationMinuteExpire = 0;
		},
		methods: {
			handleSubmit(){
				this.$refs.uForm.validate().then(() => {
					let form = {...this.applyForm,...this.form};
					if(this.dateType === 'datetime'){
						form.visitorTime = form.visitorTime + ':00';
						form.levalTime = form.levalTime + ':00';
					}
					form.visitors = [...form.visitForm];
					form.visitorPersonCount = form.visitorPersonCount*1 + form.visitForm.length - 1;
					this.maskShow = true;
					submit(form).then(res => {
						this.maskShow = false;
						uni.removeStorageSync('applyForm_key');
						uni.removeStorageSync('goodsHistory_key');
						this.$refs.uToast.show({ message: res.data.msg, type: 'success' });
						setTimeout(() => {
						  this.$u.route('/pageFk/retinue-details/retinue-details',{visitorNo:res.data.data.visitorNo})
						}, 3000);
					}).catch(err => {
						this.maskShow = false;
						this.$refs.uToast.show({ message: err, type: 'error', icon: false });
					});
				})
			},
			invitationMinuteExpireConfirm(e){
				this.form.invitationMinuteExpireLabel = e.name
				this.form.invitationMinuteExpire = e.value;
			},
			visitorPersonCountChange(val) {
				let s = this.visitorPersonCount + val;
				if(s*1 <= this.visitorMaxEmpNum){
					this.visitorPersonCount += val;
					this.form.visitorPersonCount = this.visitorPersonCount;
				}
			},
			visitorPersonCountBackspace() {
			  if (this.visitorPersonCount.length) {
			    this.visitorPersonCount = this.visitorPersonCount.substr(0, this.visitorPersonCount.length - 1);
			    this.form.visitorPersonCount = this.visitorPersonCount;
			  }
			},
			backClick(){
				uni.navigateBack({ delta:1 })
			},
		}
	}
</script>
