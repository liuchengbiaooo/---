export  function routerMatch(permission,asyncRoutes){
    var realRoutes = []
     asyncRoutes.forEach((v, i) => {
        permission.forEach((item, index) => {
               if (item.name === v.meta.title) {
                   if (item.child && item.child.length > 0) {
                       v.children = routerMatch(item.child, v.children)
                   }
                   realRoutes.push(v)
               }
           })
       })
       return realRoutes
   }



