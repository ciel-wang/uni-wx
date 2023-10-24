exports.install = function (Vue, options) {
	Vue.prototype.iosTransDate = function(str,type = '/'){
		if(Object.prototype.toString.call(str) === '[object String]'){
			let newStr = str.length === 10 ? str+' 00:00:00' : str.length === 16 ? str+':59' : str;
			if(type === "/"){
				return newStr.replace(/\-/g, "/")
			}else{
				return newStr
			}
		}else{
			return str;
		}
	}
};  