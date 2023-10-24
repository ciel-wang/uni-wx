<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="searchStyle" v-if="come != 'auditEmpIds' && come != 'details'">
				<view class="searchStyle_first">
					<u-search
						placeholder="请输入学工号/姓名" 
						v-model.trim="moreParamQuery" 
						:showAction="false"
						margin="0 30rpx" 
						height="70" 
						@search="search"
			      @clear="search">
					</u-search>
				</view>
				<view class="searchStyle_last" @click="empTypeShow = true;btnDisplay = 'none'">
					<text class="u-m-r-20 c606266">{{ empTypeLabel }}</text>
					<u-icon name="arrow-down" color="#606266"></u-icon>
			  </view>
			</view>
			
			<view class="title">
				<scroll-view 
					scroll-x 
					style="width: 100%;white-space: nowrap;" 
					:scroll-left="scrollLeft">
					<view class="u-flex">
						<view v-for="(item,index) in breadcrumbList" :key="index">
							<view v-if="index == 0" @click="backTree(item,-1)">
								<text v-if="index == breadcrumbList.length-1" class="none">全部</text>
								<text v-else class="active">全部</text>
							</view>
							<view class="u-flex" @click="backTree(item,index)" v-if="index != 0">
								<u-icon v-if="index != 0" name="arrow-right" color="#D0D4DB" customStyle="margin:0 6px;font-size:14px"></u-icon>
								<text v-if="index == breadcrumbList.length - 1" class="none">{{ item.label }}</text>
								<text v-else class="active">{{ item.label }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			
			<scroll-view 
				style="width: 100%;" :style="{height:come != 'auditEmpIds' && come != 'details' ? 'calc(100% - 107px)' : 'calc(100% - 45px)'}" 
				scroll-y @scrolltolower="scrolltolower">
				<u-empty text="内容为空" mode="data" v-if="deptDataList.length == 0"></u-empty>
				<my-card margin="0" padding="0" v-else>
					<u-cell-group :border="false">
						<u-cell
							v-for="(v,i) in deptDataList" :key="i"
							isLink clickable
							:title="v.label"
							:name="v.value"
							:value="v.count"
							:valueStyle="{'text-align':'left','margin-left':'10rpx'}"
							@click="deptCellClick(v)">
							<template slot="icon">
								<view class="u-m-r-10" v-if="v.empName" @click.stop="checkbox(v,i)">
									<u-icon v-if="v.checked" color="#007AFF" name="xuanzhong" customPrefix="custom-icon" size="44"></u-icon>
									<u-icon color="#b8b8b8" v-else name="weixuanzhong" customPrefix="custom-icon" size="44"></u-icon>
								</view>
							</template>
						</u-cell>
					</u-cell-group>
				</my-card>
			</scroll-view>
		</movable-area>
		
		<my-button @click="submit" :style="{display:btnDisplay}" v-if="deptDataList.length > 0"> 确定 </my-button>
		<u-action-sheet
			:show="empTypeShow" 
			:actions="empTypeList"
			@close="empTypeShow = false"
			@select="empTypeConfirm"></u-action-sheet>
		
		<u-overlay :show="maskShow">
			<view class="w-overlay">查询中，请等待...</view>
		</u-overlay>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { getDeptList, getAuditData, searchEmp, getSchoolData } from "../kq.js"
	export default {
		data() {
			return {
				come:"",
				moreParamQuery:"",
				deptDataList:[],
				breadcrumbList:[1],
				scrollLeft: 999,
				isCheck:true,
				newCheckList:[],
				deptName:"",
				receiptsForm:{},
				current:1,
				pageCount:1,
				loadStatus: "loading",
				isre:false,
				maskShow:false,
				details:{},
        parentId:0,
        schoolId:"",
        gradeId:"",
        classId:"",
        empType:'DEPT',
        empTypeLabel:'教师',
        empTypeList:[
          {value:'DEPT',name:"教师"},{value:"GRADE",name:"学生"}
        ],
        empTypeShow:false,
        btnDisplay:'flex',
        sourceType:""
			}
		},
		onLoad(v) {
			this.current = 1;
			this.pageCount = 1;
			this.deptDataList = [];
			if(v.mykq){
				this.mykq = v.mykq;
			}
      this.sourceType = v.sourceType;
      this.type = v.type;
      this.come = v.come;
      this.receiptsForm = uni.getStorageSync("receiptsForm_key");
      if(v.come=="empId" || v.come=="duplicateEmpIds" || v.come=="together"){
      	if(v.parentId){
      		this.parentId = v.parentId;
      	}else{
      		this.parentId = 0;
      	}
        this.schoolData()
      }else if(v.come == "auditEmpIds"){
      	getAuditData({empId:this.receiptsForm.empId,typeRoleId:this.receiptsForm.typeRoleId}).then(r => {
      		if(r.data.code == 200){
            let auditEmps = r.data.data.auditEmps;
            auditEmps.forEach(v => {
              v.label = v.empName + ' ' + v.empCode
              v.value = v.auditEmpId
            })
      			this.deptDataList = auditEmps;
            this.isChecked()
      		}
      	})
      }else if(v.come == "details"){
      	this.details = JSON.parse(v.form)
      	getAuditData({empId:this.details.empId,typeRoleId:this.details.typeRoleId}).then(r => {
      		if(r.data.code == 200){
            let auditEmps = r.data.data.auditEmps;
            auditEmps.forEach(v => {
              v.label = v.empName + ' ' + v.empCode
              v.value = v.auditEmpId
            })
            this.deptDataList = auditEmps;
            this.isChecked()
      		}
      	})
      }
			if(this.receiptsForm){
				if(v.come == "empId"){
					let f = this.receiptsForm;
					this.newCheckList = [{empName:f.empName,id:f.empId,value:f.empId}]
				}
				if(v.come == "duplicateEmpIds"){
					if(this.receiptsForm.duplicateEmpList){
						this.newCheckList = this.receiptsForm.duplicateEmpList;
					}else{
						this.newCheckList = []
					}
				}
				if(v.come == "together"){
					let f = this.receiptsForm;
					if(f.receiptTogether){
						this.newCheckList = f.receiptTogether;
					}else{
						this.newCheckList = []
					}
				}
				if(v.come == "auditEmpIds"){
					let f = this.receiptsForm;
					this.newCheckList = [{auditEmpName:f.auditEmpName,value:f.auditEmpIds}]
				}
				this.isChecked()
			}else{
				this.receiptsForm = {}
			}
			
		},
		methods: {
      schoolData(){
        this.deptDataList = [];
        getSchoolData().then(r => {
          r.data.data.forEach(v => {
            v.label = v.schoolName
            v.value = v.id
            v.count = v.count || '';
          })
          this.deptDataList = r.data.data;
        })
      },
			submit(){
				if(this.newCheckList.length <= 0){
					this.$refs.uToast.show({ message: "请选择一条数据", type: "error" });
					return;
				}
				let arr = [...this.newCheckList];
				if( this.come == "empId"){
					this.receiptsForm.empName = arr[0].empName
					this.receiptsForm.empId = arr[0].value
					if(arr[0].deptName){
						this.receiptsForm.deptName = arr[0].deptName
					}else{
						this.receiptsForm.deptName = this.deptName
					}
          this.receiptsForm.empType = this.empType == 'DEPT' ? 2 : 1
				}
				if(this.come == "duplicateEmpIds"){
					this.receiptsForm.duplicateEmpList = arr;
					let ids = [];
					arr.forEach(i => {
						ids.push(i.value)
					})
					this.receiptsForm["duplicateEmpIds"] = ids.join(",");
				}
				if(this.come == "together"){
					this.receiptsForm.receiptTogether = arr
				}
				if( this.come == "auditEmpIds"){
					this.receiptsForm.auditEmpName = arr[0].empName
					this.receiptsForm.auditEmpIds = arr[0].auditEmpId
				}
				if(this.come == "details"){
					uni.redirectTo({
						url:`../receiptDetail/receiptDetail?who=${this.details.who}&id=${this.details.id}&form=${JSON.stringify(arr)}`
					})
				}else{
					uni.setStorageSync("receiptsForm_key", this.receiptsForm);
          uni.redirectTo({
          	url:`../leave/leave?type=${this.type}&come=${this.mykq}&sourceType=${this.sourceType}`
          })
				}
			},
			initData(){
				this.deptDataList = [];
				let params = {}
				params["moreParamQuery"] = this.moreParamQuery;
				params["parentId"] = this.parentId;
        params['schoolId'] = this.schoolId;
        params['sourceType'] = this.empType
        params['gradeId'] = this.gradeId;
        params['classId'] = this.classId;
				getDeptList(params).then(r => {
					if(r.data.code == 200){
						let d = r.data.data;
            if(this.empType == 'GRADE'){
              if(d.grades){
                d.grades.forEach(v => {
                  v.label = v.gcName
                  v.value = v.gradeId
                  v.count = v.classCount || 0
                })
                this.deptDataList = d.grades;
              }
              if(d.classs){
                d.classs.forEach(v => {
                  v.label = v.gcName
                  v.value = v.classId
                  v.count = v.empCount || 0
                })
                this.deptDataList = d.classs;
              }
              if(d.emps){
                d.emps.forEach(v => {
                  v.label = v.empName
                  v.value = v.empId
                })
                this.deptDataList = d.emps;
              }
            }else{
              d.depts.forEach(v => {
                v.label = v.deptName
                v.value = v.deptId
                v.count = v.deptEmpCount || 0
              })
              d.emps.forEach(v => {
                v.label = v.empName+ ' ' +v.empCode
                v.value = v.id
              })
              if(!d.depts.length){
              	this.deptDataList = d.emps;
              }
              if(!d.emps.length){
              	this.deptDataList = d.depts;
              }
              if(d.depts.length && d.emps.length){
              	this.deptDataList = d.depts.concat(d.emps);
              }
            }
						console.log(this.deptDataList);
						this.isChecked()
					}
				})
			},
			search(){
				if(this.current == 1){
					this.deptDataList = [];
				}
        let s= this.breadcrumbList.filter(function(item){
          return item.label == "搜索结果"; 
        })
        if(!s.length){
          this.breadcrumbList.push({label:"搜索结果"})
        }
				this.isre = true;
				let params = {}
        params["moreParamQuery"] = this.moreParamQuery;
        params["parentId"] = this.parentId;
        params['schoolId'] = this.schoolId;
        params['sourceType'] = this.empType
        params['gradeId'] = this.gradeId;
        params['classId'] = this.classId;
				params["current"] = this.current;
				params["size"] = 20;
				this.loadStatus = "loading";
				this.maskShow = true;
				searchEmp(params).then(r => {
					this.maskShow = false;
					if(r.data.code == 200){
						let d = r.data.data;
						this.pageCount = d.pages;
						d.records.forEach(v => {
              v.label = v.empName + ' ' +v.empCode
              v.value = v.id
              v.deptName = v.deptName ? v.deptName : v.gradeName + v.className
						})
            this.deptDataList = [...this.deptDataList,...d.records]
						this.isChecked()
					}
				}).catch(err => {
					this.maskShow = false;
					this.$refs.uToast.show({ message: err, type: "error" });
				})
			},
			scrolltolower() {
				if (this.current >= this.pageCount) {
					this.loadStatus = "nomore";
				} else {
					this.current = ++this.current;
					this.search();
				}
			},
			backTree(item, index) {
				let that = this;
				if (index == -1) {
					this.isre = false;
					this.current = 1;
					this.parentId = "";
          this.schoolData()
					that.breadcrumbList.splice(1, 6666)
					this.moreParamQuery = "";
          return;
				}
        this.current = 1;
        that.breadcrumbList.forEach((item, i) => {
          if (i > index) {
            that.breadcrumbList.splice(i, 6666)
          }
        })
        if(item.schoolName){
          this.schoolId = item.id;
          this.gradeId = ""
          this.classId = ""
          this.parentId = 0
          this.initData()
        }
        if(item.gctype == 2){
          this.classId = ""
          this.gradeId = item.gradeId
          this.initData()
        }
			},
			checkbox: function(item, index) {
				var that = this;
				let status = !that.deptDataList[index].checked
				that.$set(that.deptDataList[index], 'checked', status)
				if(this.come == "empId" || this.come == "auditEmpIds" || this.come == "details"){
					that.newCheckList = [that.deptDataList[index]]
					this.deptDataList.forEach((v,i) => {
						if (v.value != this.deptDataList[index].value) {
							that.$set(that.deptDataList[i], 'checked', false)
						}
					})
				}
				if(this.come == "duplicateEmpIds" || this.come == "together"){
					if(status){
						that.newCheckList.push(item);
					}else{
						let arr = [];
						that.newCheckList.forEach(v => {
							if(v.value != item.value){
								arr.push(v)
							}
						})
						that.newCheckList = arr;
					}
				}
			},
			isChecked() {
				let that = this;
				for (var i = 0, len = that.deptDataList.length; i < len; i++) {
					for (var j = 0, lens = that.newCheckList.length; j < lens; j++) {
						if (that.newCheckList[j].value == that.deptDataList[i].value) {
							that.$set(that.deptDataList[i], 'checked', true)
							break
						} else {
							that.$set(that.deptDataList[i], 'checked', false)
						}
					}
				}
			},
			deptCellClick(v){
        if(v.schoolName){
          this.schoolId = v.id;
          if(this.empType == 'DEPT'){
            this.parentId = 0
          }
          this.initData()
        }
        if(v.gctype == 2){
          this.gradeId = v.gradeId
          this.initData()
        }
        if(v.gctype == 1){
          this.classId = v.classId
          this.deptName = v.gcName;
          this.initData()
        }
				if(v.deptId){
          this.deptName = v.deptName;
					this.parentId = v.deptId
					this.initData()
				}
				if(!v.empName){
					this.breadcrumbList.push(v)
				}
			},
			backClick(){
				if(this.come == "details"){
					uni.redirectTo({ url:`../receiptDetail/receiptDetail?id=${this.details.id}&who=${this.details.who}` })
				}else{
					uni.redirectTo({ url:`../leave/leave?type=${this.type}&sourceType=${this.sourceType}` })
				}
			},
      empTypeConfirm(val){
        this.empType = val.value
        this.empTypeLabel = val.name
        this.breadcrumbList = [1]
        this.schoolData()
        this.btnDisplay = 'flex'
      }
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-cell-item-box{
		margin: 30rpx;
	}
	.title {
		height: 45px;
		padding: 0 16px;
		line-height: 45px;
		font-size: 15px;
		background-color: #fff;
		color: #606064;
		
		.iconclass {
			display: inline-block;
			margin: 0 6px;
			color: #D0D4DB;
			font-size: 14px;
		}
	}
	.inline-item {
		display: inline-block
	}
	.item+.item::before{
		content: "<";
		display: block;
	}
	.none {
		color: #666666;
	}
	.txt {
		font-size: 22px;
		line-height: 18px;
		width: 100%;
		height: 100%;
		display: flex;
	}
</style>
