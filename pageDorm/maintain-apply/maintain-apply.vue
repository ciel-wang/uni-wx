<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
      <u-form :model="form" ref="uForm" :border-bottom="false" label-width="200">
        <my-card margin="0 20rpx">
          <u-form-item label="提交人:" prop="repairEmpName" left-icon="account" :leftIconStyle="{'font-size':'34rpx'}">
						<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
            <u-input v-model="form.repairEmpName" maxlength="10" placeholder="请填写" input-align="right" />
          </u-form-item>
					
          <u-form-item label="报修楼栋:" prop="floorName" left-icon="home" :leftIconStyle="{'font-size':'34rpx'}" @click="floorIdArrShow = true">
						<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
            <u-input v-model="form.floorName" disabled disabledColor="#ffffff" placeholder="请选择报修楼栋" input-align="right" />
          </u-form-item>
					
          <u-form-item label="报修宿舍:" prop="reapirNum" left-icon="home" :leftIconStyle="{'font-size':'34rpx'}">
						<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
            <u-input v-model="form.reapirNum" maxlength="32" placeholder="请填写报修宿舍" input-align="right" />
          </u-form-item>
        </my-card>
        
        <my-card :bodyStyle="{padding:'0 30rpx 30rpx'}">
          <u-form-item
            label="期望处理时间:" labelWidth="250" 
            prop="repairDateTime" 
            left-icon="calendar" :leftIconStyle="{'font-size':'34rpx'}"
						@click="repairDateTimeShow = true">
						<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
            <u-input v-model="form.repairDateTime" placeholder="请填写" input-align="right" disabled disabledColor="#ffffff" />
          </u-form-item>
          
          <u-form-item label="报修物品:" prop="repairContent" left-icon="grid" :leftIconStyle="{'font-size':'34rpx'}">
						<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
            <u-input v-model="form.repairContent" maxlength="100" placeholder="请填写报修物品" input-align="right" />
          </u-form-item>
					
          <u-form-item label="照片:" prop="repairImgs" left-icon="grid" labelPosition="top" :leftIconStyle="{'font-size':'34rpx'}">
            <my-upload
              ref="uUpload"
              :action="action"
              multiple maxCount="3"
              name="file" width="190" auto-upload
              :show-progress="showProgress"
              :header="{
								appId:vuex_urlobj.appId,
								token:vuex_urlobj.token,
								sid:vuex_urlobj.sid
							}"
              @on-success="fileUpload"
              @on-error="fileError"
              :before-upload="beforeUpload"
              :beforeRemove="beforeRemove"
            ></my-upload>
          </u-form-item>
          
          <u-form-item label="备注:" labelWidth="130" left-icon="tags" :leftIconStyle="{'font-size':'34rpx'}">
						<u-textarea v-model="form.repairRemark" maxlength="100" border="none" placeholder="给维修师傅留下您的手机号以及具体描述下损坏问题吧..." ></u-textarea>
          </u-form-item>
        </my-card>
      </u-form>
      
      <my-button @click="submit">提交</my-button>
    </movable-area>
		
		<u-datetime-picker
			:show="repairDateTimeShow" mode="datetime" 
			:minDate="new Date().getTime()"
			itemHeight="88"
			@confirm="repairDateTimeConfirm" 
			@cancel="repairDateTimeShow = false"></u-datetime-picker>
		<w-picker
		  :visible.sync="floorIdArrShow"
		  mode="linkage"
		  :options="floorIdArr"
		  :level="2"
			:defaultProps="{label:'name',value:'valueStr',children:'children'}"
		  default-type="value"
		  @confirm="floorConfirm"
		  ref="myPickerRef" ></w-picker>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">正在{{maskTip}}，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
  </view>
</template>

<script>
  import config from '@/config/index.js';
  import { getFloorZtree, submit } from '../api/maintain.js'
  import { deleteEmptyArr } from '@/utils/my_function.js'
	import wPicker from "@/components/w-picker/w-picker.vue";
  
  export default {
		components:{ wPicker },
    data() {
      return {
        form:{ repairEmpName:'', floorName:'', reapirNum:"", repairContent:'', repairDateTime:''},
        action: `${config.baseUrl}/iot-wx/dorm/repair/upload`,
        fileList:[],
        showProgress:true,
        maskTip:"上传",
        maskShow:false,
        rules: {
          repairEmpName: [{
						required: true,
						message: '请填写提交人',
						trigger: 'blur'
					}],
          floorName: [{
						required: true,
						message: '请选择报修楼栋',
						trigger: 'change'
					}],
          reapirNum: [{
						required: true,
						message: '请填写报修宿舍',
						trigger: 'blur'
					}],
          repairContent:[{
            required: true,
            message: '请填写报修物品',
            trigger: 'blur'
          }],
          repairDateTime:[{
            required: true,
            message: '请选择期望处理日期',
            trigger: 'change'
          }]
        },
        floorIdArrShow:false,
        floorIdArr:[],
        repairDateTimeShow:false
      }
    },
    onReady() {
      this.$refs.uForm.setRules(this.rules);
    },
    onLoad() {
      getFloorZtree().then(r => {
        let arr = deleteEmptyArr(r.data.data,1)
        this.floorIdArr = arr;
      })
    },
    methods: {
      submit(){
        this.$refs.uForm.validate().then(() => {
					this.maskTip = "提交"
					this.maskShow = true;
					let form = {...this.form};
					form.repairImgs = this.fileList.length ? this.fileList.join(',') : '';
					form.repairDateTime = form.repairDateTime + ':59';
					submit(form).then(r => {
					  this.maskShow = false;
						this.$refs.uToast.show({ message: r.data.msg, type: 'success', isTab:true,url:'/pages/index/index' });
					}).catch(err => {
						this.maskShow = false;
						this.$refs.uToast.show({ message: err, type: 'error' });
					})
				})
      },
      repairDateTimeConfirm({ value }){
				this.form.repairDateTime = uni.$u.timeFormat(value,'yyyy-mm-dd hh:MM');
				this.repairDateTimeShow = false;
      },
      floorConfirm(e){
				this.form.floorName = e.result;
				this.form.floorId = e.value[1].split('-')[0]
      },
      fileUpload(data, index, lists, name) {
        if (data.code == 200) {
          this.maskShow = false;
          this.fileList.push(data.msg)
          this.$refs.uToast.show({ message: '上传成功', type: 'success' });
        } else {
          this.maskShow = false;
          this.$refs.uToast.show({ message: '上传失败，请重试！', type: 'error' });
        }
        this.maskShow = false;
        this.showProgress = false;
      },
      beforeRemove(index, lists) {
        this.fileList.splice(index, 1);
      },
      beforeUpload(index, list) {
        this.maskShow = true;
        this.maskTip = "上传"
        return true;
      },
      fileError(res, index, lists, name) {
        this.maskShow = false;
      },
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
</script>