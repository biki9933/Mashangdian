// 同时发送异步代码的次数
let ajaxTimes=0;

// 定义公共的url
const baseUrl="http://localhost:80";
/**
 * 返回baseUrl
 */
export const getBaseUrl=()=>{
  return baseUrl;
}

/**
 * 后端请求工具类
 * @param {*} params 请求参数
 */
export const requestUtil=(params)=>{
   let header={...params.header};
 
   // 拼接header 带上token
   header["token"]=uni.getStorageSync("token");

   ajaxTimes++;
	
   // 显示加载中 效果
   wx.showLoading({
     title: "加载中",
     mask: true
   });

   console.log('发起请求:', {
     url: baseUrl + params.url,
     method: params.method,
     data: params.data
   });

   return new Promise((resolve,reject)=>{
     wx.request({
       ...params,
       header:header,
       url:baseUrl+params.url,
       success:(result)=>{
         console.log('请求成功:', result);
         if(result.statusCode === 200){
           resolve(result.data);
         } else {
           uni.showToast({
             icon: 'error',
             title: '服务器响应错误',
             duration: 2000
           });
           reject(new Error('服务器响应错误: ' + result.statusCode));
         }
       },
       fail: function fail(err) {
         console.error('请求失败:', err);
         uni.showToast({
           icon: 'error',
           title: err.errMsg || '请求失败',
           duration: 2000
         });
         reject(err);
       },
       complete:()=>{
         ajaxTimes--;
         if(ajaxTimes===0){
           //  关闭正在等待的图标
           wx.hideLoading();
         }
       }
     });
   })
}