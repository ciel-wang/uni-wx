<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<!-- 切换周月日期 -->
				<my-card padding="20rpx" margin="0" border-radius="0" :showHead="false">
					<view class="u-flex u-row-between">
						<view class="u-flex">
							<button 
								class="btn" 
								@click="weekClick" 
								:disabled="btnDisabled"
								:type="activeBtn == 1 ? 'primary' : ''" 
								style="border-radius: 8rpx 0 0 8rpx;">周</button>
							<button 
								class="btn" 
								@click="monthClick" 
								:disabled="btnDisabled"
								:type="activeBtn == 2 ? 'primary' : ''" 
								style="border-radius: 0 8rpx 8rpx 0;">月</button>
						</view>
						
						<view class="u-flex">
							<u-icon name="arrow-left" @click="pre"></u-icon>
							
							<text class="u-p-30" v-show="activeBtn == 1">{{week}}</text>
							<text class="u-p-30" v-show="activeBtn == 2">{{month}}</text>
							
							<u-icon name="arrow-right" @click="next"></u-icon>
						</view>
					</view>
				</my-card>
				
				<!-- 个人信息部分 -->
				<my-card padding="20rpx" margin="20rpx 0" border-radius="0" :showHead="false">
					<view class="u-flex">
						<u-avatar :src="vuex_useInfo.faceUrl" size="120" ></u-avatar>
						<view class="u-m-l-20 u-flex u-row-between u-width-74">
							<view>{{vuex_useInfo.empName}}</view>
							<view style="color: #1FBCB5;" @click="backClick"><u-icon name="order"></u-icon>打卡日历</view>
						</view>
					</view>
				</my-card>
				
				<my-card margin="20rpx 0" border-radius="0" :showHead="false" :bodyStyle="{padding:'20rpx'}">
					<u-collapse>
						<u-collapse-item disabled :border="false" title="出勤天数" :value="form.cqDays+'天'"></u-collapse-item>
					</u-collapse>
					
					<u-collapse ref="formRef">
						<u-collapse-item :border="false" title="应出勤班次" :value="form.classessCount+'个'">
							<view v-for="(v,i) in form.classess" :key="i">
								{{v.classesTimeName}} <text class="u-m-l-20">出勤{{v.count}}次</text>
							</view>
						</u-collapse-item>
						
						<u-collapse-item :disabled="!form.xxDays" :border="false" title="休息天数" :value="form.xxDays && form.xxDays.length+'天'">
							<view v-for="(v,i) in form.xxDays" :key="i">
								{{v.dayDate}}<text class="u-m-l-20">{{v.week}}</text>
							</view>
						</u-collapse-item>
						
						<u-collapse-item 
							:disabled="!form.cdzttimeMinute" :border="false" 
							title="迟到早退" :value="form.cdzttimeMinute+'分钟'"></u-collapse-item>
						
						<view class="item_class">
							<u-collapse-item :border="false" title="缺卡" :value="form.lackCount+'次'">
								<ren-calendar
									ref='qkRef' 
									:markDays='lackCardDays' 
									:collapsible="false" 
									:headerBar='false' 
									:disabledAfter="true" 
									:weekstart="1" 
									@onDayClick='lackCardDayClick'></ren-calendar>
							</u-collapse-item>
						</view>
						
						<view class="item_class">
							<u-collapse-item
								:border="false" title="旷工" 
								:value="form.absenteeismMinute && (form.absenteeismMinute/60).toFixed(2)+'小时'">
								<ren-calendar 
									ref='qkRef1' 
									:markDays='absenteeismDays' 
									:collapsible="false" 
									:headerBar='false' 
									:disabledAfter="true" 
									:weekstart="1"></ren-calendar>
							</u-collapse-item>
						</view>
						
						<u-collapse-item :disabled="!form.ccMinute" :border="false" title="出差" :value="form.ccMinute && (form.ccMinute/60).toFixed(2)+'小时'">
							<view v-for="(v,i) in form.ccArr" :key="i">
								<text>{{v.dayDate}}</text>
								<text class="u-m-l-20 u-m-r-20">{{v.week}}</text>
								<text>{{(v.minute/60).toFixed(2)}}小时</text>
							</view>
						</u-collapse-item>
						
						<u-collapse-item :disabled="!form.qjMinute" :border="false" title="请假" :value="form.qjMinute && (form.qjMinute/60).toFixed(2)+'小时'">
							<view v-for="(v,i) in form.qjArr" :key="i">
								<text>{{v.dayDate}}</text>
								<text class="u-m-l-20 u-m-r-20">{{v.week}}</text>
								<text>{{(v.minute/60).toFixed(2)}}小时</text>
							</view>
						</u-collapse-item>
						
						<u-collapse-item :disabled="!form.jbMinute" :border="false" title="加班" :value="form.jbMinute && (form.jbMinute/60).toFixed(2)+'小时'">
							<view v-for="(v,i) in form.jbArr" :key="i">
								<text>{{v.dayDate}}</text>
								<text class="u-m-l-20 u-m-r-20">{{v.week}}</text>
								<text>{{(v.minute/60).toFixed(2)}}小时</text>
							</view>
						</u-collapse-item>
					</u-collapse>
				</my-card>
			</scroll-view>
		</movable-area>
	</view>
</template>

<script>
	import renCalendar from '../components/ren-calendar/ren-calendar.vue'
	import { summaryData } from "../kq.js"
	
	export default {
		components:{ renCalendar },
		data() {
			return {
				activeBtn:2,
				form:{xxDays:[],absenteeismMinute:0,ccMinute:0,qjMinute:0,jbMinute:0,cqDays:0},
				month:"",
				week:"",
				nowDay:"",
				absenteeismDays:[],
				lackCardDays:[],
				absenteeismList:[],
				options:{},
				btnDisabled:false
			}
		},
		onLoad(options) {
			this.options = options;
			this.month = uni.$u.timeFormat(new Date(this.iosTransDate(options.date)), 'yyyy.mm')
			this.nowDay = new Date();
		},
		onReady() {
			this.monthClick(this.options.date)
		},
		methods: {
			lackCardDayClick(v){
				uni.redirectTo({ url:`../mykq/mykq?date=${v.date}&come=details` })
			},
			initData(){
				this.btnDisabled = true;
				let params = {}
				params["dayStartDateStr"] = this.days[0];
				params["dayEndDateStr"] = this.activeBtn == 1 ? this.days[1] : '';
				summaryData(params).then(r => {
					this.btnDisabled = false;
					if(r.data.code == 200){
						let d = r.data.data;
						let arr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
						d.xxDays.forEach(v => {
							let days = new Date(this.iosTransDate(v.dayDate))
							v.day = days.getMonth()+1 + '.' + days.getDate();
							v.week = arr[new Date(this.iosTransDate(v.dayDate)).getDay()]
						})
						d.ccMinute = 0;
						d.ccArr.forEach(v => {
							let days = new Date(this.iosTransDate(v.dayDate))
							v.day = days.getMonth()+1 + '.' + days.getDate();
							v.week = arr[new Date(this.iosTransDate(v.dayDate)).getDay()]
							d.ccMinute += v.minute;
						})
						d.qjMinute = 0;
						d.qjArr.forEach(v => {
							let days = new Date(this.iosTransDate(v.dayDate))
							v.day = days.getMonth()+1 + '.' + days.getDate();
							v.week = arr[new Date(this.iosTransDate(v.dayDate)).getDay()]
							d.qjMinute += v.minute;
						})
						d.jbMinute = 0;
						d.jbArr.forEach(v => {
							let days = new Date(this.iosTransDate(v.dayDate))
							v.day = days.getMonth()+1 + '.' + days.getDate();
							v.week = arr[new Date(this.iosTransDate(v.dayDate)).getDay()]
							d.jbMinute += v.minute;
						})
						this.form = d;
						this.lackCardDays = r.data.data.qkDays;
						this.absenteeismDays = r.data.data.absenteeismDays;
						
						this.$nextTick(function(){
							this.$refs.formRef.init();
						})
					}else{
						this.form = {}
					}
				}).catch(() => this.btnDisabled = false)
			},
			monthClick(date){
				if(this.btnDisabled) return;
				date = this.options.date;
				this.activeBtn = 2;
				this.month = uni.$u.timeFormat(new Date(this.iosTransDate(date)), 'yyyy.mm');
				let v = uni.$u.timeFormat(new Date(this.iosTransDate(date)), 'yyyy-mm');
				let y = new Date(this.iosTransDate(date)).getFullYear();
				let m = new Date(this.iosTransDate(date)).getMonth()
				this.$refs.qkRef.changYearMonth(y,m+1);
				this.$refs.qkRef1.changYearMonth(y,m+1);
				this.getMonthData(v)
			},
			// 点击上个月或上一周
			pre(){
				if(this.btnDisabled) return;
				if(this.activeBtn == 2){
					let m = this.changeMonth(this.month,'minu');
					this.month = uni.$u.timeFormat(m, 'yyyy.mm');
					let v = uni.$u.timeFormat(m, 'yyyy-mm')
					this.getMonthData(v)
				}else{
					let w = this.changeWeek(this.nowDay,'minu');
					this.getWeekData(w)
				}
			},
			// 点击下个月或下一周
			next(){
				if(this.btnDisabled) return;
				if(this.activeBtn == 2){
					let m = this.changeMonth(this.month,'add');
					this.month = uni.$u.timeFormat(m, 'yyyy.mm');
					let v = uni.$u.timeFormat(m, 'yyyy-mm')
					this.getMonthData(v)
				}else{
					let w = this.changeWeek(this.nowDay,'add');
					this.getWeekData(w)
				}
			},
			getMonthData(v){
				let dayStartDateStr = v + '-01';
				let dayEndDateStr = v + '-01';
				this.days = [dayStartDateStr,dayEndDateStr];
				this.initData();
			},
			// 改变月时
			changeMonth(v,j){
				let date = new Date(this.iosTransDate(v));
				let y = date.getFullYear();
				let m = date.getMonth();
				let d = date.getDate();
				if(j == "add"){
					this.$refs.qkRef.changYearMonth(y,m+2);
					this.$refs.qkRef1.changYearMonth(y,m+2);
					return new Date(y,m+1,d);
				}else{
					this.$refs.qkRef.changYearMonth(y,m);
					this.$refs.qkRef1.changYearMonth(y,m);
					return new Date(y,m-1,d);
				}
			},
			// 初始化当前周日期
			getWeek(v){
				let date = new Date(v);
				let diff = 24*60*60*1000;
				let week = date.getDay();
				let start = date.getTime() - (week-1)*diff;
				let end = date.getTime() + (7-week)*diff;
				return [start,end]
			},
			weekClick(){
				if(this.btnDisabled) return;
				this.activeBtn = 1;
				let w = this.getWeek(new Date());
				this.getWeekData(w)
			},
			getWeekData(w){
				let s = uni.$u.timeFormat(w[0],'mm.dd');
				let e = uni.$u.timeFormat(w[1],'mm.dd');
				this.week = s +' - ' + e;
				let dayStartDateStr = uni.$u.timeFormat(w[0],'yyyy-mm-dd');
				let dayEndDateStr = uni.$u.timeFormat(w[1],'yyyy-mm-dd');
				this.days = [dayStartDateStr,dayEndDateStr];
				this.initData();
			},
			// 改变周日期时
			changeWeek(v,j){
				let date = new Date(this.iosTransDate(v));
				let diff = 24*60*60*1000;
				let week = date.getDay();
				let start = date.getTime() - (week-1)*diff;
				let end = date.getTime() + (7-week)*diff;
				if(j == "add"){
					this.nowDay = new Date(date.getTime() + 7*diff);
					return [start+7*diff,end+7*diff]
				}else{
					this.nowDay = new Date(date.getTime() - 7*diff);
					return [start-7*diff,end-7*diff]
				}
			},		
			backClick(){
				uni.redirectTo({ url:"../mykq/mykq" })
			}
		}
	}
</script>

<style lang="scss" scoped>
/deep/.u-cell__title-text{ color:#606266 !important;}
/deep/.u-cell__value{ color: #303133 !important;}
	
/deep/.u-cell__right-icon-wrap--down /deep/.u-icon__icon{ font-size: 24rpx !important;}
.item_class /deep/.u-cell__value{ color: #f00 !important;}
.btn{
	width: 140rpx;
	height: 70rpx;
	line-height: 68rpx;
	border-radius: 0;
	border: 1rpx solid #007AFF;
	margin: 0;
	padding: 0;
	font-size: 30rpx;
}
/deep/.u-collapse-content{padding: 5px !important;}
</style>
