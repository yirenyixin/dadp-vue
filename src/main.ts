import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from '@/store';
import * as ElIconModules from '@element-plus/icons-vue';
import globalPlugins from '@/components/global';
import '@/assets/iconfont/iconfont.js';
import '@/assets/iconfont/menufont.js';
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import * as directives from '@/utils/plugin/directive';
import { loadSvg } from '@/utils/plugin/global';
const app = createApp(App);
// 统一注册Icon图标
Object.keys(ElIconModules).forEach((key) => {
  app.component(key, ElIconModules[key as keyof typeof ElIconModules]);
});
// 自定义指令
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});
app.use(globalPlugins).use(store).use(router).mount('#app');
//引入svg
loadSvg();
