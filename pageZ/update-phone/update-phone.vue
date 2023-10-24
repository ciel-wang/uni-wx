<template>
  <view>
    <movable-area style="width: calc(100% - 60rpx);height: 100%;margin-left: 30rpx;">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      <view class="u-p-t-80 u-m-b-30" style="color: #C8C9CC;">
        更换手机号后，下次登录可使用新手机号登录。
        <view>当前手机号：{{phone}}</view>
      </view>
      
      <view class="u-p-l-20 u-p-r-20 u-m-t-80">
				<u-form :model="form" ref="uForm">
				  <u-form-item prop="phone" label-width="0">
				    <u-input placeholder="请输入手机号" v-model="form.phone" type="number"></u-input>
				  </u-form-item>
				  <u-form-item prop="code" label-width="0">
				    <u-input placeholder="请输入验证码" v-model="form.code" type="text"></u-input>
				    <u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
				  </u-form-item>
				</u-form>
			</view>
      
      <u-button type="primary" shape="circle" :loading="loading" @click="submit" customStyle="margin-top:180rpx;">更换手机号</u-button>
      <u-code seconds="60" ref="uCode" keepRunning @change="codeChange"></u-code>

      
      <u-toast ref="uToast" />
    </movable-area>
  </view>
</template>

<script>
  import { getPhoneCode, sendPhone } from '@/api/home/home.js'
  export default {
    data() {
      return {
        phone:"",
        form:{},
        rules:{
          phone: [{
						required: true,
						message: '请输入手机号',
						trigger: ['change','blur'],
					},{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						trigger: ['change','blur'],
					}],
          code: [{
						required: true,
						message: '请输入验证码',
						trigger: ['change','blur'],
					},{
						type: 'number',
						message: '验证码只能为数字',
						trigger: ['change','blur'],
					}],
        },
        codeTips: '',
        loading:false
      }
    },
    onReady() {
      this.$refs.uForm.setRules(this.rules);
    },
    onLoad(val) {
      this.phone = val.phone;
      this.form.empId = val.empId
    },
    methods: {
      submit(){
        this.$refs.uForm.validate(valid => {
          if(valid){
            this.loading = true
            sendPhone(this.form).then(r => {
              this.loading = false
							this.$refs.uToast.show({ title: r.data.msg, type: "success" });
							setTimeout(() => {
								uni.redirectTo({ url:"/pages/home/personal/personal" })
							},2000)
            }).catch(err => {
							this.$refs.uToast.show({ title:err, type: "error" });
              this.loading = false
            })
          }
        })
      },
      codeChange(text) {
        this.codeTips = text;
      },
      getCode(){
        if(this.$refs.uCode.canGetCode) {
          uni.showLoading({ title: '正在获取验证码', mask: true })
          getPhoneCode({phone:this.form.phone,smsCodeType:'UPDATE_PHONE'}).then(r => {
            uni.hideLoading();
						this.$u.toast('验证码已发送');
						this.$refs.uCode.start();
          }).catch(() => {
						this.$refs.uToast.show({ message: r.data.msg, type: "error" });
            uni.hideLoading();
          })
        } else {
          this.$u.toast('倒计时结束后再发送');
        }
      },
      backClick(){
        this.$u.route({ type:'redirectTo', url:'/pages/home/personal/personal' })
      }
    }
  }
</script>
