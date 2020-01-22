import request from '@/utils/request'

//管理员列表
export function AdministratorList(){
    return request({
      url:'/admin/query',
      method:'post'
    })
}

//添加管理员
export function AddAdministrator(account,password,auth,appid_auth,level,update_channel){
   return request({
     url:'/admin/add',
     method:'post',
     params: { account,password,auth,appid_auth,level,update_channel }
   })
}

//删除管理员
export function DeleteAdministrator(id){
  return request({
    url:'/admin/del',
    method:'post',
    params: { id }
  })
}

//所有后台接口权限列表
export function RouterJurisdiction(){
  return request({
    url:'/admin/auth',
    method:'post',
    params: { }
  })
}

//编辑管理员
export function CompileAdministrator(id,password,auth,appid_auth,level,update_channel){
  return request({
    url:'/admin/edit',
    method:'post',
    params: {id,password,auth,appid_auth,level,update_channel}
  })
}