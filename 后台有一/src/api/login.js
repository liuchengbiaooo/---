import request from '@/utils/request'

export function login(account, password) {
    return request({
        url: 'Login/tologin',
        method: 'get',
        params: { account, password }
    })
}

export function logout(token) {
    return request({
        url: 'Login/loginOut',
        method: 'post',
        params: { token }
    })
}

//获取主页的数据
export function loginData() {
    return request({
        url: '/index/index',
        mehtod: 'get',
        params: {}
    })
}

//获取权限页面

export function getInfo() {
    return request({
        url: '/login/myAuth',
        mehtod: 'get',
        params: {}
    })
}

//修改密码

export function alterPassword(oldpwd, newpwd) {
    return request({
        url: '/login/resetpwd',
        mehtod: 'get',
        params: { oldpwd, newpwd }
    })
}