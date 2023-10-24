<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
			
			<view class="help_feedback u-p-t-30">
				<my-card>
					<view class="u-flex u-row-between u-m-b-30">
						<u-icon name="shuxian" custom-prefix="custom-icon" color="rgba(31, 188, 181, 1)" label="常见问题" labelColor="rgba(51,51,51,1)"></u-icon>
						<view class="help_feedback_search" :class="[showAnimation ? 'help_feedback_active' : '']">
							<u-search
								placeholder="注册" v-model="keyword" 
								:showAction="false" :clearabled="false"
								@search="search"
								@clear="search"
								@focus="focus"
								@blur="blur"></u-search>
						</view>
					</view>
					
					<u-cell v-for="(item,index) in 10" :key="index" :title="'问题'+index" isLink></u-cell>
				</my-card>
			</view>
		</movable-area>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword:'',
				showAnimation:false
			}
		},
		methods: {
			search(){
				
			},
			focus(){
				this.showAnimation = true;
			},
			blur(){
				this.showAnimation = false;
			},
			backClick(){
				uni.switchTab({ url:'/pages/home/home' })
			}
		}
	}
</script>

<style lang="scss">
.help_feedback{
	height: 400rpx;
	background: linear-gradient(180deg, rgba(58, 214, 20, 0.15) 0%, rgba(58, 214, 20, 0) 100%);
	&_search{
		width: 30%;
		transition-property: width;
		transition-duration: 0.3s;
	}
	&_active{
		width: 70%;
	}
}
</style>
