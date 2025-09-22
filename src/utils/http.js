import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus' // 如果使用Element Plus
import router from '@/router'
// 创建axios实例
const http = axios.create({
    baseURL: "http://localhost:8080/api", // 从环境变量获取基础URL
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})


// 请求拦截器
http.interceptors.request.use(
    config => {
    // 从Pinia store获取token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.user.token}`
    }
    
    // 可以在这里添加其他请求前处理逻辑
     const fullUrl = http.getUri(config)
     console.log('请求:', fullUrl)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据业务状态码处理
    if (res.code !== 1) {
      console.log('业务错误:', res)
      if (res.code === 401 || res.code === 403) { // 假设401或403表示未授权
        const userStore = useUserStore()
        userStore.setLogin(false)
        router.push('/')
      }
    }
    
    return res
  })
 
/**
 * 封装请求方法
 */
const request = {
  /**
   * GET请求
   * @param {string} url 
   * @param {object} params 
   * @param {object} config 
   * @returns {Promise}
   */
  get(url, params = {}, config = {}) {
    console.log('GET请求:', url, params)
    return http.get(url, { params:params, ...config })
  },
  
  /**
   * POST请求
   * @param {string} url 
   * @param {object} data 
   * @param {object} config 
   * @returns {Promise}
   */
  post(url, data = {}, config = {}) {
    console.log('POST请求:', url, data,config)
    return http.post(url, data, config)
  },
  
  /**
   * PUT请求
   * @param {string} url 
   * @param {object} data 
   * @param {object} config 
   * @returns {Promise}
   */
  put(url, data = {}, config = {}) {
    return http.put(url, data, config)
  },
  
  /**
   * DELETE请求
   * @param {string} url 
   * @param {object} params 
   * @param {object} config 
   * @returns {Promise}
   */
  delete(url, params = {}, config = {}) {
    return http.delete(url, { params, ...config })
  },
  
  /**
   * 上传文件
   * @param {string} url 
   * @param {FormData} formData 
   * @param {object} config 
   * @returns {Promise}
   */
  upload(url, formData, config = {}) {
    return http.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  },
  
  /**
   * 下载文件
   * @param {string} url 
   * @param {object} params 
   * @param {string} filename 
   * @returns {Promise}
   */
  async download(url, params = {}, filename = 'file') {
    const response = await http.get(url, {
          params,
          responseType: 'blob'
      })
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
  }
}

export default request