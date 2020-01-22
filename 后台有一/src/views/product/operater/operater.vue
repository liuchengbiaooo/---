<template>
  <div class="ly-flex">
    <div class="clearFix" id="head">
      <div class="ly-flex-1 fl warp" style="margin-left: 0px;">
        <span class="warp_content">产品选择</span>
        <el-select v-model="channelCon" @change="seletcPro" placeholder="产品数据" filterable>
          <el-option
            v-for="item in proList"
            :key="item.appid"
            :label="item.appName"
            :value="item.appId"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">渠道选择</span>
        <el-select v-model="channelSelect" @change="channel" placeholder="渠道名" filterable multiple>
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
        <span class="warp_content">用户类型</span>
        <el-select v-model="userClassify" @change="changeClassify" placeholder="用户类型">
          <el-option
            v-for="item in userlist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">时间粒度</span>
        <el-select v-model="itemCon" @change="granularity" placeholder="时间粒度">
          <el-option
            v-for="item in itemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp" v-show="switchover">
        <el-date-picker
          v-model="selectDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="choose"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>

      <div class="ly-flex-1 fl warp">
        <TableSettings
          :checkedCities="checkedCitieList"
          :checked="checkedList"
          @handleCheckedCitiesChange="handleCheckedCitiesChange"
        ></TableSettings>
      </div>
      <div class="ly-flex-1 fl warp" v-show="isShow">
        <el-date-picker
          v-model="selectDateTwo"
          type="date"
          placeholder="选择日期"
          @change="chooseTwo"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>

      <div class="ly-flex-1 fl warp" @click="grabble">
        <el-button type="primary">搜索</el-button>
      </div>

      <div class="ly-flex-1 fl">
        <HelpDocument :help="help"></HelpDocument>
      </div>
    </div>
    <div>
      <div class="ly-flex-1">
        <el-tabs v-model="tabSel" id="realTime_operate_tab" type="card" @tab-click="handleClick">
          <el-tab-pane
            :label="'新增'+user"
            :name="user == '设备'?'device': user == '角色'?'role':user == '账号'?'account':''"
          ></el-tab-pane>
          <el-tab-pane
            :label="'活跃'+user"
            :name="user == '设备'?'activeDevice': user == '角色'?'activeRole':user == '账号'?'activeRccount':''"
          ></el-tab-pane>
          <el-tab-pane
            :label="'付费'+user"
            :name="user == '设备'?'rechargePdevice': user == '角色'?'rechargeProle':user == '账号'?'rechargePaccount':''"
          ></el-tab-pane>
          <el-tab-pane label="总付费金额" name="summoney"></el-tab-pane>
          <el-tab-pane
            :label="'新增付费'+user"
            :name="user == '设备'?'addrechargeDevice': user == '角色'?'addrechargeRole':user == '账号'?'addrechargeAccount':''"
          ></el-tab-pane>
          <el-tab-pane label="新增付费金额" name="addreahargeNum"></el-tab-pane>
          <el-tab-pane label="付费率" name="fuPerscent"></el-tab-pane>
          <el-tab-pane label="新增付费率" name="addfuPerscent"></el-tab-pane>
          <el-tab-pane label="付费arpu" name="fuarpu"></el-tab-pane>
          <el-tab-pane label="新增付费arpu" name="adddfuarpu"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div id="realTime_operate_chart" :style="{height:'300px'}"></div>
      </div>
      <div class="export">
        <div class="derive">
          <ul class="warp">
            <li @click="exportExcel('csv')">CSV</li>
            <li @click="exportExcel('xlsx')">Excel</li>
          </ul>
        </div>
        <el-row id="realTime_operate_table">
          <!-- <el-table-column prop="date" label="日期" align="center" width="125" ></el-table-column> -->
          <div id="tabHeighe">
            <simpleTable
              :tableData="operateData"
              :tableHeader="this.tableHeader"
              :tableHeight="tableHeight"
              class="table"
            ></simpleTable>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import TableSettings from "@/components/TableSettings";
import simpleTable from "@/components/SimpleTable";
import HelpDocument from "@/components/HelpDocument";
import { mapGetters } from "vuex";
import { getCPList, channels } from "@/api/realtime";
import { operationForms } from "@/api/product";
import { newDate, getBeforeDate, getMyDay } from "@/utils/newDate";
import { Message, MessageBox } from "element-ui";
import { allWatermark } from "@/utils/allWatermark"; //水印

export default {
  name: "operater",
  data() {
    return {
      user: "角色",
      selectP: "",
      channelCon: "",
      appName: "",
      systemCon: "all",
      selectDate: [],
      selectDateTwo: "",
      isShow: false,
      switchover: true,
      datetime: "",
      newAddRoleCount: "",
      activeRoleCount: "",
      newAddPayCount: "",
      payRoleCount: "",
      channelSelect: [],
      itemCon: "day",
      userClassify: "role",
      tabSel: "role",
      operateData: [],
      selectData: [],
      channelList: [
        {
          id: "all",
          partnerName: "全部"
        }
      ],
      itemList: [
        {
          value: "hour",
          label: "小时"
        },
        {
          value: "day",
          label: "天"
        }
      ],
      proList: [],
      userlist: [
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
      replaceChannel: "all",
      transition: false,
      tableHeader: [
        { isShow: true, label: "日期", prop: "selectDate" },
        { isShow: true, label: "产品", prop: "productName" },
        { isShow: true, label: "新增人数", prop: "create" },
        { isShow: true, label: "活跃人数", prop: "active" },
        { isShow: true, label: "总付费人数", prop: "pay" },
        { isShow: true, label: "总付费金额", prop: "pay_money" },
        { isShow: true, label: "新增付费人数", prop: "new_pay" },
        { isShow: true, label: "新增付费金额", prop: "new_pay_money" },
        { isShow: true, label: "付费率", prop: "pay_rate" },
        { isShow: true, label: "新增付费率", prop: "new_pay_rate" },
        { isShow: true, label: "活跃arpu", prop: "active_arpu" },
        { isShow: true, label: "付费arpu", prop: "pay_arpu" },
        { isShow: true, label: "新增付费arpu", prop: "new_pay_arpu" },

        { isShow: true, label: "分享人数", prop: "share_user" },
        { isShow: true, label: "分享次数", prop: "share_times" },
        { isShow: true, label: "分享回流比", prop: "share_enter_per" },
        { isShow: true, label: "分享新增", prop: "share_enter_new_user" },
        { isShow: true, label: "回流次数", prop: "share_enter_times" }
      ],
      checkedCitieList: [
        "日期",
        "产品",
        "新增人数",
        "活跃人数",
        "总付费人数",
        "总付费金额",
        "新增付费人数",
        "新增付费金额",
        "付费率",
        "新增付费率",
        "活跃arpu",
        "付费arpu",
        "新增付费arpu",

        "分享人数",
        "分享次数",
        "分享回流比",
        "分享新增",
        "回流次数"
      ],
      checkedList: [
        { label: "日期", disabled: "disabled" },
        { label: "产品", disabled: "disabled" },
        { label: "新增人数" },
        { label: "活跃人数" },
        { label: "总付费人数" },
        { label: "总付费金额" },
        { label: "新增付费人数" },
        { label: "新增付费金额" },
        { label: "付费率" },
        { label: "新增付费率" },
        { label: "新增付费arpu" },
        { label: "付费arpu" },

        { label: "活跃arpu" },
        { label: "分享人数" },
        { label: "分享次数" },
        { label: "分享回流比" },
        { label: "分享新增" },
        { label: "回流次数" }
      ],
      tableHeight: 0,
      help: {
        name: "运营报表",
        data: [
          {
            name: "设备",
            address: "按手机设备码去重统计"
          },
          {
            name: "账号",
            address: "按SDK账号去重统计"
          },
          {
            name: "角色",
            address: "按游戏内创角去重统计"
          },
          {
            name: "人数",
            address: "按选择的用户类型统计"
          },
          {
            name: "分享人数",
            address: "成功分享游戏或游戏内页面的去重用户数"
          },
          {
            name: "分享回流比",
            address: "回流次数 / 分享次数"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["productList", "pickerOptions"])
  },
  watch: {
    operateData(val) {
      if (val.length > 0) {
        this.newadd("新增角色", "create"); //数据拿到，构建图表
      }
    }
  },
  methods: {
    //滚动事件
    handleScroll() {
      let topSize = document.getElementById("tabHeighe").getBoundingClientRect()
        .top;
      let topSizeTwo = topSize - 80;
      let headSizeTwo = document.getElementById("head");
      if (topSizeTwo <= 0) {
        headSizeTwo.classList.add("location");
      } else {
        headSizeTwo.classList.remove("location");
      }
    },
    //表格设置
    handleCheckedCitiesChange(value) {
      let btn = value;
      this.tableHeader.forEach(item => {
        if (btn.indexOf(item.label) == "-1") {
          item.isShow = false;
        } else {
          item.isShow = true;
        }
      });
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
    //点击tab
    handleClick(tab, event) {
      if (tab) {
        tab.name == "device"
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
          : tab.name == "rechargePdevice"
          ? this.newadd("付费设备", "pay") //付费设备
          : tab.name == "rechargeProle"
          ? this.newadd("付费角色", "pay") //付费角色
          : tab.name == "rechargePaccount"
          ? this.newadd("付费账号", "pay") //付费账号
          : tab.name == "summoney"
          ? this.newadd("总付费金额", "pay_money") //总付费金额
          : tab.name == "addrechargeDevice"
          ? this.newadd("新增付费设备", "new_pay") //新增付费设备
          : tab.name == "addrechargeRole"
          ? this.newadd("新增付费角色", "new_pay") //新增付费角色
          : tab.name == "addrechargeAccount"
          ? this.newadd("新增付费账号", "new_pay") // 新增付费账号
          : tab.name == "addreahargeNum"
          ? this.newadd("新增付费金额", "new_pay_money") //新增付费金额
          : tab.name == "fuPerscent"
          ? this.newadd("付费率", "pay_rate") //付费率
          : tab.name == "addfuPerscent"
          ? this.newadd("新增付费率", "new_pay_rate") //新增付费率
          : tab.name == "fuarpu"
          ? this.newadd("付费arpu", "pay_arpu") //付费arpu
          : tab.name == "adddfuarpu"
          ? this.newadd("新增付费arpu", "new_pay_arpu")
          : ""; //新增付费arpu
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

    //用户类型
    changeClassify(env) {
      env == "role"
        ? (this.user = "角色")
        : env == "account"
        ? (this.user = "账号")
        : env == "device"
        ? (this.user = "设备")
        : env == "device";
      this.userClassify = env;
      //this.statement();
    },

    //用户选择产品
    seletcPro(env) {
      this.channelCon = env;
      this.channelList = [
        {
          id: "all",
          partnerName: "全部"
        }
      ]; //先将数组还原
      this.channelSelect = ["all"]; //将渠道的id还原
      this.replaceChannel = "all"; //将参数渠道还原
      let newly = [];
      this.productList.forEach(item => {
        if (env == item.appId) {
          newly.push(item.channel);
        }
      });
      const arr = this.channelList.concat(...newly);
      this.channelList = arr;
    },

    //点击tab更新图表
    newadd(type, dataType) {
      const operateData = this.operateData;
      var xDate = [];
      var yData = [];
      operateData.forEach(item => {
        //xDate.unshift(item.selectDate);
        if (item.selectDate !== "总计") {
          xDate.unshift(item.selectDate);

          if (dataType == "pay_rate" || dataType == "new_pay_rate") {
            //这边对百分号进行处理
            yData.unshift(parseFloat(item[dataType]));
          } else {
            yData.unshift(item[dataType]);
          }
        }
      });
      var name = type;
      this.setAllOption(xDate, yData, name);
    },

    //查询运营报表
    statement() {
      const appid = this.channelCon;
      const start_date = this.selectDate[0];
      const end_date = this.selectDate[1];
      const type = this.userClassify;
      const system = this.systemCon;
      const channel = this.replaceChannel; //渠道
      const time_interval = this.itemCon;
      const operData = [];
      var result;
      var productName; //匹配的产品名
      var selectDate; //判断是小时还是日返回不同的时间
      operationForms(
        appid,
        start_date,
        end_date,
        type,
        system,
        channel,
        time_interval
      )
        .then(response => {
          this.operateData = [];
          result = response.info.data.list;
          var tableTop = document
            .getElementById("tabHeighe")
            .getBoundingClientRect().top;
          var viewportHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 20;
          this.tableHeight = 1000;
          // if (result.length > 15) {
          //   this.tableHeight = 1000;
          // } else {
          //   this.tableHeight = tableHeight;
          // }

          this.productList.forEach(item => {
            //加上产品
            if (item.appId == this.channelCon) {
              productName = item.appName;
            }
          });

          result.forEach(item => {
            if (item.date !== "总计") {
              if (this.itemCon == "day") {
                //对时间继续处理
                item.selectDate = item.date + getMyDay(new Date(item.date)); //给日期加上星期几
              } else if (this.itemCon == "hour") {
                item.selectDate = item.time_section;
              }
            } else {
              item.selectDate = item.date;
            }
            item.productName = productName; //将返回的id换成名字
            item.pay_rate = item.pay_rate + `%`;
            item.new_pay_rate = item.new_pay_rate + `%`;
          });
          this.operateData = result;
        })
        .catch(error => {
          console.log(error);
        });
    },

    //用户选择时间段后触发的事件
    choose(event) {
      this.selectDate = event;
      // this.statement();
    },

    //用户选择时间点触发的事件
    chooseTwo(event) {
      const time = [event, event];
      this.selectDate = time;
      //this.statement();
    },

    //用户选择渠道后触发的事件
    channel(event) {
      if (event.indexOf("all") == "-1") {
        //选择了全部 传all就行
        let channel = event.join(",");
        this.replaceChannel = channel;
      } else {
        this.replaceChannel = "all";
      }

      this.channelSelect = event; //多选必须是数组
    },

    //用户选择操作系统
    system(event) {
      this.systemCon = event;
      //this.statement();
    },

    //用户选择时间粒度触发的事件
    granularity(event) {
      if (event == "day") {
        this.isShow = false;
        this.switchover = true;
      } else {
        this.isShow = true;
        this.switchover = false;
      }
      this.itemCon = event;
      // this.statement();
    },
    //点击搜索
    grabble() {
      this.statement();
      allWatermark();
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll); //给window添加一个滚动滚动监听事件
    this.proList = this.productList;
    this.channelCon = this.productList[0].appId;
    this.seletcPro(this.channelCon); //渲染渠道列表
    const time = newDate();
    const eightDays = getBeforeDate(8);
    this.selectDate = [eightDays, time]; //默认时间
    //this.getproList(); //拿到产品列表
    this.grabble(); //页面初始化发请求

    const realTimeChart = this.$echarts.init(
      document.querySelector("#realTime_operate_chart")
    );
    realTimeChart.setOption({
      tooltip: {
        trigger: "axis"
      },
      grid: {},
      xAxis: {
        name: "时间",
        type: "category"
        //data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value"
        //data: [0, 1000, 2000, 3000, 4000, 5000]
      },
      series: [{ type: "line" }]
    });
  },

  //移除掉这个window添加的监听事件，要不然在别的界面也会出发滚动监听
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  },
  components: {
    TableSettings,
    simpleTable,
    HelpDocument
  }
};
</script>

<style scoped lang="scss">
.location {
  position: fixed;
  top: 0;
  z-index: 9999;
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
</style>

<style>
#realTime_operate_tab {
  margin-top: 10px;
}
.el-tabs__header {
  margin: 15px 0 0px;
}
.el-range-separator {
  padding: 0px !important;
}
</style>
