<template>
  <view>
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      
      <scroll-view scroll-y style="width: 100%;height: calc(100% - 67px);">
        <u-form :model="form" ref="uForm" :border-bottom="false" label-width="140">
          <my-card>
						<view class="fw700 u-m-b-30 u-main-color">车辆号牌</view>
						<view class="u-width-100 u-flex u-row-center" @click="plateNumShow = true">
							<u-code-input v-model="plateNum" mode="box" size="60" :maxlength="8" :fontSize="26" disabledKeyboard focus cus></u-code-input>
						</view>
						<view class="u-font-20 u-text-right u-m-r-30">新能源</view>
					</my-card>
          
					<my-card showHead headBorderBottom>
						<template slot="head">基础信息</template>
						<u-form-item label="车牌颜色" @click="handlerSelect('plateNumColor')">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						  <u-input 
						    disabled disabledColor="#ffffff"
						    input-align="right" 
						    v-model="form.plateNumColorN" 
						    placeholder="请选择车牌颜色" ></u-input>
						</u-form-item>
						
						<u-form-item label="车辆颜色" prop="carColor">
							<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						  <u-input 
						    input-align="right" 
						    v-model="form.carColor" 
						    placeholder="请输入车辆颜色"></u-input>
						</u-form-item>
						
						<u-form-item label="车型类型" @click="handlerSelect('carShape')">
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						  <u-input 
						    disabled disabledColor="#ffffff"
						    input-align="right" 
						    v-model="form.carShapeN" 
						    placeholder="请选择车型类型" ></u-input>
						</u-form-item>
					</my-card>
						
					<my-card padding="10rpx 0">
						<u-collapse :border="false">
						  <u-collapse-item title="运输车附加信息" border>
						    <u-form-item label="运输量(吨)" label-width="160">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        type="number"
						        v-model="form.freightVolume" 
						        placeholder="请输入运输量(吨)"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="排放阶段" @click="handlerSelect('carEmissionStandard')">
									<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						      <u-input 
						        disabled disabledColor="#ffffff"
						        input-align="right" 
						        v-model="form.carEmissionStandardN" 
						        placeholder="请选择排放阶段" ></u-input>
						    </u-form-item>
						    
						    <u-form-item label="发动机号">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        v-model="form.engineNum" 
						        placeholder="请输入发动机号"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="行驶证">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        v-model="form.drivingPermit" 
						        placeholder="请输入行驶证"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="车辆识别代码(VIN)" label-width="260">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        v-model="form.carRecognitionNum" 
						        placeholder="请输入车辆识别代码(VIN)"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="注册时间" @click="registerTimeShow = true">
									<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						      <u-input 
						        disabled disabledColor="#ffffff"
						        input-align="right" 
						        v-model="form.registerTime" 
						        placeholder="请选择注册时间"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="运输货物名称" label-width="180">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        v-model="form.goodsName" 
						        placeholder="请输入运输货物名称"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="车队名称">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        v-model="form.carMotorcadeName" 
						        placeholder="请输入车队名称"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="环保登记(管理)号" label-width="240">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        v-model="form.environmentalAdminNum" 
						        placeholder="请输入环保登记(管理)号"></u-input>
						    </u-form-item>
						    
						    <u-form-item label="">
									<u-checkbox-group v-model="form.checkboxValue1" size="38" iconSize="30">
										<u-checkbox name="isCarExistObd" label="加装OBD" :labelSize="30" labelColor="#303133" customStyle="margin-right:20rpx;"></u-checkbox>
										<u-checkbox name="isCarInside" label="场内车辆" :labelSize="30" labelColor="#303133"></u-checkbox>
									</u-checkbox-group>
						    </u-form-item>
						    
						    <u-form-item label="燃油类型"  @click="handlerSelect('fuelOliType')">
									<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						      <u-input 
						        disabled disabledColor="#ffffff"
						        input-align="right" 
						        v-model="form.fuelOliTypeN" 
						        placeholder="请选择燃油类型" ></u-input>
						    </u-form-item>
						    
						    <u-form-item label="核载重量(吨)" label-width="180">
									<u-icon slot="right" name="edit-pen" color="#c0c4cc"></u-icon>
						      <u-input 
						        input-align="right" 
						        type="number"
						        v-model="form.loadWeight" 
						        placeholder="请输入核载重量(吨)"></u-input>
						    </u-form-item>
						    
						  </u-collapse-item>
						</u-collapse>
					</my-card>
        </u-form>
      </scroll-view>
      
			<my-button @click="submit" :loading="loading">提交</my-button>
			
			<u-datetime-picker 
				:show="registerTimeShow" mode="datetime" 
				:minDate="0" :value="new Date().getTime()"
				:maxDate="new Date().getTime()"
				itemHeight="88"
				@confirm="registerTimeConfim" 
				@cancel="registerTimeShow = false"></u-datetime-picker>
			<u-action-sheet
				:show="actionSheetShow" 
				:actions="actionSheetData"
				:title="actionSheetTitle"
				@close="actionSheetShow = false"
				@select="actionSheetChange"></u-action-sheet>
			<u-keyboard
			  ref="uKeyboard" 
			  mode="car" autoChange
			  :show="plateNumShow"
			  @change="plateNumChange" 
			  @backspace="backspace"
				@cancel="plateNumShow = false"
				@confirm="plateNumShow = false"></u-keyboard>
			
      <u-toast ref="uToast" />
    </movable-area>
  </view>
</template>

<script>
  import { formatterValue } from '@/utils/my_function.js'
  import { addPlatenum, updatePlatenum, getCarDetails, getCfg, getCarShape } from'@/api/home/home.js'
  export default {
    data() {
      return {
        value:"",
        loading:false,
        form:{},
        plateNumShow:false,
        plateNum:"",
        plateNumColorList:[],
        carShapeList:[],
        carEmissionStandardDic:[],
        fuelOliTypeDic:[],
        registerTimeShow:false,
				
				actionSheetShow:false,
				actionSheetData:[],
				actionSheetTitle:'',
        sourceType:'add',
				id:""
      }
    },
    onLoad(options) {
      this.sourceType = options.type;
      if(options.id) this.id = options.id;
			this.initData()
    },
    methods: {
			async initData(){
				await getCfg({code:'carPlateNumColor##carEmissionStandard##carFuelOliType'}).then(r => {
					let d = r.data.data;
					this.carEmissionStandardDic = d.carEmissionStandard && d.carEmissionStandard.map(item =>({value:item.key,name:item.value})) || [];
					this.fuelOliTypeDic = d.carFuelOliType && d.carFuelOliType.map(item => ({value:item.key,name:item.value})) || [];
					this.plateNumColorList = d.carPlateNumColor && d.carPlateNumColor.map(item => ({value:item.key,name:item.value})) || [];
				})
				await getCarShape().then(r => {
					let arr = r.data.data.map(v => ({value:v.id,name:v.shapeName}))
					this.carShapeList = arr;
				})
				if(this.id){
					await getCarDetails({id:this.id}).then(r => {
					  let d = r.data.data;
					  let {carColor,id,plateNum,plateNumColor,carShapeId} = {...d}
					  this.form = {...d.carExt,carColor,id,plateNum,plateNumColor,carShapeId}
					  this.plateNum = d.plateNum;
					  this.form.plateNumColorN = formatterValue(plateNumColor,this.plateNumColorList)
					  this.form.carShapeN = formatterValue(carShapeId,this.carShapeList)
					  this.form.carEmissionStandardN = formatterValue(d.carExt.carEmissionStandard,this.carEmissionStandardDic)
					  this.form.fuelOliTypeN = formatterValue(d.carExt.fuelOliType,this.fuelOliTypeDic)
					})
				}
			},
      submit(){
        if(!this.$u.test.carNo(this.plateNum)){
          this.$refs.uToast.show({ message:"请输入正确的车牌号", type:"warning" })
          return;
        }
        this.loading = true;
        if(this.sourceType === 'add'){
          addPlatenum(this.form).then(res => {
            this.loading = false;
						this.$refs.uToast.show({ message: res.data.msg, type: "success" });
						setTimeout(() => {
							uni.redirectTo({ url:"/pages/home/personal/personal" })
						},2000)
          }).catch(err => {
						this.$refs.uToast.show({ message: err, type: "error" });
            this.loading = false
          })
        }else{
          updatePlatenum(this.form).then(res => {
            this.loading = false;
						this.$refs.uToast.show({ message: res.data.msg, type: "success" });
						setTimeout(() => {
							uni.redirectTo({ url:"/pages/home/personal/personal" })
						},2000)
          }).catch(err => {
						this.$refs.uToast.show({ message: err, type: "error" });
            this.loading = false
          })
        }
      },
      plateNumChange(val){
        if(this.plateNum.length < 8){
          this.plateNum += val;
          this.form.plateNum = this.plateNum;
        }
      },
      backspace() {
        if(this.plateNum.length) this.plateNum = this.plateNum.substr(0, this.plateNum.length - 1);
        this.form.plateNum = this.plateNum;
      },
			handlerSelect(type){
				if(type === 'plateNumColor'){
					this.actionSheetTitle = "请选择车牌颜色";
					this.actionSheetData = this.plateNumColorList;
				}
				if(type === 'carShape'){
					this.actionSheetTitle = "请选择车型类型";
					this.actionSheetData = this.carShapeList;
				}
				if(type === 'carEmissionStandard'){
					this.actionSheetTitle = "请选择排放阶段";
					this.actionSheetData = this.carEmissionStandardDic;
				}
				if(type === 'fuelOliType'){
					this.actionSheetTitle = "请选择燃油类型";
					this.actionSheetData = this.fuelOliTypeDic;
				}
				this.selectType = type;
				this.actionSheetShow = true;
			},
			actionSheetChange(e){
				this.form[this.selectType+'N'] = e.name;
				this.form[this.selectType] = e.value
			},
      registerTimeConfim({ value }){
        this.form.registerTime = this.$u.timeFormat(value,'yyyy-mm-dd hh:MM:ss');
				this.registerTimeShow = false;
      },
      backClick(){
        this.$u.route({ type:'redirectTo', url:'/pages/home/personal/personal' })
      }
    }
  }
</script>

<style lang="scss">
/deep/.u-char-flex{
  justify-content: space-between;
}
/deep/.u-char-item{
  margin: 8rpx;
}
</style>
