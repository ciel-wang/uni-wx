<template>
	<view class="mybutton" :style="{zIndex,opacity}">
		<button 
			v-if="stype == 'odd'"
			:style="{width:width,height:height,'line-height':height,opacity:disabled ? 0.7 : 1}" 
			:open-type="openType" class="u-reset-button buttonitem"
			@click="click">
			<slot></slot>
		</button>
		
		<button
			v-if="stype == 'even'"
			:style="{'--width':width,height:height,'line-height':height,opacity:leftDisabled ? 0.7 : 1}"
			:open-type="openType" class="u-reset-button button1"
			@click="click('left')">
			<slot name="left"></slot>
		</button>
		<button
			v-if="stype == 'even'"
			:style="{'--width':width,height:height,'line-height':height,opacity:rightDisabled ? 0.7 : 1}"
			:open-type="openType" class="u-reset-button button2"
			@click="click('right')">
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		name: 'my-button',
		props: {
			width:{
				type:String,
				default:'80%'
			},
			height:{
				type:String,
				default:'45px'
			},
			type:{
				type:String,
				default: "primary"
			},
			size:{
				type:String,
				default:'default'
			},
			disabled:{
				type:Boolean,
				default:false
			},
      leftDisabled:{
        type:Boolean,
        default:false
      },
      rightDisabled:{
        type:Boolean,
        default:false
      },
      loading:{
        type:Boolean,
        default:false
      },
      stype:{
        type:String,
        default:'odd'
      },
			openType:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				zIndex:10,
				opacity:1,
				onResize:null
			}
		},
		mounted() {
			this.onResize = (res) => {
				this.zIndex = res.size.windowHeight < this.vuex_windowHeight ? 0 : 10;
				this.opacity = res.size.windowHeight < this.vuex_windowHeight ? 0 : 1;
			}
			uni.onWindowResize(this.onResize);
		},
		beforeDestroy() {
			uni.offWindowResize(this.onResize);
		},
		methods:{
			click(val){
				if(this.disabled) return;
				this.$emit('click',val);
			}
		}
	}
</script>

<style lang="scss">
	.mybutton{
		width: 100%;
		height: 62px;
		position: fixed;
		left: 0;
    bottom: 0;
		line-height: 62px;
		text-align: center;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		transition: 0.5s all;
		font-size: 32rpx;
		font-weight: 700;
	}
	.buttonitem{
		border-radius: 990rpx;
		background: linear-gradient(166.87deg, rgba(15, 191, 147, 1) 0%, rgba(19, 226, 174, 1) 1%, rgba(7, 189, 102, 1) 100%);
		color: #fff;
		text-align: center;
		margin: 0;
	}
  .button1 {
    border-radius: 990rpx 0 0 990rpx;
		width: calc(var(--width) / 2);
    border: 1px solid rgba(15, 191, 147, 1);
    background-color: #fff;
    color: rgba(15, 191, 147, 1);
    border-right: none;
		box-sizing: border-box;
		margin: 0;
  }
  .button2 {
    border-radius: 0 990rpx 990rpx 0;
		width: calc(var(--width) / 2);
    background: linear-gradient(166.87deg, rgba(15, 191, 147, 1) 0%, rgba(19, 226, 174, 1) 1%, rgba(7, 189, 102, 1) 100%);
		color: #fff;
		margin: 0;
  }
</style>