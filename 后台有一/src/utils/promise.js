const LYPromise = function (callback) {
    this.callback = callback;
    //任务计数
    this.tackNumber = 0;
    if (callback) this.tackNumber++;
}

const LYPromisePrototype = LYPromise.prototype;
//成功的回调
LYPromisePrototype.then = function (callback) {
    this.thenCallback = callback;
    return this;
}
//失败
LYPromisePrototype.catch = function (callback) {
    this.catchCallback = callback;
    return this;
}
LYPromisePrototype.error = LYPromisePrototype.catch;
//结束都会操作
LYPromisePrototype.finally = function (callback) {
    this.finallyCallback = callback;
    return this;
}
LYPromisePrototype.use = function(callback) {
    this.useCallback = callback;
    return this;
}

//运行闭包
LYPromisePrototype.run = function (data) {
    //resolve, reject
    const callback = this.callback;
    this.runData = data;
    callback(this.resolve.bind(this), this.reject.bind(this), data)
    return this;
}
//成功执行
LYPromisePrototype.resolve = function (data) {
    this.thenCallback && this.thenCallback(data,this.runData);
    this.finallyCallback && this.finallyCallback(data,this.runData);
    this.useCallback && this.useCallback(data,this.runData);
    this.rm();
    return this;
}
//失败执行
LYPromisePrototype.reject = function (data) {
    this.catchCallback && this.catchCallback(data,this.runData);
    this.finallyCallback && this.finallyCallback(data,this.runData);
    this.useCallback && this.useCallback(data,this.runData);
    this.rm();
    return this;
}

LYPromisePrototype.rm = function() {
    this.catchCallback = null;
    this.finallyCallback = null;
    this.useCallback = null;
}

// //封装多任务
// LYPromisePrototype.setTask = function (data) {

// }




//接收多个LYPromise对象  所有完成才会返回
LYPromise.all = function (promiseList) {
    const p = new LYPromise()
    const dataList = [];
    let length = promiseList.length;
    for (let index = 0; index < promiseList.length; index++) {
        const element = promiseList[index];
        //会覆盖原事件
        element.use(function (data,i) {
            dataList[i] = data;
            length --;
            if (length == 0) {
                p.resolve(dataList)
            }
        }).run(index);
        // element.then(function (data,i) {
        //     dataList[i] = data;
        //     if (dataList.length ==  promiseList.length) {
        //         p.resolve(dataList)
        //     }
        // }).catch(function(data,i) {
        //     dataList[i] = data;
        //     if (dataList.length ==  promiseList.length) {
        //         p.resolve(dataList)
        //     }
        // }).run(index);
    }
    return p;
}
//接收多个LYPromise对象 有一个返回就会调用
LYPromise.race = function (promiseList) {

}
export default LYPromise;