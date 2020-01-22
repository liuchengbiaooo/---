import request from '@/utils/request'

//查询运营报表
export function operationForms(appid, start_date, end_date, type, system, channel, time_interval) {
    return request({
        url: '/operate/query',
        mehtod: 'post',
        params: { appid, start_date, end_date, type, system, channel, time_interval }
    })
}

//查询游戏的LTV
export function gameLtv(appid, start_date, end_date, system, channel, day) {
    return request({
        url: '/ltv/query',
        mehtod: 'post',
        params: { appid, start_date, end_date, system, channel, day }
    })
}

//查询游戏的留存率
export function retentionRate(appid, start_date, end_date, system, channel, day, type) {
    return request({
        url: '/keep/query',
        mehtod: 'post',
        params: { appid, start_date, end_date, system, channel, day, type }
    })
}

//查询游戏的转化分析
export function conversion(appid, start_date, end_date, system, channel) {
    return request({
        url: '/conversion/query',
        mehtod: 'post',
        params: { appid, start_date, end_date, system, channel }
    })
}

//查询游戏的活跃分析
export function activeAnalysis(appid, start_date, end_date, system, channel) {
    return request({
        url: '/active/query',
        mehtod: 'post',
        params: { appid, start_date, end_date, system, channel }
    })
}
//IP信息
export function IPmessage(appid, system, channel, roleName, page) {
    return request({
        url: '/ip/query',
        mehtod: 'post',
        params: { appid, system, channel, roleName, page }
    })
}
//用户地区分布
export function userArea(appid, system, channel, type, date) {
    return request({
        url: '/portrait/query',
        mehtod: 'post',
        params: { appid, system, channel, type, date }
    })
}

//区服选择
export function district(appid) {
    return request({
        url: '/app/servers',
        mehtod: 'post',
        params: { appid }
    })
}

//玩家分布
export function gamersAre(appid, date, system, channel, serverId) {
    return request({
        url: '/playerdist/query',
        mehtod: 'post',
        params: { appid, date, system, channel, serverId }
    })
}

//个人信息
export function topupRanking(appid, system, channel, page, roleName, serverId) {
    return request({
        url: '/payrank/query',
        mehtod: 'post',
        params: { appid, system, channel, page, roleName, serverId }
    })
}

//充值排行（日期） 
export function payranktime(appid, system, date, channel, serverId) {
    return request({
        url: '/payrank/timeQuery',
        mehtod: 'post',
        params: { appid, system, date, channel, serverId }
    })
}

//订单查询
export function orderInquiry(appid, date, channel, roleName, roleId, accountId, page) {
    return request({
        url: '/payinfo/query',
        mehtod: 'post',
        params: { appid, date, channel, roleName, roleId, accountId, page }
    })
}

//自定义事件
export function customEvent(appid, date, event, roleId, channel, system, page) {
    return request({
        url: '/event/logs',
        mehtod: 'post',
        params: { appid, date, event, roleId, channel, system, page }
    })
}
//自定义事件统计
export function customStatistics(appid, date, channel, system) {
    return request({
        url: '/event/counts',
        mehtod: 'post',
        params: { appid, date, channel, system }
    })
}
//事件名
export function eventNames(appid, date) {
    return request({
        url: '/app/events',
        mehtod: 'post',
        params: { appid, date }
    })
}

//首次付费时间
export function fistPayTime(appid, start_date, end_date, type, system, channel) {
    return request({
        url: '/firstpaytime/query',
        mehtod: 'post',
        params: { appid, start_date, end_date, type, system, channel }
    })
}