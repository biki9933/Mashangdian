<template>
    <div id="backcont">
        <div class="meituan-content">
            <div class="login-cont">
                <div class="meituan-title">扫码点餐登录</div>
                <div class="meituan-user">
                    <p>商户</p>
                    <el-select class="inptflex" v-model="selectedMerchant" placeholder="请选择商户" @change="handleMerchantChange">
                        <el-option
                            v-for="item in merchantList"
                            :key="item.id"
                            :label="item.merchantName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="meituan-user">
                    <p>账号</p>
                    <el-input class="inptflex" v-model="userName" placeholder="请输入账号" :disabled="!selectedMerchant"></el-input>
                </div>
                <div class="meituan-user">
                    <p>密码</p>
                    <el-input class="inptflex" v-model="password" placeholder="请输入密码" show-password :disabled="!selectedMerchant"></el-input>
                </div>
                <el-button type="success" class="meituan-btn" @click="signin()" :loading="load" :disabled="load || !selectedMerchant">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Urls } from '../../api/api.js'

export default {
    data() {
        return {
            load: false,
            userName: '',
            password: '',
            selectedMerchant: '',
            merchantList: [],
            Urls: Urls
        }
    },
    created() {
        this.getMerchantList()
    },
    methods: {
        async getMerchantList() {
            try {
                const res = await new this.Request(this.Urls.admin.merchantList).modeget()
                console.log('商户列表响应:', res)
                
                if (res.code === 0) {
                    this.merchantList = res.merchantList
                } else {
                    this.$message.error(res.msg || '获取商户列表失败')
                }
            } catch (e) {
                console.error('获取商户列表错误:', e)
                this.$message.error('获取商户列表失败')
            }
        },

        handleMerchantChange(merchantId) {
            this.userName = ''
            this.password = ''
        },

        async signin() {
            if (!this.selectedMerchant) {
                this.$message.warning('请选择商户！')
                return
            }
            if (!this.userName) {
                this.$message.warning('请输入用户名！')
                return
            }
            if (!this.password) {
                this.$message.warning('请输入密码！')
                return
            }

            this.load = true
            const loginData = {
                userName: this.userName,
                password: this.password,
                merchantId: this.selectedMerchant
            }

            try {
                const res = await new this.Request(this.Urls.admin.login, loginData).modepost()
                if (res.code === 0) {
                    // 更新vuex状态
                    this.$store.commit('SET_MERCHANT', {
                        id: res.data.adminInfo.merchantId,
                        name: res.data.adminInfo.merchantName
                    })
                    
                    // 保存token
                    this.$store.commit('SET_USER_INFO', {
                        token: res.data.token,
                        userInfo: {
                            userName: this.userName,
                            merchantId: res.data.adminInfo.merchantId
                        }
                    })

                    // 显示成功消息
                    this.$message.success('登录成功')
                    
                    // 获取重定向地址
                    const redirect = this.$route.query.redirect || '/'
                    // 跳转
                    this.$router.push(redirect)
                } else {
                    this.$message.warning(res.msg || '登录失败')
                }
            } catch (e) {
                console.error('登录错误:', e)
                this.$message.error('登录异常，请重试')
            } finally {
                this.load = false
            }
        }
	}
}

</script>

<style scoped="scoped">
#backcont {
	background-image: url(../../../static/login/beijing.jpg);
	background-attachment: fixed;
	background-repeat: no-repeat;
	background-size: cover;
	-webkit-background-size: cover;
	moz-background-size: cover;
	min-height: 100vh;
}
.meituan-content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.login-cont {
	width: 500px;
	height: 300px;
	background: #f9de80;
	border-radius: 5px;
}
.meituan-title {
	text-align: center;
	color: #000000;
	font-size: 30px;
	padding-top: 30px;
	font-family: Arial, Helvetica, sans-serif;
}
.meituan-user {
	width: 400px;
	margin: 0 auto;
	padding-top: 30px;
	height: 40px;
	display: flex;
	align-items: center;
}

.meituan-user p{width: 50px; color: #000000;
font-size:16px;
}

.inptflex{flex: 1;}

.reg-view{
	width: 400px;
	display: flex;
	justify-content: flex-end;
	margin: 0 auto;
	padding-top: 10px;
	cursor:pointer;
}

.meituan-btn {
	width: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 20px auto 0 auto;
	font-size: 16px;
}
</style>
