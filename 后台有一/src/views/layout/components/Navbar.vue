<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger
        :toggle-click="toggleSideBar"
        :is-active="sidebar.opened"
        class="hamburger-container"
      />
      <breadcrumb />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span>{{name}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <el-button type="text" @click="dialogFormVisible = true">修改密码</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog title="重置密码" :visible.sync="dialogFormVisible" width="25%">
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          class="demo-ruleForm"
        >
          <el-form-item label="登录密码" prop="pass" label-width="80px" class="form">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="checkPass" label-width="80px" class="form">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPassTwo" label-width="80px" class="form">
            <el-input type="password" v-model="ruleForm2.checkPassTwo" auto-complete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePassword">确 定</el-button>
        </div>
      </el-dialog>
    </el-menu>
  </div>
</template>

<script>
/**
 * 导航逐渐
 */
import { alterPassword } from "@/api/login";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger 
  },
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
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error("密码长度在6-20位"));
      } else if (value == this.ruleForm2.pass) {
        callback(new Error("修改密码不能与初始密码相同!"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.checkPass) {
        callback(new Error("修改密码与确认密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      ruleForm2: {
        pass: "",
        checkPass: "",
        checkPassTwo:""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        checkPassTwo: [{ validator: validatePass3, trigger: "blur" }],
      }
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"])
  },
  mounted() {
    
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    //修改密码
    changePassword() {
      //this.dialogFormVisible = !this.dialogFormVisible;
      let amend = this.ruleForm2;
      this.$refs["ruleForm2"].validate(valid => {
        if (valid) {
          alterPassword(amend.pass, amend.checkPass)
            .then(response => {
              let result = response;
              if (result.info == "原密码错误！") {
                this.$message({
                  type:'error',
                  message:'原密码错误！',
                  center:true,
                  duration: 1500
                });
              }else {
                this.logout(); //退出登录
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 45px;
    font-size: 16px;
    color: rgb(59, 58, 58);
    font-weight: bold;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

