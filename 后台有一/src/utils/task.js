/**
 * Created by liyang on 17-10-24.
 */

//任务对象
var LYTask = function() {
  this.first = 0
  this.judgeTask = null
  this.index = 0
  this.taskBlock = null
  //完成任务
  this.backTask = function() {
    if (this.first == 0) {
      this.judgeTask(this);//查询执行情况
    }
  }
}
//多任务栅栏函数
var LYBarrierfunction = function() {
  var self = this;
  //属性
  var queue = new Array(1);
  var taskIndex = 0;
  var barrier;
  var time; //定时器最长时效
  //方法
  //封装单个操作
  this.task = function (taskBlock) {
    var task = new LYTask()
    task.judgeTask = judgeTask //查询执行情况
    task.taskBlock = taskBlock
    task.index = taskIndex
    taskIndex++
    queue.push(task)
    //保存到
    taskBlock(task)
  }

    //查询任务是否执行完成
  var judgeTask = function (task) {
    //遍历出在当前数组的位置
    if (task != null) {
      for (var i in queue) {
        var taskQueue = queue[i]
        if (taskQueue == task) {
          task.index = i
        }
      }
      queue.splice(task.index, 1)
      task.first = 1
      task == null //任务制空
    }

    //数组为空执行栅栏函数
    if (queue.length == 0) {
      barrier()
      //执行栅栏函数之后清除任务列表并
      barrier == null
    }
  }

  //封装栅栏函数
  this.barrierFunc = function (barrierBlock) {
    barrier = barrierBlock
    queue.splice(0, 1)
    //执行一次查询
    judgeTask()
  }

  //超时函数
  this.overtime = function(overtimeBlock, duration) {
    if (duration != null) {
      //创建定时器
      setTimeout(function() {
        console.log('时间到了')
        //清楚栅栏函数
        barrier = function() {

        }
        overtimeBlock()
      }, duration)
    }
  }
}
export default LYBarrierfunction;
