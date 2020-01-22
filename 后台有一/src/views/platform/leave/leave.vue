<template>
    <div>
        <div class="ly-flex">
            <div class="ly-flex-1">
              <el-select v-model="selected" placeholder="渠道">
                <el-option
                  v-for="item in chnList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>

              <div class="ly-flex-1">
                <el-date-picker
                  v-model="timeValue"
                  type="daterange"
                  value-format="yyyy-M-d"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
              <div class="ly-flex-1">
                <el-button type="primary" @click="onbtn">查询</el-button>
              </div>
        </div>

        <el-row id="datatable">
            <el-table :data="trList" border style="width: 100%" ref="table">
                <el-table-column prop="timestamp" :formatter="setTimeDate" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="chn" label="渠道" width="100">
                </el-table-column>
                <el-table-column prop="num_app_open" label="打开次数" width="180">
                </el-table-column>
                <el-table-column prop="num_users_active" label="活跃用户数">
                </el-table-column>
                <el-table-column prop="num_users_new" label="新增用户数">
                </el-table-column>
                <el-table-column prop="num_app_visit" label="访问次数">
                </el-table-column>
                <el-table-column prop="average_user_stay_time" :formatter="formatTime" label="人均停留时长">
                </el-table-column>
                <el-table-column prop="average_open_stay_time" :formatter="formatTime" label="次均停留时长">
                </el-table-column>
                <el-table-column prop="average_visit_depth" label="平均访问深度">
                </el-table-column>
            </el-table>
        </el-row>
        <div class="ly-flex">
            <div class="ly-flex-1" id="pie" :style="{height: '300px'}"></div>
            <div class="ly-flex-1" id="time" :style="{height: '300px'}"></div>
            <div class="ly-flex-1" id="myChart" :style="{height: '300px'}"></div>
        </div>

    </div>
</template>
<script>
import request from "../../../js/request.js";
import { getSplitTime, formatTime } from "../../../utils/time.js";
import { getLeave } from "../../../api/platform.js";
import LYBarrierfunction from "@/utils/task.js";
// Vue.prototype.$echarts = echarts

export default {
  name: "leave",
  data: function() {
    return {
      trList: [],
      selected: "",
      timeValue: "",
      chnList: ["a", 3, 4, 5, 9],
      test: ''
    };
  },
  updated() {
    console.log('updated')
    console.log(this.timeValue[0])
    console.log(this.timeValue[1])
  },
  mounted() {
    console.log('mounted6666666666');

  },
  beforeUpdate() {
console.log('beforeUpdate')
  },
  methods: {
    formatTime(trow, column, cellValue, index) {
      return formatTime(cellValue);
    },
    openByDialog() {
      this.calendar.show = true;
    },
    closeByDialog() {
      this.calendar.show = false;
    },
    setTimeDate(row, column, cellValue, index) {
      return new Date(cellValue).toLocaleDateString();
    },
    pie: function() {
      const myChart = this.$echarts.init(document.getElementById("pie"));
      myChart.setOption({
        title: {
          text: "访问来源"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: "渠道分布",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 335,
                name: "直接访问"
              },
              {
                value: 310,
                name: "邮件营销"
              },
              {
                value: 234,
                name: "联盟广告"
              },
              {
                value: 135,
                name: "视频广告"
              },
              {
                value: 1548,
                name: "搜索引擎"
              }
            ]
          }
        ]
      });
    },
    time: function() {
      const myChart = this.$echarts.init(document.getElementById("time"));
      myChart.setOption({
        title: {
          text: "访问时长",
          subtext: "数据来自网络"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },

        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: ["0-2", "5-10", "10-30", "30-50", "50-100", ">100"]
        },
        series: [
          {
            name: "访问时长",
            type: "bar",
            data: [182, 289, 934, 970, 131, 630]
          }
        ]
      });
    },
    echate: function() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "统计表"
        },
        tooltip: {},
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "line",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    },
    onbtn: function() {
      // this.pie();
      // this.time();
      if (!this.timeValue) {
        this.$alert("请输入查询的日期", "请输入查询的日期", {
          confirmButtonText: "确定"
        });
        return;
      }

      //切割时间间隔
      // console.log(this.timeValue[0])
      // console.log(this.timeValue[1])


      var date1 = this.timeValue[0].getTime();
      var date2 = this.timeValue[1].getTime();
      
      
      const timeList = getSplitTime(date1, date2 + 86400000, 86400000);
      // this.trList = [];
      // for (let i = 0; i < timeList.length; i++) {
      //   const data = {
      //     ts: timeList[i][0],
      //     te: timeList[i][1]
      //   };
      //   this.sfle(data, data.ts);
      // }
      this.summary(timeList);
      //  getLeave(date1 * 0.001,  date2 * 0.001)
      // date1 = date1 * 0.001;
      // date2 = date2 * 0.001;
      // const data = {
      //   ts: date1,
      //   te: date2
      // };
      // request.ajax(
      //   "/api/yy/summary",
      //   data,
      //   function(msg) {
      //     var data = msg.data;
      //     this.trList.push(data);
      //   }.bind(this)
      // );
    },

    summary(timeList) {
      var bf = new LYBarrierfunction();
      const trList = [];
      for (let i = 0; i < timeList.length; i++) {
        const body = {
          ts: timeList[i][0],
          te: timeList[i][1]
        };
        bf.task(function(task) {
          request.ajax(
            "/api/yy/summary",
            body,
            function(msg) {
              const data = msg.data;
              data["timestamp"] = body.ts * 1000;


              for (let i = 0; i < trList.length; i++) {
                if (trList[i].timestamp < data["timestamp"]) {
                  //添加到前一位  修改到一次加载
                  trList.splice(i, 0, data);
                  task.backTask();
                  // break
                  return;
                }
              }


              trList.push(data);
              console.log('---');
              task.backTask();
            }.bind(this)
          );
        });
      }
      bf.barrierFunc(
        function() {
          console.log("完成");

          this.trList = trList;
        }.bind(this)
      );

      // var pList = []
      // for (let i = 0; i < timeList.length; i++) {
      //   const data = {
      //     ts: timeList[i][0],
      //     te: timeList[i][1]
      //   };
      //   const p = Promise(function(resolve, reject) {
      //     request.ajax(
      //       "/api/yy/summary",
      //       data,
      //       function(msg) {
      //         const data = msg.data;
      //         data["timestamp"] = ts * 1000;
      //         for (let i = 0; i < this.trList.length; i++) {
      //           if (this.trList[i].timestamp < data["timestamp"]) {
      //             //添加到前一位  修改到一次加载
      //             this.trList.splice(i, 0, data);
      //             resolve(data)
      //             // break
      //             return;
      //           }
      //         }
      //         this.trList.push(data); //排序
      //       }.bind(this)
      //     );
      //   });
      //   pList.push(p)
      // }

      // Promise.all(pList).then(function(data) {
      //   console.log(data)
      // })
    },

    sfle(data, ts) {
      //         import LYBarrierfunction from '../../utils/task.js'
      // var bf = new LYBarrierfunction()

      // const

      request.ajax(
        "/api/yy/summary",
        data,
        function(msg) {
          var data = msg.data;
          data["timestamp"] = ts * 1000;
          for (let i = 0; i < this.trList.length; i++) {
            if (this.trList[i].timestamp < data["timestamp"]) {
              //添加到前一位  修改到一次加载
              this.trList.splice(i, 0, data);
              // break
              return;
            }
          }
          this.trList.push(data); //排序
        }.bind(this)
      );
    }
  }
};
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/flex.scss";
</style>
<style>
  .el-date-editor .el-range-separator{
    width: 6%;
  }
  .datatable{
    padding-top: 40px;
  }
</style>
