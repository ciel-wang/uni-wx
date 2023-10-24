<template>
	<view>
		<movable-area style="width: 100%; height: 100%">
		  <movable-view direction="all" :out-of-bounds="false">
		    <u-icon name="fanhui2" custom-prefix="custom-icon" size="80" color="#909399" @click="backClick"></u-icon>
		  </movable-view>
		</movable-area>
		
		<canvas v-if="canvasImgBaise64 == ''" style="width: 330px; height: 460px;position: fixed;top: 9999999px;" canvas-id="firstCanvas" id="firstCanvas"></canvas>
		<u-image :src="canvasImgBaise64" width="330px" height="460px"></u-image>
	</view>
</template>

<script>
export default {
	data(){
		return{
			canvasImgBaise64:""
		}
	},
	onReady: function (e) {
		this.init();
	},
	methods: {
		init(){
			var ctx = uni.createCanvasContext('firstCanvas');
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
					ctx.setFillStyle('#909993');
					ctx.fillText("到访区域：",40,140);
					ctx.fillText("被访人：",190,140);
					ctx.fillText("到访时间：",40,180);
					ctx.fillText("离访时间：",190,180);
					ctx.draw(true,(ret) => {
						uni.canvasToTempFilePath({ // 保存canvas为图片
							canvasId: 'firstCanvas',
							quality: 1,
							success:({ tempFilePath })=>{
								this.canvasImgBaise64 = tempFilePath
							}
						})
					})
				}
			})
		},
		backClick(){
			uni.switchTab({ url:'/pages/home/home' })
		},
	}
}
</script>
