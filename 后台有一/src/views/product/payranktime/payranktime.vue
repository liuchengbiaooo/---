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
        <span class="warp_content">区服选择</span>
        <el-select v-model="areaClothings" @change="area" placeholder="请选择区服">
          <el-option
            v-for="item in areaList"
            :key="item.serverId"
            :label="item.serverId"
            :value="item.serverId"
          ></el-option>
        </el-select>
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
      </el-row>
    </div>
  </div>
</template>

<script>
import TableSettings from "@/components/TableSettings";
import simpleTable from "@/components/SimpleTable";
import { district, payranktime } from "@/api/product";
import { newDate} from "@/utils/newDate";
import { mapGetters } from "vuex";
import { allWatermark } from "@/utils/allWatermark";//水印
export default {
  props: {},
  data() {
    return {
      proList: [],
      selectP: "",
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
      channelSelect: [],
      channelList: [
        {
          id: "all",
          partnerName: "全部"
        }
      ],
      replaceChannel: "all",
      selectDate: '',
      areaList: [],
      areaClothings: "",
      tableData: [],
      tableHeight:0,
      tableHeader:[
        { isShow: true, label: "角色名称", prop: "roleName" },
        { isShow: true, label: "账号ID", prop: "accountId" },
        { isShow: true, label: "渠道ID", prop: "channel" },
        { isShow: true, label: "区服ID", prop: "serverId" },
        { isShow: true, label: "期间支付金额", prop: "pay_total_in" },
        { isShow: true, label: "期间最大支付金额", prop: "max_pay_in" },
        { isShow: true, label: "期间支付次数", prop: "pay_times_in" },
        { isShow: true, label: "历史支付金额", prop: "pay_total" },
        { isShow: true, label: "历史最高金额", prop: "max_pay" },
        { isShow: true, label: "历史支付次数", prop: "pay_times" },
        { isShow: true, label: "首次支付时间", prop: "first_pay_time" , width :'100'},
        { isShow: true, label: "上次支付时间", prop: "last_pay_time" , width :'100'},
        { isShow: true, label: "上次登陆时间", prop: "last_login_time" , width :'100'},
        { isShow: true, label: "注册时间", prop: "register_time" , width :'100'},
        { isShow: true, label: "支付报警(天)", prop: "pay_police" },
        { isShow: true, label: "登陆报警(天)", prop: "login_police" },
      ],
      checkedCities:[
        "角色名称","账号ID","渠道ID","区服ID","期间支付金额","期间最大支付金额",
        "期间支付次数","历史支付金额","历史最高金额","历史支付次数","首次支付时间","上次支付时间",
        "上次登陆时间","注册时间","支付报警(天)","登陆报警(天)"
      ],
      checked:[
        { label: "角色名称", disabled: "disabled" },
        { label: "账号ID"},
        { label: "渠道ID"},
        { label: "区服ID"},
        { label: "期间支付金额"},
        { label: "期间最大支付金额"},
        { label: "期间支付次数"},
        { label: "历史支付金额"},
        { label: "历史最高金额"},
        { label: "历史支付次数"},
        { label: "首次支付时间"},
        { label: "上次支付时间"},
        { label: "上次登陆时间"},
        { label: "注册时间"},
        { label: "支付报警(天)"},
        { label: "登陆报警(天)"},
      ]
    };
  },
  computed: {
    ...mapGetters(["productList","pickerOptions"])
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.handleScroll); //给window添加一个滚动滚动监听事件
    this.proList = this.productList;
    this.selectP = this.productList[0].appId;
    this.seletcPro(this.selectP); //渲染渠道列表
    const time = newDate();
    this.selectDate = time; //默认时间
    this.payranktimes();
  },
  watch: {},
  methods: {
     //滚动事件
    handleScroll() {
      let topSize = document.getElementById("tabHeighe").getBoundingClientRect().top;
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
          "充值排行(日期)" + `.` + type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //用户点击选择产品
    async seletcPro(evevt) {
      this.selectP = evevt;
      //获取渠道信息
      //const result = await channels(this.selectP);
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
      let result = await district(this.selectP); //区服
      this.areaList = result.info.data.servers;
    },
    //用户点击选择操作系统
    system(event) {
      this.systemCon = event;
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
    //区服选择
    area(evevt) {
      this.areaClothings = evevt;
    },
    //选择日期
    choose(evevt) {
      this.selectDate = evevt;
    },
    //用户点击搜索
    grabble() {
      this.payranktimes();
      allWatermark();
    },
    payranktimes() {
      var appid = this.selectP;
      var system = this.systemCon;
      var channel = this.replaceChannel; //渠道
      var serverId = this.areaClothings;
      var date = this.selectDate;
      payranktime(appid, system, date, channel,serverId)
        .then(response => {
          let relust = response.info.data.rank;
          var tableTop = document.getElementById("tabHeighe").getBoundingClientRect().top;
          var viewportHeight = document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 20;
          if(relust.length > 15){
            this.tableHeight = 1000
          }else{
            this.tableHeight = tableHeight;
          }
          this.tableData = relust;
        })
        .catch(error => {
          console.log(error);
        });
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

<style scoped rel="stylesheet/scss" lang="scss" >
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

.chartCenter {
  margin: 10px 0px 10px 0px;
}
</style>


<style>
#realTime_operate_tab {
  margin-top: 20px;
}
.el-tabs__header {
  margin: 15px 0 0px;
}
.el-range-separator {
  padding: 0px !important;
}
</style>
