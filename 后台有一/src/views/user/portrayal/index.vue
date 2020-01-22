<template>
  <div class="ly-flex">
    <div class="clearFix">
      <div class="ly-flex-1 fl">
        <el-select v-model="selectOP" placeholder="请选择产品">
          <el-option
            v-for="item in proList"
            :key="item.appid"
            :label="item.cpName"
            :value="item.appId"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl">
        <el-select v-model="channelConOP" placeholder="请选择渠道">
          <el-option
            v-for="item in channelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl">
        <el-select v-model="systemConOp" placeholder="操作系统">
          <el-option
            v-for="item in systemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl">
        <el-select v-model="yonghuClass" placeholder="用户类型">
          <el-option
            v-for="item in yonghuList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl">
        <el-select v-model="itemConOp" placeholder="时间粒度">
          <el-option
            v-for="item in itemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl">
        <el-date-picker v-model="selectDate" type="date" placeholder="选择日期"></el-date-picker>
      </div>
    </div>
    <div class="content ly-flex clearFix">
      <div class="left fl">
        <p>性别及年龄分布</p>
        <div class="clearFix">
          <div class="ly-flex-1 fl">
            <el-select v-model="selectOP" placeholder="新增用户数">
              <el-option
                v-for="item in proList"
                :key="item.appid"
                :label="item.cpName"
                :value="item.appId"
              ></el-option>
            </el-select>
          </div>
          <div class="ly-flex-1 fl">
            <el-select v-model="selectOP" placeholder="最近七天">
              <el-option
                v-for="item in proList"
                :key="item.appid"
                :label="item.cpName"
                :value="item.appId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div id="chart" :style="{height: '300px',width: '300px'}"></div>
        <p class="text">性别分布</p>
      </div>
      <div class="right fl">
        <div id="age" :style="{height: '308px',width: '600px'}"></div>
        <p class="text">年龄分布</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      selectOP: "",
      channelConOP: "",
      systemConOp: "",
      itemConOp: "",
      tabSel: "newAdd",
      selectDate: "",
      yonghuClass: "",
      operateData: [],
      selectData: [],
      yonghuList: [],
      proList: [],
      channelList: [
        {
          value: 6666,
          label: "渠道1"
        },
        {
          value: 5555,
          label: "渠道2"
        },
        {
          value: 4444,
          label: "渠道3"
        }
      ],
      itemList: [
        {
          value: 1,
          label: "小时"
        },
        {
          value: 2,
          label: "天"
        },
        {
          value: 3,
          label: "月"
        }
      ],
      systemList: [
        {
          value: 1,
          label: "安卓"
        },
        {
          value: 2,
          label: "ios"
        },
        {
          value: 3,
          label: "ios越狱"
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    //   左边园
    const myChart = this.$echarts.init(document.getElementById("chart"));
    let colorList = ["#92C0E1",'E9A084'];
    myChart.setOption({
    //   color: colorList,
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "性别分布",
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
          data: [{ value: 35, name: "男"}, { value: 310, name: "女" }]
        }
      ]
    });
    // 右边树形
    const myAge = this.$echarts.init(document.getElementById("age"));
    let colors = ["#1AAD19"];
    myAge.setOption({
      color: colors,
      xAxis: {
        type: "category",
        data: [
          "17岁以下",
          "18-24岁",
          "25-29岁",
          "30-39岁",
          "40-49岁",
          "50岁以上"
        ]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110],
          type: "bar"
        }
      ]
    });
  },
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearFix {
  zoom: 1;
}
.clearFix::after {
  content: "";
  clear: both;
  display: block;
}
.content {
  margin-top: 20px;
  .text {
    text-align: center;
  }
  .right {
    padding-top: 82px;
    margin-left: 60px;
  }
  #chart {
    margin-left: 50px;
  }
}
</style>
