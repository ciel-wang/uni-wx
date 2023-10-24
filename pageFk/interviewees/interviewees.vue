<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      <scroll-view scroll-y style="height: calc(100% - 67px);width: 100%;">
				<u-gap height="30" bgColor="#f8f8f8"></u-gap>
				
        <my-card :showFoot="false" showHead head-border-bottom margin="0 20rpx 20rpx">
					<view slot="head" class="u-font-32 u-main-color">添加被访人员</view>
          <u-form :model="form" ref="uForm" :border-bottom="false" label-width="120">
          	<u-form-item label="电话" prop="targetVisitorEmpPhone" required>
          	  <u-input v-model.trim="form.targetVisitorEmpPhone" :maxlength="11" type="number" placeholder="请填写电话" />
          	</u-form-item>
          	
            <u-form-item label="姓名">
              <u-input v-model="form.targetVisitorEmpName" disabled disabledColor="#ffffff" placeholder="自动填写" />
            </u-form-item>
          </u-form>
        </my-card>

        <view v-if="intervieweesHistory.length > 0">
          <view class="u-m-l-40 u-m-b-10">历史被访员工</view>
					<u-swipe-action>
						<u-swipe-action-item 
							v-for="(item, index) in intervieweesHistory" :key="item.targetVisitorEmpPhone"
							:options="options"
							@click="swipeClick($event,index)">
							<view class="u-p-30 u-line-1" @click="swipeContentClick(index)">
							  <text class="u-m-r-20">{{ item.targetVisitorEmpName }}</text>
							  <text>{{ item.targetVisitorEmpPhone }}</text>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
        </view>
      </scroll-view>
    </movable-area>
		
		<my-button @click="submit" :disabled="btnDisabled">确定</my-button>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在提交，请等待...</view>
		</u-overlay>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { exist } from '../api/apply.js';
export default {
  data() {
    return {
      form: {targetVisitorEmpPhone:"",targetVisitorEmpName:""},
      rules: {
        targetVisitorEmpPhone: [{
					validator: (rule, value, callback) => {
						return this.$u.test.mobile(value);
					},
					message: '手机号码不正确',
					trigger: ['change', 'blur']
				}]
      },
      intervieweesHistory: [],
      applyForm: {},
      options: [{ text: '删除', style: { backgroundColor: '#dd524d', width: '150rpx' } }],
      maskShow: false,
			btnDisabled:true
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad() {
    if (uni.getStorageSync('intervieweesHistory_key')) {
      this.intervieweesHistory = uni.getStorageSync('intervieweesHistory_key');
    }
    if (uni.getStorageSync('applyForm_key')) {
      this.applyForm = uni.getStorageSync('applyForm_key');
    }
  },
	watch:{
		'form.targetVisitorEmpPhone':{
			immediate: true,
			deep:true,
			handler(val){
				if(val && val.length === 11){
					exist({targetVisitorEmpPhone:val}).then(res => {
						this.btnDisabled = false;
						let d = res.data.data;
						this.form.targetVisitorEmpName = d.empName;
					}).catch(err => {
						this.btnDisabled = true;
						this.$refs.uToast.show({ message: err, type: 'error' });
					})
				}
			}
		}
	},
  methods: {
    swipeClick(e,index) {
      if (e.index == 0) {
        this.intervieweesHistory.splice(index, 1);
        uni.setStorage({ key: 'intervieweesHistory_key', data: this.intervieweesHistory });
      }
    },
    swipeContentClick(index) {
      let item = this.intervieweesHistory[index];
			this.form.targetVisitorEmpPhone = item.targetVisitorEmpPhone;
    },
    submit() {
      this.$refs.uForm.validate().then(() => {
				this.maskShow = true;
				let form = {...this.form};
				form.show = false;
				let intervieweesExist = this.intervieweesHistory.filter(item => item.targetVisitorEmpPhone != form.targetVisitorEmpPhone)
				intervieweesExist.unshift(form)
				this.intervieweesHistory = [...intervieweesExist];
				if (this.intervieweesHistory.length >= 10) {
					this.intervieweesHistory.splice(this.intervieweesHistory.length - 1, 1);
				}
				uni.setStorage({ key: 'intervieweesHistory_key', data: this.intervieweesHistory });
				this.applyForm.targetVisitorEmpPhone = form.targetVisitorEmpPhone;
				this.applyForm.targetVisitorEmpName = form.targetVisitorEmpName;
				uni.setStorage({ key: 'applyForm_key', data: this.applyForm });
				this.backClick()
			});
    },
		backClick() {
		  uni.redirectTo({ url: '../apply/apply' });
		},
  }
};
</script>
