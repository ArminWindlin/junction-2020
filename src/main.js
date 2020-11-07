import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from './firebase'

Vue.config.productionTip = false

Vue.prototype.$firebase = firebase
Vue.prototype.$db = firebase.firestore();
Vue.prototype.$users = firebase.firestore().collection('users');

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
