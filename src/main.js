import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
Vue.config.productionTip = false;
import element from "element-ui";
Vue.use(element);
Vue.prototype.$ak = "nPLzTYCVl8nTAVPLgHXHfEDdieBTHSMY";
Vue.prototype.$element = element;
// import VueJsonp from 'vue-jsonp'
import axios from "axios";
// Vue.use(VueJsonp)
Vue.prototype.$axios = axios;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
