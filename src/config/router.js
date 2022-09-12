import Vue from 'vue'
import VueRouter from 'vue-router'
import RegisterPage from '../pages/Register'
import LoginPage from '../pages/Login'
import DashboardPage from '../pages/Dashboard'

Vue.use(VueRouter);

export const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: DashboardPage,
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterPage
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        }
    ]
});

