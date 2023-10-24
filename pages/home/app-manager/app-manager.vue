<template>
  <view class="appmangePage">
    <movable-area style="width: 100%; height: 100%">
      <movable-view direction="all" :out-of-bounds="false">
        <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
      </movable-view>
      <!-- <u-sticky customStyle="top: 30rpx;right: 30rpx;position: absolute;">
      	<text class="u-primary">{{  isEdit ? '保存' : '管理' }}</text>
      </u-sticky> -->
      <scroll-view scroll-y style="height: calc(100% - 62px);width: 100%;">
				<my-card padding="10rpx 20rpx 20rpx">
					<view class="u-p-20 u-flex u-p-l-10 u-font-30">
						<u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
						常用应用
					</view>
					<u-grid :border="false" :col="4" @click="urlItemClick">
						<u-grid-item 
							customStyle="margin-bottom: 20rpx;position: relative;width:25%;" 
							v-for="(item,index) in selecteList" :key="$u.guid()" :name="item.key" >
							<view 
								class="icon_class u-flex u-row-center cfff" 
								:style="{'background': `url(${iconArr[index]}) no-repeat center`}">
								<i :class="[item.icon]" class="u-font-32"></i>
							</view>
							<text class="u-font-26">{{ item.name }}</text>
							<view class="add_eidt_icon">
								<u-icon 
								  v-if="isEdit && isIncludesKey(item.key)" 
								  name="minus-circle-fill" color="rgba(204,204,204,1)" size="30"></u-icon>
							</view>
						</u-grid-item>
					</u-grid>
				</my-card>
				
				<my-card padding="10rpx 20rpx 20rpx" v-for="(key,index) in applicationKey" :key="index">
					<view class="u-p-20 u-flex u-p-l-10 u-font-30">
						<u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)"></u-icon>
						{{ applicationData[key+'Label'] }}
					</view>
					<u-grid :border="false" :col="4" @click="urlItemClick">
						<u-grid-item 
							customStyle="margin-bottom: 20rpx;position: relative;width:25%;" 
							v-for="(item,i) in applicationData[key]" :key="item.id" :name="item.key"
							v-if="item.display">
							<view 
								class="icon_class u-flex u-row-center cfff" 
								:style="{'background': `url(${iconArr[i]}) no-repeat center`}">
								<i :class="[item.icon]" class="u-font-32"></i>
							</view>
							<text class="u-font-26">{{ item.name }}</text>
							<view class="add_eidt_icon">
								<u-icon
								  v-if="isEdit && !isIncludesKey(item.key)" 
								  name="plus-circle-fill" color="rgba(37, 192, 90, 1)" size="30"></u-icon>
								<u-icon 
								  v-if="isEdit && isIncludesKey(item.key)" 
								  name="minus-circle-fill" color="rgba(204,204,204,1)" size="30"></u-icon>
							</view>
						</u-grid-item>
					</u-grid>
				</my-card>
				<u-gap height="1" bgColor="#f8f8f8"></u-gap>
      </scroll-view>
			
			<my-button @click="submit">{{ isEdit ? '完成' : '编辑'}}</my-button>
    </movable-area>
		
		<my-countdown-login ref="mycountdownloginRef"></my-countdown-login>
  </view>
</template>

<script>
	import { getItemAuth, allApplicate, filterApplicate, iconArr } from '@/utils/index-data.js'
	
  export default {
    data() {
      return {
        applicationKey:['visitorArr','ApprovalFlowArr','xfArr','PassageArr','dormArr','energyArr','libraryArr'],
				applicationData:allApplicate,
        isAdmin:false,
				isEdit:false,
				selecteKey:[],
				selecteList:[],
				iconArr
      }
    },
		onLoad() {
			this.selecteKey = this.vuex_selectMenuKey || [];
			this.selecteList = filterApplicate(this.selecteKey);
		},
    onShow() {
      // const appmanagerObj = uni.getStorageSync("appmanager_key");
      // if(appmanagerObj){
      //   this.obj = appmanagerObj
      // }
      // this.isAdmin = this.vuex_useInfo.isAdmin;
    },
    methods: {
			urlItemClick(key){
				if(this.isEdit) {
					if(this.selecteKey.includes(key)){
						this.selecteKey = this.selecteKey.filter(v => v != key);
					}else if(this.selecteKey.length >= 11){
						return this.$u.toast("最多添加11个常用应用！");
					}else{
						this.selecteKey.push(key);
					}
					this.selecteList = filterApplicate(this.selecteKey);
					this.$forceUpdate()
					return;
				};
				let item = getItemAuth(key);
				if(item && item.enable == 0) return this.$u.toast("此功能暂未开放");
				let objArr = filterApplicate([key]);
				if(objArr.length) {
					item.url = objArr[0].url;
				}
				let arr = ['FK_APPOINTMENT','FK_RESERVATION_RECORD']
				if(arr.includes(key)){
				  if(item.key === 'FK_APPOINTMENT' && this.vuex_urlobj.isBind == 1 && this.vuex_useInfo.bindEmpType == 2) return this.$u.toast("此功能暂未开放");
					return this.$u.route(item.url);
				}
				if(this.vuex_urlobj.isBind == 0) return this.$refs.mycountdownloginRef.start();
				let arr2 = ['FK_INVITATION','FK_INVITATION_RECORD','SP_EVECTION','SP_OVERTIME','SP_RETROACTIVE_RECORD']
				if((arr2.includes(key)) && this.vuex_useInfo.bindEmpType != 2) return this.$u.toast("此功能暂未开放");
				this.$u.route(item.url)
			},
      submit(){
				if(!this.isEdit) return this.isEdit = !this.isEdit;
        this.$u.vuex('vuex_selectMenuKey', this.selecteKey);
        this.backClick()
      },
			isIncludesKey(key){
				return this.selecteKey.includes(key);
			},
      backClick(){
        uni.switchTab({ url:'/pages/index/index' })
      }
    }
  }
</script>

<style lang="scss">
  .appmangePage{
    .icon_class{
    	background:url(/static/images/iconbg/2.png) no-repeat center;
    	background-size: 100% 100% !important;
    	width: 64rpx;
    	height: 70rpx;
    }
		.add_eidt_icon{
			position: absolute;
			top: -2rpx;
			right: 38rpx;
		}
  }
</style>
