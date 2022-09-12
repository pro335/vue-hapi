import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import { router } from './config/router'
import { store } from './store'
import VueAuthenticate from 'vue-authenticate'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = 'http://localhost:3000';

const CLIENT_ID = 'CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';

Vue.use(VueAxios, axios)

Vue.use(VueAuthenticate, {
  baseUrl: 'http://localhost:3000', // Your API domain

  providers: {
    linkedin: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      redirectUri: 'http://localhost:8080/login', // Your client app URL
      name: 'linkedin',
      url: '/api/auth',
      authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
      requiredUrlParams: ['display', 'scope'],
      scope: ['r_emailaddress'],
      state: 'STATE',
      oauthType: '2.0',
    }
  }
})

var vueAuth = VueAuthenticate.factory(Vue.prototype.$http, {
  baseUrl: 'http://localhost:3000', // Your API domain

  providers: {
    linkedin: {
      clientId: '86s820eiswev1w',
      clientSecret: '6DmFiysgRG2jU2lm',
      redirectUri: 'http://localhost:8080/login', // Your client app URL
      name: 'linkedin',
      url: '/api/auth',
      authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
      requiredUrlParams: ['display', 'scope'],
      scope: ['r_emailaddress'],
      state: 'STATE',
      oauthType: '2.0',
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});