<template>
  <view style="height: 100%;background: url(https://qs.aiwld.com.cn/static/app/loginbg.png) no-repeat;background-size: 100%;">
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="loginTop">
				<u-gap height="188"></u-gap>
				<view style="position: absolute;top: 84rpx;left: 108rpx;z-index: 100;">
					<u--image src="https://qs.aiwld.com.cn/static/app/loginimg.png" width="640rpx" height="322rpx"></u--image>
				</view>
				
				<view class="fw700 u-font-40 u-m-l-60">Hello！</view>
				<view class="u-font-28 u-m-t-10 u-m-l-60">欢迎使用智慧校园系统</view>
			</view>
			
			<view class="bgfff login_form">
				<view class="u-flex u-m-b-70">
					<u--image :src="slogo" shape="circle" width="88rpx" height="88rpx"></u--image>
					<view class="u-font-40 u-m-l-30 u-line-1 fw700" @click="schoolChange">{{ schoolName || '请选择学校'}}</view>
				</view>
				
				<view class="u-p-14">
					<u-form :model="form" ref="uForm" :label-width="150">
					  <u-form-item label="身份" prop="empTypeLabel" @click="actionSheetShow = true">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
					    <u-input v-model="form.empTypeLabel" placeholder="请选择身份" disabled disabledColor="#ffffff" input-align="right" />
					  </u-form-item>
						<u-form-item label="学生姓名" prop="stuName" v-if="form.bindEmpType == 3">
						  <u-input v-model="form.stuName" placeholder="请输入学生姓名" input-align="right" />
						</u-form-item>
						<u-form-item label="身份证号" prop="empCode" v-if="form.bindEmpType == 3">
						  <u-input v-model="form.empCode" placeholder="请输入学生身份证号" input-align="right" />
						</u-form-item>
						<u-form-item label="家长姓名" prop="empName"  v-if="form.bindEmpType == 3">
						  <u-input v-model="form.empName" placeholder="请输入姓名" input-align="right" />
						</u-form-item>
						<u-form-item label="姓名" prop="empName" v-else>
						  <u-input v-model="form.empName" placeholder="请输入姓名" input-align="right" />
						</u-form-item>
						<u-form-item label="身份证号" prop="empCode" v-if="form.bindEmpType == 1">
						  <u-input v-model="form.empCode" placeholder="请输入学生身份证号" input-align="right" />
						</u-form-item>
						<u-form-item label="手机号码" prop="empPhone" v-if="form.bindEmpType != 1" >
						  <u-input v-model="form.empPhone" placeholder="请输入手机号码" input-align="right" />
						</u-form-item>
					</u-form>
				</view>
			</view>
		</movable-area>
    
    <my-button @click="submit" :disabled="btnDisabled" v-if="!btnDisabled">登录</my-button>
		
		<u-popup
			:show="selectSchoolShow" 
			closeable round="10" customStyle="padding:30rpx 20rpx;" 
			@close="selectSchoolShow = false">
			<view class="u-m-b-30 u-text-center">学校选择</view>
			<u-search placeholder="输入学校名称查询" v-model.trim="schoolName" height="70rpx" :showAction="false" :searchIconSize="44"></u-search>
			<u-list height="600rpx" customStyle="margin-top:20rpx;">
				<u-list-item v-for="(item, index) in schoolList" :key="item.sid">
					<u-cell :title="item.sname" @click="schoolListClick(item)" :icon="item.slog"></u-cell>
				</u-list-item>
			</u-list>
		</u-popup>
		
		<u-action-sheet
			:show="actionSheetShow" 
			:actions="actionSheetData"
			title="请选择身份"
			@close="actionSheetShow = false"
			@select="actionSheetChange"></u-action-sheet>
			
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在提交，请等待...</view>
		</u-overlay>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
  import { register, getMunuAuth, getSchoolList } from '@/api/common/index.js'
  import { userInfo } from '@/api/home/home.js'
  
  export default {
    data() {
      return {
				slogo:"",
				schoolName:"",
				selectSchoolShow:false,
				schoolList:[],
        form:{ bindEmpType:"", empTypeLabel:"", empName:"", empPhone:"",stuName:"", empCode:"" },
        rules:{
          empName:[{
            required: true,
            message: '请输入姓名',
            trigger: ['blur'],
          }],
          empPhone:[{
            required: true,
            message: '请输入手机号码',
            trigger: ['blur'],
          },{
            validator: (rule, value, callback) => {
              return this.$u.test.mobile(value);;
            },
            message: '手机号码不正确',
            trigger: ['blur'],
          }],
          empTypeLabel:[{
            required: true,
            message: '请选择身份',
            trigger: ['blur'],
          }],
					stuName:[{
						required: true,
						message: '请输入学生姓名',
						trigger: ['blur'],
					}],
					empCode:[{
						required: true,
						message: '请输入学生身份证号',
						trigger: ['blur'],
					}]
        },
        maskShow:false,
				btnDisabled:false,
				actionSheetShow:false,
				actionSheetData:[
					{ value:1,name:"学生" },
					{ value:2,name:"教职工" },
					{ value:3,name:"家长" }
				]
      }
    },
		onLoad() {
			getSchoolList().then(r => {
				let d = r.data.data;
				this.schoolList = d;
				if(this.vuex_urlobj.sid){
					let item = d.filter(v => v.sid == this.vuex_urlobj.sid);
					this.schoolName = item.length && item[0].sname || '';
					this.slogo = item.length && item[0].slogo || '';
				}
				if(!this.schoolName && d.length === 1){
					let { sname, sid, slogo } = d[0];
					this.schoolName = sname;
					this.slogo = slogo;
					this.$u.vuex('vuex_urlobj.sid', sid);
				}
			})
		},
    onReady() {
      this.$refs.uForm.setRules(this.rules);
    },
    methods: {
      submit(){
        this.$refs.uForm.validate().then(() => {
					// #ifdef MP-WEIXIN
					wx.getUserProfile({
						desc: '用于完善基础资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
						success: (res) => {
							console.log(res);
						},
						fail(err) {
							console.log(err);
						}
					})
					// #endif
					
					// #ifdef H5
					this.form.appType = 1;
					// #endif
					// #ifdef MP-WEIXIN
					this.form.appType = 2;
					// #endif
					this.maskShow = true;
					this.btnDisabled = true;
					register(this.form).then(r => {
						this.maskShow = false;
						if(r.data.code == 200){
							this.$refs.uToast.show({ message: '注册成功！', type: "success",duration:3000 });
							let d = r.data.data;
							this.$u.vuex('vuex_urlobj.token', d.token);
							this.$u.vuex('vuex_urlobj.isBind', 1);
							this.$u.vuex('vuex_urlobj.bindId', d.bindWxInfo.empId + '_' +  d.bindWxInfo.bindEmpType);
							this.$u.vuex('vuex_urlobj.bindEmpType', d.bindWxInfo.bindEmpType);
							this.$u.vuex('vuex_urlobj.bindWxId', d.bindWxInfo.id);
							// getMunuAuth().then(r => {
							// 	this.$u.vuex('vxe_menuAuth',r.data.data)
							// })
							// userInfo().then(r => {
							// 	let d = r.data.data;
							// 	this.$u.vuex('vuex_useInfo', d);
							// })
							setTimeout(() => {
								// #ifdef H5
								let href = window.location.href;
								href = href.replace(/isBind=0/g, 'isBind=1&token='+d.token);
								href = href.replace(/pages\/login\/login/g, 'pages/index/index');
								location.href = href;
								// #endif
								
								// #ifdef MP-WEIXIN
								uni.switchTab({ url:'/pages/index/index' })
								// #endif
							},3000)
						}
					}).catch(err => {
						this.$refs.uToast.show({ message: err, type: "error" });
						this.maskShow = false;
						this.btnDisabled = false;
					})
				});
      },
			schoolListClick(item){
				let { sname, sid, slogo } = item;
				this.schoolName = sname;
				this.slogo = slogo;
				uni.removeStorageSync('vuex_cfg');
				uni.removeStorageSync('vuex_useInfo');
				uni.removeStorageSync('vuex_menuAuth');
				this.$u.vuex('vuex_urlobj.sid', sid);
				this.selectSchoolShow = false;
			},
			schoolChange(){
				if(this.schoolList.length === 1) return;
				this.selectSchoolShow = true;
			},
			actionSheetChange(e){
				this.form.empTypeLabel = e.name;
				this.form.bindEmpType = e.value;
				this.$set(this.form,'bindEmpType',e.value)
			},
			backClick(){
				uni.switchTab({ url:'/pages/index/index' })
			}
    }
  }
</script>

<style lang="scss" scoped>
  .loginTop{
    position: relative;
		padding-bottom: 44rpx;
  }
	.login_form{
		border-radius: 80rpx 80rpx 0px 0px;padding: 52rpx 34rpx;position: absolute;top: 342rpx;bottom: 0;left: 0;right: 0;
	}
</style>