<template>
  <div>
    <div class="ly-flex">
      <div class="clearFix distance">
        <div class="ly-flex-1 fl warp">
          <el-button type="primary" @click="newRole('add')">新增管理员</el-button>
        </div>
      </div>
      <el-row id="addData">
        <el-table
          :data="addData"
          border
          style="width:100%"
          ref="table"
          :header-cell-style="{'user-select': 'text'}"
        >
          <el-table-column label="角色ID" align="center" prop="id"></el-table-column>
          <el-table-column label="角色姓名" align="center" prop="account"></el-table-column>
          <el-table-column label="上次登录时间" align="center" prop="lastLoginDate"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleEdit(scope,'compile')">编辑权限</el-button>
              <el-popover placement="right-start" width="800" trigger="click">
                <el-table :data="pageData" border>
                  <el-table-column width="50" property="id" label="ID" align="center"></el-table-column>
                  <el-table-column width="100" property="account" label="用户名" align="center"></el-table-column>
                  <el-table-column width="" property="createDate" label="注册时间" align="center"></el-table-column>
                  <el-table-column width="" property="lastLoginIp" label="上次登陆IP" align="center"></el-table-column>
                  <el-table-column width="" property="lastLoginDate" label="上次登陆时间" align="center"></el-table-column>
                  <el-table-column width="100" property="loginTimes" label="登陆次数" align="center"></el-table-column>
                </el-table>
                <el-button slot="reference" @click="examine(scope)">查看</el-button>
              </el-popover>

              <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <role v-if="shadow" :clickType="clickType" :row="row" :disabled="disabled"></role>
  </div>
</template>

<script>
import Role from "../../permission/role/role";
import { mapGetters } from "vuex";
import { AdministratorList, DeleteAdministrator } from "@/api/permission";
export default {
  props: {},
  data() {
    return {
      addData: [],
      clickType: "",
      row: "",
      disabled: false,
      visible: false,
      pageData:[]
    };
  },
  computed: {
    ...mapGetters(["shadow", "administrator",'productList'])
  },
  components: {
    Role
  },
  created() {},
  mounted() {
    this.$store.dispatch("administrators");
  },
  watch: {
    administrator() {
      this.addData = this.administrator;
    }
  },
  methods: {
    //编辑
    handleEdit(scope, compile) {
      this.disabled = true;
      this.clickType = compile;
      this.$store.dispatch("Accordingto", true);
      console.log("row1", scope.row);
      this.row = scope.row;
      console.log("Sssgfag", this.$refs.table);
    },
    //删除
    handleDelete(scope) {
      let id = scope.row.id;
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (id == 1) {
            this.$message({
              type: "success",
              message: "删除失败!"
            });
          } else {
            DeleteAdministrator(id)
              .then(response => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$store.dispatch("administrators"); //刷新管理员列表
              })
              .catch(err => {});
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //查看
    examine(scope) {
    console.log("scope.row",scope.row)
    let appidDate = [];
    let appid_auth = scope.row.appid_auth
      this.productList.forEach(item => {
          Object.keys(appid_auth).forEach(app => {
            //设置默认页面对应渠道的表格
            if (item.appId == app) {
              appid_auth[item.appId].forEach(id => {
                item.channel.forEach(channel => {
                  if (id == channel.id) {
                    let obj = {};
                    obj.appId = item.appId;
                    obj.appName = item.appName;
                    obj.id = channel.id;
                    obj.partnerName = channel.partnerName;
                    appidDate.push(obj);
                  }
                });
              });
            }
          });
        });
      console.log("appidDate",appidDate)
      
      let {id ,account ,createDate ,lastLoginIp,lastLoginDate,loginTimes} = scope.row ;
      let data = {id,account,createDate ,lastLoginIp,lastLoginDate,loginTimes}
      let pageData = [];
      pageData.push(data);
      this.pageData = pageData;
    },
    //新增
    newRole(add) {
      this.disabled = false;
      this.clickType = add;
      //this.message = "";
      this.$store.dispatch("Accordingto", true);
    },
    //取消
    cancel() {
      //this.ceshe = false;
      this.$store.dispatch("Accordingto", false);
    }
  }
};
</script>

<style scoped lang="scss">
#addData {
  margin-top: 20px;
}
</style>
