import request from '@/utils/request'

//产品列表
export function getCPList(){
    return request({
      url:'/App/getAppid',
      method:'post'
    })
}

//获取渠道数据 
export function channels(appid){
    return request({
        url:'/admin/channelAuth',
        mehtod:'post',
        params:{appid}
    })
}


 //查询数据报表（实时统计）
 export function dataReport(appid,type,system,channel){
    return request({
        url:'/operate/realQuery',
        mehtod:'post',
        params:{appid,type,system,channel}
    })
 }
