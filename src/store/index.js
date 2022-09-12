import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import { constants } from '../config/constants'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem(constants.LOCALSTORAGE_TOKEN_KEY) || null,
    user: {},
    tasks: [],
  },
  mutations: {
    authenticate(state, token, user) {
      state.token = token;
      state.user = user;

      localStorage.setItem(constants.LOCALSTORAGE_TOKEN_KEY, token);
    },
    logout(state) {
      state.token = null;
      state.user = {};

      localStorage.setItem(constants.LOCALSTORAGE_TOKEN_KEY, '');
    },
  },
  actions: {
    async register(context, payload) {
      try {
        const registerResponse = await axios.put('/api/auth', payload);

        if (registerResponse.data.error)
          return Promise.reject(_.get(registerResponse, 'data.message'));
        else
          return Promise.resolve(_.get(registerResponse, 'data.message'));

      } catch (error) {
        // 400 responses are passed to axios catch in error.response
        return Promise.reject(_.get(error.response, 'data.message'));
      }
    },
    async login(context, payload) {
      try {
        const loginResponse = await axios.get(`/api/auth?email=${payload.email}&password=${payload.password}`);

        if (loginResponse.data.error)
          return Promise.reject(_.get(loginResponse, 'data.message'));
        else {
          context.commit('authenticate', 'logged', loginResponse.data.user);
          return Promise.resolve();
        }
      } catch (error) {
        return Promise.reject(_.get(error.response, 'data.message'));
      }
    },
    async logout(context, payload) {
      try {
        context.commit('logout');
      } catch (error) {
        console.log(error);
      }
    },
    async login_with_linkedin(context, payload) {
      try {
        context.commit('authenticate', 'logged', {});
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(_.get(error.response, 'data.message'));
      }
    },
    async register_with_linkedin(context, payload) {
      try {
        return Promise.resolve("Successfully created!");
      } catch (error) {
        return Promise.reject(_.get(error.response, 'data.message'));
      }
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  },
});
