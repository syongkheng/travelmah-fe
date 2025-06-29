import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/main.css'
import clickOutside from './directives/clickOutside'

const app = createApp(App)
app.directive('click-outside', clickOutside)

app.use(createPinia())
app.use(router)

app.use(ElementPlus)
app.mount('#app')
