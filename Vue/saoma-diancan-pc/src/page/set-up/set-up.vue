<template>
  <div class="ordering" >
    <div class="heading">修改密码</div>
    <div class="set-up-view">
        <div class="set-name">
          <div>用户名:</div>
          <div>{{currentUser.userName}}</div>
        </div>
        <div class="set-name">
          <div>新密码：</div>
          <div><el-input v-model="newPassword" type="password" placeholder="请输入新密码" style="width: 300px"></el-input></div>
        </div>
        <div class="set-name">
          <div>确认新密码：</div>
          <div><el-input v-model="newPassword2" type="password" placeholder="请输入确认新密码" style="width: 300px"></el-input></div>
        </div>
    </div>
    <div class="image-button">
      <el-button type="success" size="medium" @click="updatePassword" >提交</el-button>
    </div>
  </div>
</template>

<script>
export default{
  data() {
    return {
      currentUser: {},
      newPassword:'',
      newPassword2:''
    }
  },
  methods:{
    // 跳转修改
    async updatePassword(){
      if(this.newPassword==''){
        new this.mytitle(this.$message,'error','请输入新密码！').funtitle()
        return;
      }
      if(this.newPassword2==''){
        new this.mytitle(this.$message,'error','请输入确认新密码！').funtitle()
        return;
      }
      if(this.newPassword!=this.newPassword2){
        new this.mytitle(this.$message,'error','确认密码不正确！').funtitle()
        return;
      }
      this.currentUser.newPassword=this.newPassword;
      let res = await new this.Request(this.Urls.m().updatePassword,this.currentUser).modepost()
      if(res.status==200){
        new this.mytitle(this.$message,'info','修改密码成功，重新登录生效！').funtitle()
      }else{
        new this.mytitle(this.$message,'error','执行失败，请联系管理员！').funtitle()
      }
    },

  },
  created() {
    this.currentUser=JSON.parse(localStorage.getItem("currentUser"))
  }
}
</script>

<style scoped="scoped">
.heading{font-size: 20px;
  font-weight: bold;
}
.set-up-view{max-width: 900px;
  margin-top: 30px;
}
.button-view-set{display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}
.set-name{display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.set-name div:nth-child(1){width: 100px;}
.set-name div:nth-child(2){flex: 1;}

.set-up-image{margin-bottom: 30px;}
.set-image img{
  width: 50%;
  height: 100%;
  border-radius: 5px;
}
.set-image{
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
}

.el-input__inner {
  width: 300px;
}
</style>
