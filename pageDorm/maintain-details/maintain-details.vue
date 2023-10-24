<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
      <scroll-view scroll-y style="height: 100%;width: 100%;">
        <my-card margin="0 20rpx">
          <view slot="head" class="u-flex u-row-between fw700 u-font-32" style="position: relative;">
            <text>单号：{{obj.repairCode}}</text>
            <u-icon style="position: absolute;top: -10rpx;right: -30rpx;" :name="stateIcon" :color="stateColor" custom-prefix="custom-icon" size="60"></u-icon>
          </view>
					
          <view class="u-p-t-8 u-p-b-8">{{obj.createTime}} 提交维修申请</view>
          <u-cell-group :border="false">
            <u-cell title="提交人:" :border="false" :value="obj.repairEmpName"></u-cell>
            <u-cell title="宿舍编号:" :border="false" :value="obj.repairNum"></u-cell>
            <u-cell title="期望处理时间:" :border="false" :value="obj.repairDateTime && obj.repairDateTime.substr(0,16)"></u-cell>
            <u-cell title="报修物品:" :border="false" :value="obj.repairContent"></u-cell>
            <u-cell title="备注:" :border="false" :value="obj.repairRemark"></u-cell>
            <view class="u-flex u-m-b-10 u-flex-wrap">
              <view v-for="(v,i) in Imgs" :key="i" class="u-m-r-10" @click="imgClick(v)">
                <u-image width="200rpx" height="200rpx" :src="v"></u-image>
              </view>
            </view>
          </u-cell-group>
        </my-card>
        
        <my-card :showFoot="false" :showHead="false" margin="20rpx" v-if="obj.repairStatus == 5">
          <u-cell-group :border="false">
            <u-cell title="是否恶意损坏:" :border="false" :value="obj.handlingIsSpite ? '是' : '否'"></u-cell>
            <u-cell title="处理意见:" :border="false" :value="obj.handlingRemark"></u-cell>
            <u-cell title="费用:" :border="false" :value="obj.handlingCost"></u-cell>
            <u-cell title="是否收款:" :border="false" :value="obj.costStatus ? '已结算' : '未结算'"></u-cell>
          </u-cell-group>
        </my-card>
        
        <view>
          <visit-my-button stype="even" @click="annulAgainClick" v-if="obj.repairStatus == 1">
            <template v-slot:left> <text>撤销</text> </template>
            <text>重新提交</text>
          </visit-my-button>
          
          <visit-my-button stype="even" @click="agreeRefuseClick" v-if="obj.repairStatus == 1 && obj.isAuth">
            <template v-slot:left> <text>拒绝</text> </template>
            <text>同意</text>
          </visit-my-button>
          
          <visit-my-button @click="handleSuggestion" v-if="obj.repairStatus == 3 && obj.isAuth">处理意见</visit-my-button>
        </view>
        
        <u-popup :show="popupShow" mode="bottom" @open="popupOpen">
					<view class="u-p-30">
						<u-form :model="form" ref="uForm" :labelWidth="140">
						  <u-form-item label="是否恶意损坏" :labelWidth="180">
						    <u-radio-group v-model="form.handlingIsSpite" style="height: 70rpx;">
						      <u-radio v-for="(item, index) in isDamageArr" :key="index" :name="item.value">
						        {{ item.label }}
						      </u-radio>
						    </u-radio-group>
						  </u-form-item>
						  <u-form-item label="处理意见" required prop="handlingRemark">
								<u-textarea v-model="form.handlingRemark" maxlength="290" border="none" placeholder="请输入处理意见" ></u-textarea>
						  </u-form-item>
						  <u-form-item label="费用" prop="handlingCost">
						    <u-input v-model="form.handlingCost" type="number" maxlength="99999999" />
						  </u-form-item>
						</u-form>
					</view>
          
          <view class="u-p-30 u-p-t-60 btn u-text-center">
            <u-button size="medium">生成收费码</u-button>
            <u-button type="primary" size="medium" class="u-m-r-20 u-m-l-20" @click="submit">保存</u-button>
            <u-button size="medium" @click="handleClose">取消</u-button>
          </view>
        </u-popup>
				
				<u-overlay :show="maskShow">
					<view class="w-overlay">正在提交，请等待...</view>
				</u-overlay>
        <u-toast ref="uToast" />
      </scroll-view>
    </movable-area>
  </view>
</template>

<script>
  import { getRecordsDetails, cancel, reject, agree, finish,repeat } from '../api/maintain.js'
  
  export default {
    data() {
      return {
        stateIcon:"",
        stateColor:"",
        Imgs:[],
        isDamageArr:[
          {value:1,label:"是"},{value:0,label:"否"}
        ],
        popupShow:false,
        form:{ handlingIsSpite:'', handlingRemark:'', handlingCost:'' },
        rules: {
          handlingRemark:[{
						required: true,
						message: '请填写处理意见',
						trigger: 'blur'
					}],
          handlingCost:[{
						required:false,
						validator: (rule, value, callback) => {
							return this.$u.test.amount(value);
						},
						message:'费用最多保留两位小数',
						trigger:'blur'
					}]
        },
        id:"",
        obj:{},
        maskShow:false
      }
    },
    onLoad(options) {
      this.id = options.id;
      getRecordsDetails({id:options.id}).then(r => {
        if(r.data.code == 200){
          let d = r.data.data;
          this.obj = d
          this.Imgs = d.repairImgs.length ? d.repairImgs.split(',') : [];
          if(d.repairStatus == 1){
            this.stateIcon = "daichuli"
            this.stateColor = "#F6AE17"
          }else if(d.repairStatus == 2){
            this.stateIcon = "yichexiao"
            this.stateColor = "#B5B5B5"
          }else if(d.repairStatus == 3){
            this.stateIcon = "chulizhong"
            this.stateColor = "#466805"
          }else if(d.repairStatus == 4){
            this.stateIcon = "yijujue"
            this.stateColor = "#FF1800"
          }else if(d.repairStatus == 5){
            this.stateIcon = "yichuli"
            this.stateColor = "#6B85F2"
          }
        }
      })
    },
    methods: {
      submit(){
        this.$refs.uForm.validate(valid => {
          if (valid) {
            this.maskShow = true;
            this.form['id'] = this.id;
            finish(this.form).then(r => {
              this.maskShow = false
              this.handleData(r,true)
            })
          }
        })
      },
      handleClose(){
        this.$refs.uForm.resetFields();
        this.popupShow = false
      },
      popupOpen() {
        this.$refs.uForm.setRules(this.rules);
      },
      annulAgainClick(val){
        this.maskShow = true;
        if(val == 'left'){
          cancel({id:this.id}).then(r => {
            this.maskShow = false
            this.handleData(r)
          }).catch(err => {
            this.maskShow = false
            this.$refs.uToast.show({ message: err, type: 'error' });
          })
        }else{
          repeat({id:this.id}).then(r => {
            this.maskShow = false
            this.handleData(r)
          }).catch(err => {
            this.maskShow = false
            this.$refs.uToast.show({ message: err, type: 'error' });
          })
        }
      },
      agreeRefuseClick(val){
        this.maskShow = true;
        if(val == 'left'){
          reject({id:this.id}).then(r => {
            this.maskShow = false
            this.handleData(r)
          }).catch(err => {
            this.maskShow = false
            this.$refs.uToast.show({ message: err, type: 'error' });
          })
        }else{
          agree({id:this.id}).then(r => {
            this.maskShow = false
            this.handleData(r)
          }).catch(err => {
            this.maskShow = false
            this.$refs.uToast.show({ message: err, type: 'error' });
          })
        }
      },
      handleData(r,type){
        if(r.data.code == 200){
          this.$refs.uToast.show({ message: r.data.msg, type: 'success' });
          setTimeout(() => {
            if(type){
              this.handleClose()
            }
            this.backlevel()
          },4000)
        }else{
          this.$refs.uToast.show({ message: r.data.msg, type: 'error' });
        }
      },
      handleSuggestion(){
        this.popupShow = true;
        this.form.handlingIsSpite = 0
        this.form.handlingCost = '0.00'
      },
      imgClick(url){
        uni.previewImage({ current: url, urls: this.Imgs });
      },
      backClick(){
        uni.redirectTo({ url:'../maintain-records/maintain-records' })
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/.u-cell{
  padding: 8rpx 0;
}
.btn /deep/.u-size-medium{
  padding: 0 60rpx;
}
/deep/.u-cell__value{
  color: #606266;
}
/deep/.u-cell{
  color: #909399;
	align-items: flex-start;
}
/deep/.u-form-item__body{
	align-items: flex-start !important;
}
</style>
