<template>
  <div class="container">
    <nav class="navbar navbar-light bg-light justify-content-between">
      <router-link to="/" class="navbar-brand">Home</router-link>

      <div class="form-inline ml-auto" v-if="!isLoggedIn">
        <router-link class="mr-3" to="register">Sign Up</router-link>
        <router-link to="login">Sign in</router-link>
      </div>

      <div class="form-inline ml-auto" v-if="isLoggedIn">
        <span v-if="isLoggedIn"> <a @click="logout">Sign out</a></span>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>
<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>
<style>
a {
  cursor: pointer;
}
</style>