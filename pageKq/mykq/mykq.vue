<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
			<movable-view direction="all" :out-of-bounds="false">
				<u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
			</movable-view>
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<my-card padding="0" margin="0rpx" border-radius="0" :show-head="false">
					<zzx-calendar
						ref="calRef" 
						:dayModeClass="['mydayModeClass']"
						@selected-change="change" 
						:dotList="dotList" 
						@days-change="daysChange"></zzx-calendar>
					<view class="u-p-10 u-p-l-30 u-p-b-20">
						<view v-show="form.dayMode == 1 && form.classesTimeName">
							<view class="u-flex">
								<text style="font-weight: 700;color: #303133;">
									规则：</text> {{form.classesTimeName}}
								<text v-show="form.startWorkTime1" class="u-m-r-6 u-m-l-6">
									{{form.workTime1s}}-{{form.workTime1e}}
								</text>
								<text v-show="form.startWorkTime2">
									{{form.workTime2s}}-{{form.workTime2e}}
								</text>
								<text v-show="form.startWorkTime3" class="u-m-l-6">
									{{form.workTime3s}}-{{form.workTime3e}}
								</text>
							</view>
							<view>共{{form.cardCount}}次卡，工时{{form.predictWorktimeMinute && (form.predictWorktimeMinute/60).toFixed(2) || 0}}小时</view>
						</view>
						
						<view v-show="form.dayMode == 2" style="font-weight: 700;color: #303133;">规则：休息</view>
						<view v-show="form.dayMode == 1 && !form.classesTimeName" style="font-weight: 700;color: #303133;">规则：空班</view>
						<view v-if="form.dayMode == 3" style="font-weight: 700;color: #303133;">规则：{{curHolidayN}}</view>
					</view>
				</my-card>
				
				<my-card 
					v-show="form.dayMode == 1 && form.classesTimeName && flag" 
					padding="20rpx" margin="20rpx 0" border-radius="0" :show-head="false">
					<view class="u-p-l-30" v-if="form.dayMode != 2">
						<my-time-axis nodeTop="-2" v-if="mode1s && form.start1">
							<template v-slot:content>
								<view>
									<view>上班 
										<text v-if="new Date().getTime()<new Date(form.start1).getTime() && !form.timestep1SworkTime" class="u-m-l-10">
											未打卡
										</text>
										<text v-if="new Date().getTime()>new Date(form.start1).getTime() && !form.timestep1SworkTime" class="u-m-l-10">
											缺卡
										</text>
									</view>
									<view>{{form.timestep1SworkTime}}</view>
									<view
										v-if="new Date().getTime()>new Date(form.start1).getTime() && !form.timestep1SworkTime"
										class="bkbtn_class u-m-t-10"
										@click="handleReissuecard(form.start1)">补卡申请</view>
								</view>
							</template>
						</my-time-axis>
						<my-time-axis nodeTop="-2" v-if="new Date().getTime()>new Date(form.start1).getTime() && mode1e && form.end1">
							<template v-slot:content>
								<view>
									<view>下班 
										<text v-if="new Date().getTime() < new Date(form.end1).getTime() && !form.timestep1EworkTime" class="u-m-l-10">
											未打卡
										</text>
										<text v-if="new Date().getTime() > new Date(form.end1).getTime() && !form.timestep1EworkTime" class="u-m-l-10">
											缺卡
										</text>
									</view>
									<view>{{form.timestep1EworkTime}}</view>
									<view
										v-if="new Date().getTime() > new Date(form.end1).getTime() && !form.timestep1EworkTime"
										class="bkbtn_class u-m-t-10"
										@click="handleReissuecard(form.end1)">补卡申请</view>
								</view>
							</template>
						</my-time-axis>
						
						<!-- 时段2 -->
						<my-time-axis nodeTop="-2" v-if="new Date().getTime()>new Date(form.end1).getTime() && mode2s && form.start2">
							<template v-slot:content>
								<view>
									<view>上班 
										<text v-if="new Date().getTime()<new Date(form.start2).getTime() && !form.timestep2SworkTime" class="u-m-l-10">
											未打卡
										</text>
										<text v-if="new Date().getTime()>new Date(form.start2).getTime() && !form.timestep2SworkTime" class="u-m-l-10">
											缺卡
										</text>
									</view>
									<view>{{form.timestep2SworkTime}}</view>
									<view
										v-if="new Date().getTime()>new Date(form.start2).getTime() && !form.timestep2SworkTime"
										class="bkbtn_class u-m-t-10"
										@click="handleReissuecard(form.start2)">补卡申请</view>
								</view>
							</template>
						</my-time-axis>
						<my-time-axis nodeTop="-2" v-if="new Date().getTime()>new Date(form.start2).getTime() && mode2e && form.end2">
							<template v-slot:content>
								<view>
									<view>下班 
										<text v-if="new Date().getTime() < new Date(form.end2).getTime() && !form.timestep2EworkTime" class="u-m-l-10">
											未打卡
										</text>
										<text v-if="new Date().getTime() > new Date(form.end2).getTime() && !form.timestep2EworkTime" class="u-m-l-10">
											缺卡
										</text>
									</view>
									<view>{{form.timestep2EworkTime}}</view>
									<view
										v-if="new Date().getTime() > new Date(form.end2).getTime() && !form.timestep2EworkTime"
										class="bkbtn_class u-m-t-10"
										@click="handleReissuecard(form.end2)">补卡申请</view>
								</view>
							</template>
						</my-time-axis>
						
						<!-- 时段3 -->
						<my-time-axis nodeTop="-2" v-if="new Date().getTime()>new Date(form.end2).getTime() && mode3s && form.start3">
							<template v-slot:content>
								<view>
									<view>上班 
										<text v-if="new Date().getTime()<new Date(form.start3).getTime() && !form.timestep3SworkTime" class="u-m-l-10">
											未打卡
										</text>
										<text v-if="new Date().getTime()>new Date(form.start3).getTime() && !form.timestep3SworkTime" class="u-m-l-10">
											缺卡
										</text>
									</view>
									<view>{{form.timestep3SworkTime}}</view>
									<view
										v-if="new Date().getTime()>new Date(form.start3).getTime() && !form.timestep3SworkTime"
										class="bkbtn_class u-m-t-10"
										@click="handleReissuecard(form.start3)">补卡申请</view>
								</view>
							</template>
						</my-time-axis>
						<my-time-axis nodeTop="-2" v-if="new Date().getTime()>new Date(form.start3).getTime() && mode3e && form.end3">
							<template v-slot:content>
								<view>
									<view>下班 
										<text v-if="new Date().getTime() < new Date(form.end1).getTime() && !form.timestep3EworkTime" class="u-m-l-10">
											未打卡
										</text>
										<text v-if="new Date().getTime() > new Date(form.end1).getTime() && !form.timestep3EworkTime" class="u-m-l-10">
											缺卡
										</text>
									</view>
									<view>{{form.timestep3EworkTime}}</view>
									<view
										v-if="new Date().getTime()>new Date(form.end1).getTime() && !form.timestep3EworkTime"
										class="bkbtn_class u-m-t-10"
										@click="handleReissuecard(form.end3)">补卡申请</view>
								</view>
							</template>
						</my-time-axis>
					</view>
				</my-card>
				
				<my-card 
					padding="20rpx" margin="20rpx 0" border-radius="0" title="申请记录" :headStyle="{'font-weight':700}"
					v-show="form.qjArr.length > 0 || form.ccArr.length > 0 || form.jbArr.length > 0">
					<view class="u-relative">
						<view v-if="form.qjArr.length > 0">
							<view class="mincircle"></view>
							<text class="u-m-l-20 f700">请假</text>
							<u-cell-group :border="false">
								<u-cell
									v-for="(v,i) in form.qjArr" :key="i"
									:border="false"
									:title="`${v.typeRoleName} | ${v.startTime && v.startTime.substr(0,16)} 至 ${v.endTime && v.endTime.substr(0,16)}`"
									@click="cellClick(v)">
								</u-cell>
							</u-cell-group>
						</view>
						
						<view v-if="form.ccArr.length > 0">
							<view class="mincircle"></view>
							<text class="u-m-l-20 f600">出差</text>
							<u-cell-group :border="false">
								<u-cell
									v-for="(v,i) in form.ccArr" :key="i" 
									:border="false"
									:title="`${v.typeRoleName} | ${v.startTime && v.startTime.substr(0,16)} 至 ${v.endTime && v.endTime.substr(0,16)}`"
									@click="cellClick(v)">
								</u-cell>
							</u-cell-group>
						</view>
						
						<view v-if="form.jbArr.length > 0">
							<view class="mincircle"></view>
							<text class="u-m-l-20 f600">加班</text>
							<u-cell-group :border="false">
								<u-cell 
									v-for="(v,i) in form.jbArr" :key="i" 
									:border="false"
									:title="`${v.typeRoleName} | ${v.dayDate}【${(v.dayMinute/60).toFixed(2)}H】`"
									@click="cellClick(v)">
								</u-cell>
							</u-cell-group>
						</view>
					</view>
				</my-card>
				
				<my-card 
					padding="20rpx" margin="20rpx 0" 
					border-radius="0" :headStyle="{'font-weight':700}" 
					@click="handleSummary" showHead>
					<view slot="head" class="u-flex u-row-between">
						<view>{{title}}</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
					
					<view class="u-flex u-text-center u-row-around">
						<view>
							<view>{{summaryData.cdzttimeMinute}}min</view>迟到早退
						</view>
						<view>
							<view>{{summaryData.qkCount}}次</view>缺卡
						</view>
						<view>
							<view>{{summaryData.qjHour && (summaryData.qjHour/60).toFixed(2) || 0}}h</view>请假
						</view>
						<view>
							<view>{{(summaryData.absenteeismMinuteTotal/60).toFixed(2)}}h</view>旷工
						</view>
					</view>
				</my-card>
			</scroll-view>
		</movable-area>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import zzxCalendar from "../components/zzx-calendar/zzx-calendar.vue"
	import {everydayKqData} from '../kq.js'
	
	export default {
		components:{ zzxCalendar },
		data() {
			return {
				dayStartDateStr:"",
				title:"",
				summaryData:{cdzttimeMinute:0,qkCount:0,qjHour:0,absenteeismMinuteTotal:0,predictWorktimeMinute:0},
				form:{qjArr:[],ccArr:[],jbArr:[]},
				mode1e:true,
				mode1s:true,
				mode2e:true,
				mode2s:true,
				mode3e:true,
				mode3s:true,
				dotList:[],
				flag:true,
				date:"",
				curHolidayN:""
			}
		},
		onLoad(options) {
			if(options.date){
				this.date = options.date
				this.come = options.come;
			}
			let v = uni.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			if(v.substr(5,2).startsWith("0")){
				this.title = v.substr(6,1) + '月考勤汇总'
			}else{
				this.title = v.substr(5,2) + '月考勤汇总'
			}
			this.dayStartDateStr = v;
			this.initData()
		},
		onReady() {
			if(this.date){
				this.$refs.calRef.initDate(this.date)
				this.change({fullDate:this.date})
				this.$refs.calRef.clickItem({fullDate:this.date});
			}
		},
		methods: {
			change(e){
				let v = e.fullDate
				this.dayStartDateStr = v;
				if(v.substr(5,2).startsWith("0")){
					this.title = v.substr(6,1) + '月考勤汇总'
				}else{
					this.title = v.substr(5,2) + '月考勤汇总'
				}
				this.initData()
			},
			daysChange(e){
				let v = e.end;
				let y= v.getFullYear()
				let m = v.getMonth();
				let currentMonth = this.dayStartDateStr.substr(5,2) - 1;
				let firstDay = uni.$u.timeFormat(v, 'yyyy-mm-dd');
				if(m !== currentMonth){
					this.dayStartDateStr = firstDay;
					this.$refs.calRef.initDate(this.dayStartDateStr);
					this.$refs.calRef.clickItem({fullDate:this.dayStartDateStr});
				}
			},
			handleReissuecard(v){
				let form = {bkTimeSteps:[]};
				v = uni.$u.timeFormat(v,'yyyy-mm-dd hh:MM:ss')
				form.bkTimeSteps.push(v.substr(0,16))
				uni.setStorageSync("receiptsForm_key", form);
				uni.navigateTo({
					url:"../kq/leave/leave?type=4&come=mykq"
				})
			},
			initData(){
				everydayKqData({dayStartDateStr:this.dayStartDateStr}).then(r => {
					this.mode1e = true;
					this.mode1s = true;
					this.mode2e = true;
					this.mode2s = true;
					this.mode3e = true;
					this.mode3s = true;
					if(r.data.code == 200){
						let d = r.data.data
						this.summaryData = d.month;
						this.dotList = [];
						d.dayStss.forEach(v => {
							if(v.dayMode == 2){
								this.dotList.push({
									date:v.dayDate,
									classTimes:"休息",
									dayMode:v.dayMode
								})
							}else if(v.dayMode == 3){
								if(d.dayDate == v.dayDate && v.holidayName){
									this.curHolidayN = v.holidayName;
								}
								this.dotList.push({
									date:v.dayDate,
									classTimes:v.holidayName.substr(0,2),
									dayMode:v.dayMode
								})
							}else{
								this.dotList.push({
									date:v.dayDate,
									classTimes:v.classesTimeName.substr(0,2),
									dayMode:v.dayMode
								})
							}
						})
						d.cardCount = 0;
						if(d.startWorkTime1){
							d.workTime1s = d.startWorkTime1.substr(0,5)
							d.workTime1e = d.endWorkTime1.substr(0,5)
							d.start1 = `${d.dayDate} ${d.startWorkTime1}`;
							d.end1 = `${d.dayDate} ${d.endWorkTime1}`;
							d.cardCount+=2;
						}
						if(d.startWorkTime2){
							d.workTime2s = d.startWorkTime2.substr(0,5)
							d.workTime2e = d.endWorkTime2.substr(0,5)
							d.start2 = `${d.dayDate} ${d.startWorkTime2}`;
							d.end2 = `${d.dayDate} ${d.endWorkTime2}`;
							d.cardCount+=2;
						}
						if(d.startWorkTime3){
							d.workTime3s = d.startWorkTime3.substr(0,5)
							d.workTime3e = d.endWorkTime3.substr(0,5)
							d.start3 = `${d.dayDate} ${d.startWorkTime3}`;
							d.end3 = `${d.dayDate} ${d.endWorkTime3}`;
							d.cardCount+=2;
						}
						d.qjArr.forEach(v => {
							// 如果扣工时则相应时间段不显示卡点
							if(v.isPaid){
								if(d.start3){
									// 如果请假开始时间大于3下班时间，则全天卡点都显示
									
									if(new Date(v.startTime) >= new Date(d.end3)){
										this.mode1e = true;this.mode1s = true;this.mode2e = true;this.mode2s = true;this.mode3e = true;this.mode3s = true;
									}else{
										// 否则请假开始时间小于3下班时间，
										// 如果请假结束时间小于3下班时间，则说明3下班卡点肯定显示
										if(new Date(v.endTime) <= new Date(d.end3)){
											this.mode3e = true;
										}else{
											// 否则，请假结束时间大于3下班时间，3下班卡点包含在请假范围内，则不显示其卡点
											this.mode3e = false;
										}
										// 如果请假开始时间大于3上班时间，则3上班时间卡点肯定显示
										if(new Date(v.startTime) >= new Date(d.start3)){
											this.mode3s = true;
										}else{
											// 否则，请假开始时间小于3上班时间，
											// 如果结束时间小于3上班时间，则3的卡点都显示
											if(new Date(v.endTime) <= new Date(d.start3)){
												this.mode3s = true;
												this.mode3e = true;
											}else{
												// 否则，请假结束时间大于3上班时间，则3上班时间包含在请假范围内，3上班卡点不显示
												this.mode3s = false;
											}
										}
									}
								}else{
									this.mode3s = false;this.mode3e = false;
								}
								if(d.start2){
									// 如果请假开始时间大于2下班时间，则2下班卡点肯定显示
									if(new Date(v.startTime) >= new Date(d.end2)){
										this.mode2e = true;
									}else{
										// 否则，请假开始时间小于2下班时间，
										// 如果请假结束时间小于2下班时间，则2下班卡点肯定显示
										if(new Date(v.endTime) <= new Date(d.end2)){
											this.mode2e = true;
										}else{
											// 否则，请假结束时间大于2下班时间，2下班卡点包含在请假范围内，则不显示卡点
											this.mode2e = false
										}
										// 如果请假开始时间大于2上班时间，则2上班卡点显示
										if(new Date(v.startTime) >= new Date(d.start2)){
											this.mode2s = true;
										}else{
											// 否则，请假开始时间小于2上班时间，
											// 如果，请假结束时间小于2上班时间，则2卡点全显示
											if(new Date(v.endTime) <= new Date(d.start2)){
												this.mode2s = true;
												this.mode2e = true;
											}else{
												// 否则，请假结束时间大于2上班时间，则2上班卡点包含在请假范围内，不显示其卡点
												this.mode2s = false;
											}
										}
									}
								}else{
									this.mode2s = false;this.mode2e = false;
								}
								if(d.start1){
									// 如果请假开始时间大于1下班时间，则1下班卡点肯定显示
									if(new Date(v.startTime) >= new Date(d.end1)){
										this.mode1e = true;
										this.mode1s = true;
									}else{
										// 否则，请假开始时间小于1下班时间，
										// 如果请假结束时间小于1下班时间，则1下班卡点肯定显示
										if(new Date(v.endTime) <= new Date(d.end1)){
											this.mode1e = true;
										}else{
											// 否则，请假结束时间大于1下班时间，1下班卡点包含在请假范围内，则不显示卡点
											this.mode1e = false
										}
										// 如果请假开始时间大于1上班时间，则1上班卡点显示
										if(new Date(v.startTime) >= new Date(d.start1)){
											this.mode1s = true;
										}else{
											// 否则，请假开始时间小于1上班时间，
											// 如果，请假结束时间小于1上班时间，则1卡点全显示
											if(new Date(v.endTime) <= new Date(d.start1)){
												this.mode1s = true;
												this.mode1e = true;
											}else{
												// 否则，请假结束时间大于1上班时间，则1上班卡点包含在请假范围内，不显示其卡点
												this.mode1s = false;
											}
										}
									}
								}else{
									this.mode1s = false;this.mode1e = false;
								}
							}else{
								// 如果不扣工时，显示全部卡点，
								this.mode1s = true;
								this.mode1e = true;
								this.mode2s = true;
								this.mode2e = true;
								this.mode3s = true;
								this.mode3e = true;
							}
						})
						if(!this.mode1s && !this.mode1e && !this.mode2s && !this.mode2e && !this.mode3s && !this.mode3e){
							this.flag = false;
						}else{
							this.flag = true;
						}
						this.form = d;
					}else{
						this.$refs.uToast.show({
							title: r.data.msg,
							type: 'error',
						})
						this.form = {qjArr:[],ccArr:[],jbArr:[]};
						this.summaryData = {cdzttimeMinute:0,qkCount:0,qjHour:0,absenteeismMinuteTotal:0};
					}
				})
			},
			cellClick(v){
				uni.navigateTo({ url:`../receiptDetail/receiptDetail?id=${v.id}&who=me` })
			},
			handleSummary(){
				uni.navigateTo({ url:`../summaryDetails/summaryDetails?date=${this.dayStartDateStr}` })
			},
			backClick(){
				if(this.come){
					uni.navigateTo({ url:`../summaryDetails/summaryDetails?date=${this.dayStartDateStr}` })
				}else{
					uni.switchTab({ url:"/pages/index/index" })
				}
			},
		}
	}
</script>

<style scoped>
	>>>.u-cell{
		margin-left: 20rpx;
	}
	>>>.u-cell__body{
		padding: 10rpx 0;
	}
	.bkbtn_class{
		width: 120rpx;
		padding: 10rpx;
		font-size: 20rpx;
		background-color: #f9ae3d;
		color: #fff;
		border-radius: 10rpx;
		text-align: center;
	}
	.mincircle{
		width: 14rpx;
		height: 14rpx;
		border-radius: 14rpx;
		background-color: #1FBCB5;
		position: absolute;
		top: 14rpx;left: 2rpx;
	}
	.f600{
		font-weight: 700;
		color: #444;
	}
</style>