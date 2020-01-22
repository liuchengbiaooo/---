<template>
  <div class="ly-flex">
    <div class="clearFix distance" id="head">
      <div class="ly-flex-1 fl warp" style="margin-left: 0px;">
        <span class="warp_content">产品选择</span>
        <el-select v-model="selectP" @change="seletcPro" placeholder="请选择产品" filterable>
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
        <el-select
          v-model="channelSelect"
          @change="channel"
          placeholder="请选择渠道"
          filterable
          multiple
        >
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.partnerName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl ly-20 warp">
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
      <div class="ly-flex-1 fl ly-20 warp eventName">
        <span class="warp_content">事件名</span>
        <el-select
          v-model="eventName"
          @change="eventClick"
          placeholder="请选择事件名"
          multiple
          filterable
        >
          <el-option
            v-for="item in eventList"
            :key="item.id"
            :label="item.event"
            :value="item.event"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">角色ID:</span>
        <el-input v-model="roleID" placeholder="请输入角色ID"></el-input>
      </div>
      <div class="ly-flex-1 fl warp">
        <el-date-picker
          v-model="selectDate"
          type="date"
          placeholder="选择日期"
          @change="choose"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div class="ly-flex-1 fl warp">
        <TableSettings
          :checkedCities="checkedCities"
          :checked="checked"
          @handleCheckedCitiesChange="handleCheckedCitiesChange"
        ></TableSettings>
      </div>
      <div class="ly-flex-1 fl warp" @click="grabble">
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="export">
      <div class="derive">
        <ul class="warp">
          <li @click="exportExcel('csv')">CSV</li>
          <li @click="exportExcel('xlsx')">Excel</li>
        </ul>
      </div>
      <el-row id="realTime_operate_tab">
        <div id="tabHeighe">
          <simpleTable
            :tableData="tableData"
            :tableHeader="this.tableHeader"
            :tableHeight="tableHeight"
            class="table"
          ></simpleTable>
        </div>
        <el-pagination
          class="paging"
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="1000"
        ></el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import TableSettings from "@/components/TableSettings";
import simpleTable from "@/components/SimpleTable";
import { newDate } from "@/utils/newDate";
import { customEvent, eventNames } from "@/api/product";
import { mapGetters } from "vuex";
import { allWatermark } from "@/utils/allWatermark";//水印
export default {
  props: {},
  data() {
    return {
      selectP: "",
      proList: [],
      channelSelect: [],
      channelList: [
        {
          id: "all",
          partnerName: "全部"
        }
      ],
      eventName: [],
      roleID: "",
      selectDate: "",
      tableData: [],
      eventList: [],
      replaceChannel: "all",
      page: 1,
      event: "",
      systemCon: "all",
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
      tableHeight:0,
      tableHeader: [
        { isShow: true, label: "应用id", prop: "appId" },
        { isShow: true, label: "游戏版本", prop: "appVersion" },
        { isShow: true, label: "账号id", prop: "accountId" },
        { isShow: true, label: "角色id", prop: "roleId" },
        { isShow: true, label: "角色名称", prop: "roleName" },
        { isShow: true, label: "事件名称", prop: "event" },
        { isShow: true, label: "附加数据", prop: "add" },
        { isShow: true, label: "附加数据2", prop: "add2" },
        { isShow: true, label: "附加数据3", prop: "add3" },
        { isShow: true, label: "平台", prop: "platform" },
        { isShow: true, label: "服务器id", prop: "serverId" },
        { isShow: true, label: "渠道id", prop: "channel" },
        { isShow: true, label: "系统", prop: "systemName" },
        { isShow: true, label: "ip地址", prop: "ip" },
        { isShow: true, label: "数据时间", prop: "time" , width :'100'}
      ],
      checkedCities: [
        "应用id",
        "游戏版本",
        "账号id",
        "角色id",
        "角色名称",
        "事件名称",
        "附加数据",
        "附加数据2",
        "附加数据3",
        "平台",
        "服务器id",
        "渠道id",
        "系统",
        "ip地址",
        "数据时间"
      ],
      checked: [
        { label: "应用id", disabled: "disabled" },
        { label: "游戏版本"},
        { label: "账号id"},
        { label: "角色id"},
        { label: "角色名称"},
        { label: "事件名称" },
        { label: "附加数据" },
        { label: "附加数据2" },
        { label: "附加数据3" },
        { label: "平台" },
        { label: "服务器id" },
        { label: "渠道id" },
        { label: "系统" },
        { label: "ip地址" },
        { label: "数据时间" }
      ]
    };
  },
  computed: {
    ...mapGetters(["productList"])
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.proList = this.productList;
    this.selectP = this.productList[0].appId;
    this.seletcPro(this.selectP); //渲染渠道列表
    const time = newDate();
    this.selectDate = time;
    this.custom();
    this.customName();
  },
  watch: {},
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
          "自定义事件" + `.` + type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //分页
    handleCurrentChange(val) {
      this.page = val;
      this.custom();
    },
    //用户点击选择产品
    seletcPro(evevt) {
      this.selectP = evevt;
      //获取渠道信息

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
        if (evevt == item.appId) {
          newly.push(item.channel);
        }
      });
      const arr = this.channelList.concat(...newly);
      this.channelList = arr;
    },
    //用户点击选择渠道
    channel(event) {
      if (event.indexOf("all") == "-1") {
        //选择了全部 传all就行
        let channel = event.join(",");
        this.replaceChannel = channel;
      } else {
        this.replaceChannel = "all";
      }
      this.channelSelect = event;
    },
    //用户选择时间
    choose(evevt) {
      this.selectDate = evevt;
    },
    //操作系统
    system(evevt) {
      this.systemCon = evevt;
    },
    //搜索
    grabble() {
      this.custom();
      allWatermark();
    },
    //自定义事件
    custom() {
      var appid = this.selectP;
      var date = this.selectDate;
      var channel = this.replaceChannel; //渠道
      var event = this.event;
      var roleId = this.roleID;
      var system = this.systemCon;
      var page = this.page;
      customEvent(appid, date, event, roleId, channel, system, page)
        .then(response => {
          const relust = response.info.data.list;
          var tableTop = document
            .getElementById("tabHeighe")
            .getBoundingClientRect().top;
          var viewportHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 20;
          if (relust.length > 15) {
            this.tableHeight = 1000;
          } else {
            this.tableHeight = tableHeight;
          }
          this.tableData = relust;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //选择事件名
    eventClick(event) {
      let events = event.join(",");
      this.event = events;
    },
    //事件名
    customName() {
      var appid = this.selectP;
      var date = this.selectDate;
      eventNames(appid, date)
        .then(response => {
          const relust = response.info.data.list;
          this.eventList = relust;
        })
        .catch(error => {});
    }
  },
//移除掉这个window添加的监听事件，要不然在别的界面也会出发滚动监听
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  },
  components: {
    simpleTable,
    TableSettings
  }
};
</script>

<style scoped>
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
.distance {
  margin-bottom: 15px;
}
.paging {
  position: absolute;
  right: 0;
}
.chartCenter {
  margin: 10px 0px 10px 0px;
}
.eventName {
  width: 350px;
}
</style>


<style>
#realTime_operate_tab {
  margin: 20px 0px 20px 0px;
}
.el-tabs__header {
  margin: 15px 0 0px;
}
.el-range-separator {
  padding: 0px !important;
}
</style>
