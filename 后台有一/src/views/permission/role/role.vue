<template>
  <div class="newrole">
    <el-form
      :model="ruleForm2"
      status-icon
      :rules="rules2"
      ref="ruleForm2"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="character">
        <el-form-item label="角色名称" label-width="80px" prop="name" class="form">
          <el-input v-model="ruleForm2.name" :disabled="disabled"></el-input>
        </el-form-item>
        <el-checkbox label="内部账号" class="characte" @change="interior" v-model="checkedCities"></el-checkbox>
        <el-checkbox label="更新渠道" class="characte" @change="renewal" v-model="renewalChannel"></el-checkbox>
      </div>
      <el-form-item label="密码" prop="pass" label-width="80px" class="form">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" label-width="80px" class="form">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <p class="menu">页面权限选择</p>
    <div class="permissions">
      <el-tree
        :data="page"
        show-checkbox
        :default-expanded-keys="[5]"
        node-key="id"
        ref="tree"
        highlight-current
      ></el-tree>
    </div>
    <div class="quanxian">
      <div class="chanpin">
        <p>产品权限</p>
        <div class="table" style="margin-left:30px">
          <!-- <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
            @select="option"
            @select-all="optionAll"
          >
            <el-table-column label width="65">
              <template scope="scope">
                <el-radio
                  :label="scope.row"
                  v-model="templateRadio"
                  @change.native="getTemplateRow(scope.$index,scope.row)"
                >&nbsp</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="appId" label="产品ID" width="120" align="center"></el-table-column>
            <el-table-column prop="appName" label="产品名字" width="120" align="center"></el-table-column>
          </el-table>-->

          <el-select v-model="channelCon" @change="seletcPro" placeholder="产品数据" filterable>
            <el-option
              v-for="item in proList"
              :key="item.appid"
              :label="item.appName"
              :value="item.appId"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="chanpin" style="margin-right: 12px;">
        <p>
          渠道权限
          <span>(请先选择产品)</span>
        </p>
        <div class="table">
          <el-table
            ref="multipleTable2"
            :data="seteData"
            style="width: 100%"
            @select="selectDitch"
            @select-all="selectDitchAll"
            height="193"
          >
            <el-table-column type="selection" width="58"></el-table-column>
            <el-table-column prop="id" label="渠道ID" width="120" align="center"></el-table-column>
            <el-table-column prop="partnerName" label="渠道名字" width="120" align="center"></el-table-column>
          </el-table>
          <div class="buton">
            <button class="qdok" @click="productOK">确定</button>
          </div>
        </div>
      </div>
    </div>
    <div class="collect">
      <el-table ref="collect" :data="sumData" style="width: 100%" border>
        <el-table-column prop="appId" label="产品ID" width align="center"></el-table-column>
        <el-table-column prop="appName" label="产品名字" width align="center"></el-table-column>
        <el-table-column prop="id" label="渠道ID" width align="center"></el-table-column>
        <el-table-column prop="partnerName" label="渠道名字" width align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="handleDelete(scope.$index,sumData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn">
      <el-button type="danger" @click="cancel">取消</el-button>
      <el-button type="primary" @click="determine">确定</el-button>
    </div>
  </div>
</template>

<script>
import {
  corresponding,
  fun,
  channelData,
  same,
  unique,
  relation,
  MatchRouting,
  CharacterName
} from "@/utils/page";
import { mapGetters } from "vuex";
import { getInfo } from "@/api/login";
import { channels } from "@/api/realtime";
import { RouterJurisdiction, CompileAdministrator } from "@/api/permission";
import { asyncRoutes } from "@/router";
import {
  AdministratorList,
  AddAdministrator,
  DeleteAdministrator
} from "@/api/permission";
export default {
  props: ["clickType", "row", "disabled"],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error("密码长度在6-20位"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var checkAge = (rule, value, callback) => {
      var mobile = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g;
      var repetition = CharacterName(value, this.administrator); //重复角色名称
      if (!value) {
        return callback(new Error("名称不能为空"));
      } else if (value.length < 4 || value.length > 25) {
        callback(new Error("长度在4-25位"));
      } else if (mobile.test(value)) {
        callback(new Error("用户名不能包含特殊字符"));
      } else if (!this.disabled && repetition) {
        callback(new Error("该用户已存在"));
      } else {
        callback();
      }
    };
    return {
      addData: [],
      form: {
        name: "",
        introduce: ""
      },
      page: [],
      messaga: "",
      tableData: [],
      seteData: [],
      multipleSelection: [],
      app: "",
      ditch: "",
      ruleForm2: {
        pass: "",
        checkPass: "",
        name: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ validator: checkAge, trigger: "blur" }]
      },
      part: "",
      id: "",
      SelectChannel: [],
      radio: "",
      templateRadio: "",
      sumData: [],
      obj: {},
      changpin: {},
      ARR: [],
      checkedCities: " ",
      renewalChannel: " ",
      isShow: false,
      level: 3,
      updateChannel: 1,
      proList: [],
      channelCon: ""
    };
  },
  computed: {
    ...mapGetters([
      "shadow",
      "roles",
      "productList",
      "channel",
      "administrator"
    ])
  },
  created() {},
  mounted() {
    this.JurisdictionList();
    this.getInfoList();
    this.proList = this.productList;
    if (this.clickType == "compile") {
      //设置初始值
      console.log("gagasdfdg", this.row);
      let name = this.row.account;
      this.ruleForm2.name = name; //设置 默认名称
      if (this.row.level == "1" || this.row.level == "2") {
        this.checkedCities = true;
      }
      this.row.update_channel == "1"
        ? (this.renewalChannel = true)
        : (this.renewalChannel = false);
    }
  },
  watch: {
    page() {
      //数据回来，对数结构设置默认值
      if (this.clickType == "compile") {
        let arr = same(this.page, this.row.auth);
        this.$refs.tree.setCheckedKeys(arr); //设置 默认页面权限
        let data = [];
        console.log("this.row.appid_auth", this.row.appid_auth);
        this.productList.forEach(item => {
          Object.keys(this.row.appid_auth).forEach(app => {
            //设置默认页面对应渠道的表格
            if (item.appId == app) {
              this.row.appid_auth[item.appId].forEach(id => {
                item.channel.forEach(channel => {
                  if (id == channel.id) {
                    let obj = {};
                    obj.appId = item.appId;
                    obj.appName = item.appName;
                    obj.id = channel.id;
                    obj.partnerName = channel.partnerName;
                    data.push(obj);
                  }
                });
              });
            }
          });
        });
        this.sumData = data;
      }
    }
  },
  methods: {
    //拿到产品和渠道信息
    async getInfoList() {
      const result = await getInfo();

      let productList = result.info.appid_auth;
      this.tableData = this.productList;
      //this.proList = this.productList;
      //console.log("产品", this.productList);
    },

    //选择产品
    seletcPro(event) {
      this.productList.forEach(item => {
        if (item.appId == event) {
          this.seteData = item.channel;
          this.changpin = item;
        }
      });
    },
    //删除渠道表信息
    handleDelete(index, sumData) {
      sumData.splice(index, 1);
    },
    //点击更新渠道按钮
    renewal(event) {
      event == true ? (this.updateChannel = 1) : (this.updateChannel = 0);
      console.log("e", this.updateChannel);
    },
    interior(event) {
      //点击内部账号按钮
      this.isShow = event;
      event == true ? (this.level = 2) : (this.level = 3);
      this.JurisdictionList();
      if (event) {
        //默认内部账号是更新渠道的
        this.renewalChannel = true;
      }
    },
    // getTemplateRow(index, event) {
    //   //用户选择产品
    //   //console.log("ss",index,event)
    //   this.seteData = event.channel;
    //   this.changpin = event;
    // },
    //获取权限路由
    async JurisdictionList() {
      const result = await RouterJurisdiction();
      let menuBar = result.info.auth;
      let menuLists = [];
      //匹配
      if (this.isShow == false) {
        //给内部账号与第三方账号做区别
        menuBar.forEach(item => {
          if (item.id != "1") {
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
          }
        });
      } else if (this.isShow == true) {
        menuLists = MatchRouting(menuBar);
      }
      this.page = menuLists;
    },
    //取消
    cancel() {
      this.ceshe = false;
      this.$store.dispatch("Accordingto", false);
    },
    //用户点确定
    determine() {
      //this.$refs["ruleForm2"].validate(valid => {
      //只有通过表单验证才能发请求
      //if (valid) {
      let account = this.ruleForm2.name; // 名字
      let id = this.row.id; //id
      // let password = this.ruleForm2.checkPass == "" ? "" : this.ruleForm2.checkPass; //密码
      let password = this.ruleForm2.checkPass; //密码
      let pageList = this.$refs.tree.getCheckedKeys(); //页面权限
      let authList = [];
      for (var i = 0; i < pageList.length; i++) {
        fun(pageList[i], this.page, authList); //将子节点对应的父节点匹配
      }
      let auth = authList.join(","); //页面id

      let level = this.level; //等级
      let update_channel = this.updateChannel; //开启渠道更新

      let appid_auth = relation(this.sumData);

      console.log("编辑", update_channel);
      if (this.clickType == "compile") {
        //分为添加和编辑
        this.$confirm("是否修改此管理员信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            CompileAdministrator(
              id,
              password,
              auth,
              appid_auth,
              level,
              update_channel
            ).then(() => {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.$store.dispatch("administrators"); //刷新管理员列表
              this.$store.dispatch("Accordingto", false);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消修改"
            });
          });
      } else if (this.clickType == "add") {
        this.$refs["ruleForm2"].validate(valid => {
          if (valid) {
            this.$confirm("是否添加此管理员信息?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                AddAdministrator(
                  account,
                  password,
                  auth,
                  appid_auth,
                  level,
                  update_channel
                ).then(() => {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.$store.dispatch("administrators"); //刷新管理员列表
                  this.$store.dispatch("Accordingto", false);
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消添加"
                });
              });
          } else {
            this.$message({
              type: "info",
              message: "添加失败!"
            });
          }
        });
      }
      //this.$store.dispatch("Accordingto", false);
      // }
      // else {
      //   if (this.clickType == "add") {
      //     this.$message({
      //       type: "info",
      //       message: "添加失败!"
      //     });
      //   } else if (this.clickType == "compile") {
      //     this.$message({
      //       type: "info",
      //       message: "编辑失败!"
      //     });
      //   }
      // }
      // });
    },
    // //选择产品，单选
    // option(event) {
    //   let app = event;
    //   console.log("xuanz",event)
    //   this.app = corresponding(event);
    //   this.SelectChannel = event;
    // },
    // //选择产品，全选
    // optionAll(event) {
    //   let app = event;
    //   this.app = this.app = corresponding(event);
    //   this.SelectChannel = event;
    // },
    //选择渠道，单选
    selectDitch(event) {
      //console.log("qudao", event);
      this.ditch = event;
    },
    //选择渠道，全选
    selectDitchAll(event) {
      this.ditch = event;
    },
    //选择产品，确定
    productOK() {
      var ChannelList;
      if (this.clickType == "compile") {
         ChannelList = this.sumData;
      } else {
         ChannelList = [];
      }
      if (this.ditch.length > 0 && this.changpin !== "") {
        //进行匹配
        this.ditch.forEach((item, index) => {
          let obj = {};
          obj.appId = this.changpin.appId;
          obj.appName = this.changpin.appName;
          obj.id = item.id;
          obj.partnerName = item.partnerName;
          ChannelList.push(obj);
        });
        this.ditch = "";
      }
      ChannelList.forEach(item => {
        this.ARR.push(item);
      });
      this.ARR.forEach((item, index) => {
        //去重
        for (var i = index + 1; i < this.ARR.length; i++) {
          if (item.appId == this.ARR[i].appId && item.id == this.ARR[i].id) {
            this.ARR.splice(i, 1);
          }
        }
      });
      this.sumData = this.ARR;
    }
  }
};
</script>

<style scoped lang="scss">
#addData {
  margin-top: 20px;
}
.newrole {
  width: 850px;
  height: 750px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
  z-index: 1588;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
  .form {
    margin-top: 15px;
    width: 500px;
  }
  .permissions {
    position: relative;
    left: 80px;
  }
  > p {
    margin-left: 12px;
    font-size: 800;
  }
  .menu {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
  }
  .btn {
    margin-top: 100px;
    margin-left: 600px;
  }
  .quanxian {
    margin-left: 12px;
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    .chanpin {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 12px;
        color: rgb(131, 130, 130);
      }
      .table {
        margin: 25px 0 0 5px;
        position: relative;
        .buton {
          position: absolute;
          bottom: -35px;
          right: 0;
        }
      }
    }
  }
  .collect {
    margin: 40px 12px 0px 12px;
  }
  .character {
    display: flex;
    height: 60px;
    justify-content: flex-start;
    .characte {
      margin: 25px 0px 0px 10px;
    }
  }
  .qdok {
    width: 44px;
    height: 30px;
    text-align: center;
    margin: 0;
    padding: 0;
    border-radius: 6px;
    color: white;
    background-color: rgb(48, 114, 48);
    border: 1px solid white; //自定义边框
    outline: none; //消除默认点击蓝色边框效果
    &:hover {
      background-color: rgb(56, 160, 56);
      color: white;
    }
  }
}
</style>