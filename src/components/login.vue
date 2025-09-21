<template>
  <div class="login">
    <el-dialog v-model="dialogVisible" :title="isLogin ? '用户登录' : '用户注册'" width="500px" draggable>
      <!-- 登录表单 -->
      <el-form v-if="isLogin" ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="switchToRegister" v-if="isLogin">注册账号</el-button>
          <el-button @click="switchToLogin" v-else>已有账号</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useComponentStatusStore } from '@/stores/componentStatus'
import { useUserStore } from '@/stores/user'
import request from '@/utils/http'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useComponentStatusStore()
const userStore = useUserStore()
// 控制对话框显示
const dialogVisible = computed({
  get: () => store.LoginComponent,
  set: (value) => {
    if (value) {
      store.showLoginComponent()
    } else {
      store.hideLoginComponent()
    }
  }
})

// 控制登录/注册切换
const isLogin = ref(true)

// 表单引用
const loginFormRef = ref()
const registerFormRef = ref()

// 登录表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 注册表单数据
const registerForm = ref({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min:2,max:10, message: '请输入正确的昵称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 切换到注册
const switchToRegister = () => {
  isLogin.value = false
}

// 切换到登录
const switchToLogin = () => {
  isLogin.value = true
}

// 处理提交
const handleSubmit = () => {
  if (isLogin.value) {
    loginFormRef.value.validate((valid) => {
      if (valid) {
        // 执行登录逻辑
        console.log('登录:', loginForm.value)
        request.post('/user/login', loginForm.value).then((res) => {
          console.log('登录成功:', res)
          userStore.setUser({
            id: res.data.id,
            username: res.data.username,
            nickname: res.data.nickname,
            avatarUrl: res.data.avatarUrl,
            token: res.data.token
          })
          localStorage.setItem("token",res.data.token)
          store.hideLoginComponent()
          location.reload()
          ElMessage.success('登录成功')
          
        }).catch((err) => {
          console.log('登录失败:', err)
          // 登录失败后处理
        })
      }
    })
  } else {
    registerFormRef.value.validate((valid) => {
      if (valid) {
        // 执行注册逻辑
        console.log('注册:', registerForm.value)
        // 这里可以调用注册API
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.login {
  :deep(.el-dialog) {
    border-radius: 8px;
    
    .el-dialog__header {
      background-color: #f5f7fa;
      border-radius: 8px 8px 0 0;
      padding: 20px;
    }
    
    .el-dialog__body {
      padding: 30px 20px;
    }
    
    .el-dialog__footer {
      padding: 20px;
      border-top: 1px solid #eee;
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: space-between;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 20px;
    
    .el-form-item__label {
      font-weight: 500;
    }
  }
  
  :deep(.el-input__inner) {
    height: 40px;
    line-height: 40px;
  }
}
</style>