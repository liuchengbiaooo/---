import { execSync } from "child_process";

//拿去对应产品的数据
export function corresponding(arr) {
    if(arr.length>0) {
        let appid = [];
        arr.forEach(item => {
          appid.push(item.appId);
        });
        let appId = appid.join(",");
        return appId
    }else{
        return []
    }
}

//把子节点对应的父节点加入数组

function noRepeat(arr,value) { //id去重
    for(var i = 0;i < arr.length;i++) {
       if(arr[i] == value){
           return false
        }
 }
 return true
 }

export function fun(value,data,arr) {   //通过查询父节点下是否右子节点 将半选状态的父节点加入数组中
    for( var i  = 0;i < data.length;i++){
        var mod = data[i]
        if(mod.id == value) {
            if(noRepeat(arr,mod.id)) {
                arr.push(mod.id)
            }
            return true;
    }else {
        if(mod.children) {
            var bool = fun(value, mod.children, arr)
            if(bool) {
                if (noRepeat(arr, mod.id)) {
                    arr.push(mod.id)
                }
            return true
        }
    }
   }
    }
     return false
   }

//拿去对应渠道的数据
export function channelData(arr) {
    if(arr.length>0) {
        let appid = [];
     arr.forEach(item => {
      appid.push(item.pid);
    });
    appid.push('all')
    let appId = appid.join(",");
    return appId 
    }else{
        return {}
    }
}

//去重
 export function unique(arr){
    var hash=[];
    for (var i = 0; i < arr.length; i++) {
       if(hash.indexOf(arr[i])==-1){
        hash.push(arr[i]);
       }
    }
    return hash;
  }

  //找到对应的id 不包括一级菜单
  export function same(arr4,arr2){
    let arr = [];
    arr2.forEach(item =>{
        arr4.forEach(an =>{
            if(item !== an.id){
               an.children.forEach(v =>{
                   arr.push(v.id)
               })
            }      
        })
     })
     let arr1 = unique(arr);
     let arr3 = [];
         arr2.forEach(item =>{
             arr1.forEach(v =>{
                 if(item == v){
                    arr3.push(item)
                 }
             })
             
         })
         return arr3
  }
  // 给产品appid 与 渠道id 建立关系
  export function relation(ojj){
    var hash2= {};
    var i = 0;
    var res =[];
    ojj.forEach(function (item){
      var appId = item.appId
      hash2[appId] ? res[hash2[appId] - 1].id.push(item.id) :hash2[appId] = ++i && res.push({id:[item.id],appId:appId})
    })

    var chuli = res
    let ARR = []
    chuli.forEach(item=>{
      let obj = {}
      obj.appid = item.appId;
      let OJ = item.id
      let sum = OJ.join(",");
      obj.channel = sum;
      ARR.push(obj)
    })
    return JSON.stringify(ARR)
  } 
  
//匹配对应的路由
export function MatchRouting(menuBar){
    let menuLists = [];
    menuBar.forEach(item => {
        let obj = {};
        obj.id = Number(item["id"]);
        obj.label = item["name"];
        obj.children = [];
        if (item.child.length > 0) {
          item.child.forEach(v => {
            var ob = {};
            ob.id = Number(v.id);
            ob.label = v.name.toString();
            obj.children.push(ob);
          });
        }
        menuLists.push(obj);   
      });
      return menuLists;
}
// 新增角色名称不能重复提醒
export function CharacterName(value,administrator){
    var isHove = false;
    administrator.forEach(item =>{
      if(item.account == value){
        isHove = true;
      }
    })  
    return isHove;
}