import { App } from 'vue';
const modulesFiles = require.context('./', true, /\.(vue)$/);
export default {
  install(app: App) {
    modulesFiles.keys().forEach((e) => {
      const component = modulesFiles(e).default;
      app.component(component.name, component);
    });
  },
};
