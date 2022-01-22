import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App'
import Router from './index.router'

import './styles/global'

createApp(<App />)
  .use(createPinia())
  .use(Router)
  .mount('#app')
