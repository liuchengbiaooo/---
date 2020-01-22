<template>
  <div class="ly-flex">
    <div class="clearFix" id="head">
      <div class="ly-flex-1 fl warp" style="margin-left: 0px;">
        <span class="warp_content">产品选择</span>
        <el-select v-model="selectP" @change="getSelect" placeholder="请选择产品" filterable>
          <el-option
            v-for="item in this.productList"
            :key="item.appid"
            :label="item.appName"
            :value="item.appId"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">渠道选择</span>
        <el-select v-model="channelCon" @change="channel" placeholder="请选择渠道" filterable multiple>
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.partnerName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">操作系统</span>
        <el-select v-model="systemCon" @change="system" placeholder="操作系统">
          <el-option
            v-for="item in systemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">用户分类</span>
        <el-select v-model="classify" placeholder="用户分类" @change="classifys">
          <el-option
            v-for="item in userClassify"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp" @click=" grabble">
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div>
      <div class="ly-flex-1">
        <el-tabs v-model="tabSel" id="realTime_operate_tab" type="card" @tab-click="handleClick">
          <el-tab-pane
            :label="'在线'+user"
            :name="user == '设备'?'onlineActive': user == '角色'?'onlineRole':user == '账号'?'onlineRccount':''"
          ></el-tab-pane>
          <el-tab-pane
            :label="'活跃'+user"
            :name="user == '设备'?'activeDevice': user == '角色'?'activeRole':user == '账号'?'activeRccount':''"
          ></el-tab-pane>
          <el-tab-pane
            :label="'新增'+user"
            :name="user == '设备'?'device': user == '角色'?'role':user == '账号'?'account':''"
          ></el-tab-pane>
          <el-tab-pane label="充值金额" name="recharge"></el-tab-pane>
          <el-tab-pane label="充值人数" name="reahcrgeNum"></el-tab-pane>
        </el-tabs>
      </div>
      <el-row id="realTime_operate_table" class="huleng">
        <el-table :data="operateData" border style="width:1400px" ref="table">
          <span>
            <el-table-column prop="online" :label="'在线'+user" align="center" width></el-table-column>
          </span>
          <el-table-column prop="active" :label="'活跃'+user" align="center" width></el-table-column>
          <el-table-column prop="create" :label="'新增'+user" align="center" width></el-table-column>
          <el-table-column prop="pay_money" label="充值金额" align="center" width></el-table-column>
          <el-table-column prop="pay" label="充值人数" align="center" width></el-table-column>
        </el-table>
      </el-row>
    </div>
    <div>
      <div id="realTime_operate_chart" :style="{height:'300px'}"></div>
    </div>

    <div class="chartCenter" style="margin-left:420px">
      <div class="ly-flex-1">
        <el-checkbox-group v-model="checkItemTwo" size="medium" @change="realData">
          <el-checkbox-button
            v-for="item in checkItemList"
            :label="item.label"
            :key="item.value"
            :value="item.value"
          >{{item.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="export">
      <div class="derive">
        <ul class="warp">
          <li @click="exportExcel('csv')">CSV</li>
          <li @click="exportExcel('xlsx')">Excel</li>
        </ul>
      </div>
      <el-row id="reamTime_selectTable">
        <div id="selectTable">
          <el-table
            :data="selectData"
            border
            height="tableheiht"
            style="width:100%"
            ref="table"
            class="table"
            id="tableHeight"
            :header-cell-style="{'user-select': 'text'}"
          >
            <el-table-column prop="time_section" label="时间" align="center" width="180"></el-table-column>
            <el-table-column prop="product" label="产品" align="center" width></el-table-column>
            <el-table-column prop="gather" label="今日" align="center" width></el-table-column>
            <el-table-column prop="yesterdDayData" label="昨日" align="center" width></el-table-column>
            <el-table-column prop="lastWeekData" label="上周" align="center" width></el-table-column>
            <!-- 默认显示的活跃数 -->
          </el-table>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCPList, channels, dataReport } from "@/api/realtime";
import { getToken } from "@/utils/auth";
import { allWatermark } from "@/utils/allWatermark"; //水印

export default {
  name: "operater",
  data() {
    return {
      user: "角色",
      selectP: "",
      channelCon: [],
      systemCon: "all",
      tabSel: "onlineRole",
      operateData: [],
      selectData: [],
      proList: [],
      tableheiht: 0,
      classify: "role",
      checkItemTwo: ["今日"],
      userClassify: [
        {
          value: "device",
          label: "设备"
        },
        {
          value: "role",
          label: "角色"
        },
        {
          value: "account",
          label: "账号"
        }
      ],
      channelList: [
        {
          id: "all",
          partnerName: "全部"
        }
      ],
      systemList: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: "android",
          label: "安卓"
        },
        {
          value: "ios",
          label: "ios"
        }
      ],
      replaceChannel: "all", //渠道
      checkItemList: [
        {
          label: "今日",
          value: "1"
        },
        {
          label: "昨日",
          value: "2"
        },
        {
          label: "上周",
          value: "3"
        }
      ],
      type: "online"
    };
  },
  computed: {
    ...mapGetters(["productList"])
  },
  watch: {
    selectData(val) {
      if (val.length > 0) {
        //this.newadd("在线角色", "online"); //数据拿到，构建图表
        this.realData(this.checkItemTwo);
      }
    }
  },
  methods: {
    //滚动事件
    handleScroll() {
      var clients =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight; //滚动距离
      let topSize = document.getElementById("selectTable").getBoundingClientRect().top;
      let headSizeTwo = document.getElementById("head");
     
      var tableheiht = document.getElementById("tableHeight");
      if (topSize <= 0) {
        this.tableheiht = clients - 80;
        tableheiht.style.height = clients - 80 + "px";
      }
      let topSizeTwo = topSize - 80;
      if (topSizeTwo <= 0) {
        headSizeTwo.classList.add("location");
      } else {
        headSizeTwo.classList.remove("location");
      }
    },
    handleClick(tab, event) {
      if (tab) {
        tab.name == "ces"
          ? ""
          : tab.name == "onlineActive"
          ? this.newadd("在线设备", "online") //在线设备
          : tab.name == "onlineRole"
          ? this.newadd("在线角色", "online") //在线角色
          : tab.name == "onlineRccount"
          ? this.newadd("在线账户", "online") //在线账号
          : tab.name == "device"
          ? this.newadd("新增设备", "create") //新增设备
          : tab.name == "role"
          ? this.newadd("新增角色", "create") //新增角色
          : tab.name == "account"
          ? this.newadd("新增账号", "create") // 新增账号
          : tab.name == "activeDevice"
          ? this.newadd("活跃设备", "active") //活跃设备
          : tab.name == "activeRole"
          ? this.newadd("活跃角色", "active") //活跃角色
          : tab.name == "activeRccount"
          ? this.newadd("活跃账号", "active") //活跃账号
          : tab.name == "recharge"
          ? this.newadd("充值金额", "pay_money") //充值金额
          : tab.name == "reahcrgeNum"
          ? this.newadd("充值人数", "pay")
          : ""; //充值人数
      }
      return tab;
    },

    setAllOption(xData, yData, name) {
      const realTimeChart = this.$echarts.init(
        document.querySelector("#realTime_operate_chart")
      );
      realTimeChart.setOption({
        xAxis: {
          data: xData
        },
        series: {
          name: name,
          data: yData
        }
      });
    },
    setAllOptionTwo(xData, series) {
      const realTimeChart = this.$echarts.init(
        document.querySelector("#realTime_operate_chart")
      );
      realTimeChart.setOption({
        tooltip: {
          trigger: "axis"
        },

        legend: {
          type: "plain",
          bottom: "0",
          selectedMode: false
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          data: xData
        },
        yAxis: {
          minInterval: 1 //设置Y轴成整数
        },
        series: series
      });
    },
    realData(event) {
      var titleList = event;
      const operateData = this.selectData;
      let xDate = [];
      let type = this.type;
      let series = [
        {
          name: "今日",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#CD5A57"
          },
          areaStyle: {
            color: "rgba(205,90,87,0.3)",
            origin: "start"
          }
        },
        {
          name: "昨日",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#2F4655"
          },
          areaStyle: {
            color: "rgba(47,70,85,0.3)",
            origin: "start"
          }
        },
        {
          name: "上周",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#7DB2B7"
          },
          areaStyle: {
            color: "rgba(125,178,183,0.3)",
            origin: "start"
          }
        }
      ];
      titleList.forEach(title => {
        operateData.forEach(item => {
          if (xDate.length < operateData.length) {
            xDate.unshift(item.time_section);
          }
          series.forEach(tm => {
            if (title == "今日" && tm.name == "今日") {
              tm.data.unshift(Number(item[this.type]));
            } else if (title == "昨日" && tm.name == "昨日") {
              tm.data.unshift(item.history[0][this.type]);
            } else if (title == "上周" && tm.name == "上周") {
              tm.data.unshift(item.history[6][this.type]);
            }
          });
        });
      });
      this.setAllOptionTwo(xDate, series);
    },
    //导出
    exportExcel(type) {
      // .table要导出的是哪一个表格
      var wb = this.XLSX.utils.table_to_book(document.querySelector(".table"));
      /* get binary string as output */
      var wbout = this.XLSX.write(wb, {
        bookType: type,
        bookSST: true,
        type: "array"
      });
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        this.FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "运营报表" + `.` + type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //点击tab更新图表
    newadd(type, dataType) {
      this.type = dataType;
      this.checkItemTwo = ["今日"];
      this.realData(this.checkItemTwo);
      const operateData = this.selectData;
      var xDate = [];
      var yData = [];
      operateData.forEach(item => {
        xDate.unshift(item.time_section);
        yData.push(item[dataType]);
      });
      var name = type;
      //this.setAllOption(xDate, yData, name);
      this.statement();
    },

    // 选择产品后的事件
    getSelect(event) {
      this.selectP = event;
      //获取渠道列表
      this.channelList = [
        {
          id: "all",
          partnerName: "全部"
        }
      ]; //先将数组还原
      this.replaceChannel = "all"; //将参数渠道还原
      this.channelCon = ["all"]; //将渠道的id还原
      let newly = [];
      this.productList.forEach(item => {
        if (event == item.appId) {
          newly.push(item.channel);
        }
      });
      const arr = this.channelList.concat(...newly);

      this.channelList = arr;
    },
    //用户选择渠道
    channel(event) {
      if (event.indexOf("all") == "-1") {
        //选择了全部 传all就行
        let channel = event.join(",");
        this.replaceChannel = channel;
      } else {
        this.replaceChannel = "all";
      }

      this.channelCon = event;

      //this.statement();
    },

    //用户选择操作系统
    system(event) {
      this.systemCon = event;
      //this.statement();
    },

    //选择用户类型
    classifys(env) {
      env == "role"
        ? (this.user = "角色")
        : env == "account"
        ? (this.user = "账号")
        : env == "device"
        ? (this.user = "设备")
        : env == "device";
      this.classify = env;
      //this.statement();
    },
    //用户点击搜索
    grabble() {
      this.statement();
      allWatermark(); //水印
    },
    //查询数据报表（实时）
    statement() {
      var appid = this.selectP;
      var type = this.classify;
      var system = this.systemCon;
      var channel = this.replaceChannel; //渠道
      var operData = [];
      var history;
      var historyOne;
      var historyTwo;
      var product;
      dataReport(appid, type, system, channel)
        .then(response => {
          this.operateData = [];
          const result = response.info.data.hour;

          this.productList.forEach(item => {
            //加上产品
            if (item.appId == this.selectP) {
              product = item.appName;
            }
          });
          var tableheiht = document.getElementById("tableHeight");
          var tableTop = document.getElementById("selectTable").getBoundingClientRect().top;
          var viewportHeight = document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 40; //40
          if (result.length > 15) {
            //对数据进行判断 如果 数据过大 给宽度
            this.tableHeight = 1000;
            tableheiht.style.height = 1000 + "px";
          }else{
            this.tableHeight = tableHeight;
            tableheiht.style.height = tableHeight + "px";
          }
          result.forEach(item => {
            item.gather = item[this.type]; //匹配对应的数据
            item.product = product;
            item.yesterdDayData = item.history[0][this.type]; //昨天的数据
            item.lastWeekData = item.history[6][this.type]; //上周的数据
          });
          this.selectData = result;

          history = response.info.data.day.today;
          historyOne = response.info.data.day.lastDay;
          historyTwo = response.info.data.day.lastWeek;

          historyOne.active = `昨日` + historyOne.active;
          historyOne.online = `昨日` + historyOne.online;
          historyOne.create = `昨日` + historyOne.create;
          historyOne.pay_money = `昨日` + historyOne.pay_money;
          historyOne.pay = `昨日` + historyOne.pay;

          historyTwo.active = `上周` + historyTwo.active;
          historyTwo.online = `上周` + historyTwo.online;
          historyTwo.create = `上周` + historyTwo.create;
          historyTwo.pay_money = `上周` + historyTwo.pay_money;
          historyTwo.pay = `上周` + historyTwo.pay;

          operData.push(history);
          operData.push(historyOne);
          operData.push(historyTwo);
          this.operateData = operData;
        })
        .catch(error => {});
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll); //给window添加一个滚动滚动监听事件
    this.selectP = this.productList[0].appId;
    this.getSelect(this.selectP);
    this.grabble(); //页面初始化请求
    const realTimeChart = this.$echarts.init(
      document.querySelector("#realTime_operate_chart")
    );

    realTimeChart.setOption({
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        axisTick: {
          alignWithLabel: true
        },
        data: [
          "2018-9-12",
          "2018-9-13",
          "2018-9-14",
          "2018-9-15",
          "2018-9-16",
          "2018-9-17",
          "2018-9-18",
          "2018-9-19",
          "2018-9-20"
        ]
      },
      yAxis: {
        // data:[]
      },
      legend: {
        type: "plain",
        bottom: "0",
        selectedMode: false
      },
      series: [{ name: "在线", stack: "总量", data: [], type: "line" }]
    });
  },
  //移除掉这个window添加的监听事件，要不然在别的界面也会出发滚动监听
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  }
};
</script>

<style scoped>
.location {
  position: fixed;
  top: 0;
  z-index: 9999;
}
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
.huleng {
  margin-top: 15px;
}
.warp {
  position: relative;
  margin-left: 10px;
}
.warp_content {
  position: absolute;
  z-index: 999;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin-left: 8px;
  color: #aaafb2;
  cursor: pointer;
}
.chartCenter {
  margin: 10px 0px 10px 0px;
}
.export{
  margin-top: 50px;
}
</style>

<style>
#realTime_operate_tab {
  margin-top: 20px;
}
.el-tabs__header {
  margin: 15px 0 0px;
}
</style>
