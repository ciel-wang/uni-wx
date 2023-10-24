<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<scroll-view scroll-y style="height: calc(100% - 67px);width: 100%;">
				<my-card :showFoot="false" :showHead="false" margin="0 0 40rpx">
					<view class="u-flex u-row-between u-col-center">
						<view class="u-flex-1">
							<text class="u-font-36 fw700">已生成邀请码</text>
							<view class="u-m-t-20 u-error" v-if="timestamp >= 0 && obj.visitorState == 8">
								<text class="u-m-r-10">距离失效</text>
								<u-count-down :time="timestamp"></u-count-down>
							</view>
							<view v-else class="u-m-t-20 u-error">邀请码已失效</view>
						</view>
						<u-image 
							src="http://qs.aiwld.com.cn/static/app/linktop.png" 
							width="150rpx" height="150rpx" 
							customStyle="margin:0 auto;"></u-image>
					</view>
				</my-card>
				
				<view class="u-m-20">{{vuex_useInfo.bindEmpType == 2 ? '邀约' : '随行'}}人员（{{ retinueEmpArr.length }}/{{ visitorPersonCount }}）</view>
				<my-card :showFoot="false" :showHead="false" margin="0 20rpx" v-if="retinueEmpArr.length || otherEmpArr.length">
					<u-swipe-action>
						<u-swipe-action-item 
							v-for="(item, index) in retinueEmpArr" :key="$u.guid()"
							:options="options"
							:disabled="!(obj.visitorState == 8 || obj.visitorState == 1)"
							@click="swipeClick($event,index)">
							<view class="u-flex u-row-between u-col-center u-border-bottom u-p-t-20 u-p-b-20">
								<view class="u-flex u-col-center fw700 u-width-70">
									<u-avatar :src="staticPrefix + item.visitorImgUrl2"></u-avatar>
									<view class="u-width-70 u-line-2 u-m-l-20">{{item.visitorName}}</view>
								</view>
								<u-tag class="u-p-t-10 u-p-b-10 u-m-r-10" text="邀请成功" type="success" size="mini" mode="dark" />
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
					
					<view 
						v-for="(item,index) in otherEmpArr" :key="index" 
						class="u-flex u-row-between u-col-center u-border-bottom u-p-t-20 u-p-b-20">
						<view class="u-flex u-col-center fw700">
							<u-avatar src=""></u-avatar>
							<text class="u-light-color u-m-l-20">暂无人员信息</text>
						</view>
						<u-tag text="邀请中" type="info" />
					</view>
				</my-card>
				
				<view class="u-tips-color u-m-t-20 u-p-20">邀请时间失效或{{vuex_useInfo.bindEmpType == 2 ? '邀约' : '随行'}}人员已满则自动提交，待审批后生效</view>
				<view style="opacity: 0;position: absolute;bottom: 0;z-index: 0;">
					<tki-qrcode
					  ref="qrcode" 
					  :val="linkUrl" 
					  :size="560" 
					  @result="erweimaR" 
					  :loadMake="true" 
						:showLoading="false"
					  :onval="true" />
				</view>
			</scroll-view>
		</movable-area>
		
		<!-- #ifdef H5 -->
		<my-button @click="shareInvitationCodeClick">分享邀请码</my-button>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<my-button open-type="share">分享邀请码</my-button>
		<!-- #endif -->
		
		<u-popup :show="popupShow" mode="center" round="30" @close="popupShow = false">
			<view class="u-text-center">
				<u-image :src="canvasImgBaise64" width="330px" height="460px"></u-image>
			</view>
		</u-popup>
		
		<u-modal 
			:show="confirmShow" 
			title="提示:" content="确定要删除？" showCancelButton 
			@confirm="handleConfirm"
			@cancel="confirmShow = false"></u-modal>
		<u-toast ref="uToast" />
		
		<canvas v-if="canvasImgBaise64 == ''" style="width: 330px; height: 460px;position: fixed;top: 9999999px;" canvas-id="myCanvas" id="myCanvas"></canvas>
	</view>
</template>

<script>
	import config from '@/config/index.js'
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	import { details, retinueRemove } from '../api/approval.js';
	
	export default {
		components: { tkiQrcode },
		data() {
			return {
				timestamp:0,
				retinueEmpArr:[],
				visitorPersonCount:0,
				otherEmpArr:[],
				options: [{ text: '删除', style: { backgroundColor: '#dd524d', width: '150rpx' } }],
				popupShow:false,
				obj:{},
				visitorNo:"",
				linkUrl:"",
				qrcodeBase64:"",
				canvasImgBaise64:"",
				confirmShow:false,
				removeIndex:"",
				timer:null,
				staticPrefix:"",
				ctx:""
			}
		},
		onLoad(option) {
			const visitorNo = option.visitorNo;
			const BASE_URL = config.baseUrl;
			this.linkUrl = `${config.linkUrl}/#/pageFk/retinue-formlink/retinue-formlink?N=${visitorNo}&appId=${this.vuex_urlobj.appId}&S=${this.vuex_cfg.isShowSourceAddr}&T=${this.vuex_useInfo.bindEmpType == 2 ? 'targetInvite' : 'appointment'}&C=${this.vuex_cfg.isShowCertificate}&DT=${this.vuex_cfg.dateType}`
			this.visitorNo = visitorNo;
			this.canvasImgBaise64 = "";
			this.initData();
		},
		onShareAppMessage(res){
			console.log(res)
			let path = `/pageFk/retinue-formlink/retinue-formlink?N=${this.visitorNo}&appId=${this.vuex_urlobj.appId}&S=${this.vuex_cfg.isShowSourceAddr}&T=${this.vuex_useInfo.bindEmpType == 2 ? 'targetInvite' : 'appointment'}&C=${this.vuex_cfg.isShowCertificate}&DT=${this.vuex_cfg.dateType}&sid=${this.vuex_urlobj.sid}`
			return {
				title: '自定义分享标题',
				path: path,
			}
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		methods: {
			erweimaR(e){
				this.qrcodeBase64 = e;
			},
			initCanvas(){
				// #ifdef H5
					var ctx = uni.createCanvasContext('myCanvas');
					uni.downloadFile({
						url:'https://qs.aiwld.com.cn/static/app/canvas_bg.png',
						success:({tempFilePath}) => {
							ctx.drawImage(tempFilePath,0, 0,330,461);
							
							ctx.setFillStyle('#000');
							ctx.setFontSize(14);
							ctx.setTextAlign('center');
							ctx.fillText('访客邀约',165,75);
							
							ctx.setFontSize(12);
							ctx.setTextAlign('left');
							let empNameWidth = 40;
							if(this.vuex_useInfo.bindEmpType != 2){
								let empName = this.obj.empName.length > 10 ? this.obj.empName.substr(0,10)+'...' : this.obj.empName;
								ctx.fillText(empName,40,110);
								empNameWidth = ctx.measureText(empName).width + 60;
							}
							ctx.setFillStyle('#909993');
							ctx.fillText(`诚邀您${this.vuex_useInfo.bindEmpType == 2 ? '到访' : '随行'}`,empNameWidth,110);
							ctx.fillText("到访区域：",40,140);
							ctx.fillText("被访人：",190,140);
							ctx.fillText("到访时间：",40,180);
							ctx.fillText("离访时间：",190,180);
							
							ctx.setFillStyle('#000');
							let str = this.obj.visitorArea;
							let strWidth = ctx.measureText(str).width;
							const ellipsis = '…';
							const ellipsisWidth = ctx.measureText(ellipsis).width;
							if (strWidth <= 140 || 140 <= ellipsisWidth) {
								ctx.fillText(str,40,160);
							} else {
								var len = str.length;
								for(let i = len;i>0;i--){
									if(strWidth >= 140 - ellipsisWidth){
										str = str.slice(0, i);
										strWidth = ctx.measureText(str).width;
									}
								}
								ctx.fillText(str + ellipsis,40,160);
							}
							ctx.fillText(this.obj.targetEmpName.length > 8 ? this.obj.targetEmpName.substr(0,8)+'...' : this.obj.targetEmpName,190,160);
							ctx.fillText(this.obj.visitorTime,40,200);
							ctx.fillText(this.obj.levalTime,190,200);
							
							ctx.setFillStyle('#2979ff');
							ctx.setTextAlign('center');
							let text = `二维码有效期至：${this.obj.invitationExpireTime}`
							ctx.fillText(text,165,220);
							
							ctx.drawImage(this.qrcodeBase64,85, 230, 150, 150);
							
							ctx.setFillStyle('#909993');
							ctx.fillText("微信扫一扫或长按识别",165,400);
							
							ctx.draw(true,(ret) => {
								uni.canvasToTempFilePath({ // 保存canvas为图片
									canvasId: 'myCanvas',
									quality: 1,
									success:({ tempFilePath })=>{
										this.canvasImgBaise64 = tempFilePath
									}
								})
							})
						},
						fail: (err) => {
							console.log(err);
						}
					})
				// #endif
			},
			shareInvitationCodeClick(){
				this.popupShow = true;
				setTimeout(() => {
					this.initCanvas()
				},100)
			},
			swipeClick(e,index) {
			  if (e.index == 0) {
					this.removeIndex = index;
					this.confirmShow = true;
			  }
			},
			handleConfirm(){
				let item = this.retinueEmpArr[this.removeIndex];
				retinueRemove({id:item.id}).then(r => {
					this.$refs.uToast.show({ message: r.data.msg, type: 'success' });
					this.retinueEmpArr.splice(this.removeIndex, 1);
					this.initData();
				}).catch(err => {
					this.$refs.uToast.show({ message: err, type: 'error' });
				})
			},
			initData(){
				details({visitorNo:this.visitorNo}).then(r => {
					if(r.data.code === 200){
						let d = r.data.data;
						this.staticPrefix = d.staticPrefix;
						let arr = [];
						if(this.vuex_useInfo.bindEmpType == 2){
							arr = d.visitors.filter(v => v.visitorCertificateCode)
						}else{
							arr = d.visitors.length > 1 ? d.visitors.slice(1) : []
						}
						let arr2 = arr.map(v => ({...v,show:false}));
						this.visitorPersonCount = d.visitorPersonCount;
						this.retinueEmpArr = arr2;
						this.otherEmpArr = new Array(d.visitorPersonCount - arr2.length).fill('');
						
						let serverTime = new Date(this.iosTransDate(d.serverTime)).getTime();
						let diff =  new Date(this.iosTransDate(d.invitationExpireTime)).getTime() - serverTime;
						this.timestamp = diff;
						let {levalTime,targetEmpName,visitorArea,visitorTime,invitationExpireTime,visitorState} = d;
						let empName = d.visitors[0].visitorName;
						levalTime = this.vuex_cfg.dateType === 'date' ? levalTime.substr(0,10) : levalTime.substr(0,16);
						visitorTime = this.vuex_cfg.dateType === 'date' ? visitorTime.substr(0,10) : visitorTime.substr(0,16);
						this.obj = {levalTime,targetEmpName,visitorArea,visitorTime,empName,invitationExpireTime,visitorState};
						
						if(diff/1000 > 0 && visitorState == 8){
							clearTimeout(this.timer);
							this.timer = setTimeout(() => {this.initData()},10000)
						}
					}
				})
			},
			backClick(){
				if(this.vuex_urlobj.token){
					return uni.redirectTo({ url:'../inviteRecord/inviteRecord' }) 
				}
				return uni.redirectTo({ url:'../appointmentrecord/appointmentrecord' })
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-count-down__text{
		color: $u-error !important;
		font-size: 28rpx !important;
	}
</style>