import { createApp } from 'vue'
import App from './App.vue'
import '../../styles/app.css'

const state = JSON.parse(document.getElementById('initial-state').textContent)

createApp(App, { state }).mount('#app')
