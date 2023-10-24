export const deleteEmptyArr = function(arr1,number){
	let arr = uni.$u.deepClone(arr1);
  for(let i = 0;i<arr.length;i++){
    let item = arr[i]
    if(!item.children || item.children.length == 0){
      arr.splice(i,1)
      i--;
    }else{
      if(number > 2){
        deleteEmptyArr(item.children,0)
      }
    }
  }
  return arr
}
export const transDate = function(date){
  return Object.prototype.toString.call(date) === '[object String]' ? date.replace(/-/g, '/') : date;
}
export const formatterValue = function(value,arr){
  let item = arr.find(item => item.value == value)
  return item ? (item.label || item.name) : ''
}