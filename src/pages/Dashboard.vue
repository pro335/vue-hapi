<template>
  <div class="row">
    <div class="offset-md-4 col-md-4">
      <h1 class="text-center">Dashboard</h1>
      <h5 id="welcome" class="text-center">😀 😃 Welcome 😀 😃</h5>
    </div>
  </div>
</template>
<script>
export default {
  mounted: function () {
    if (!this.$store.getters.isLoggedIn) this.$router.push("/login");
  },
};
</script>
<style>
#welcome {
  margin-top: 80px;
}
</style>