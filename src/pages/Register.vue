<template>
  <div class="row">
    <div class="offset-md-4 col-md-4">
      <div v-if="success">
        <div class="alert alert-success">✅ {{ success }}</div>
      </div>
      <div v-else-if="errors && errors.length">
        <div
          v-bind:key="index"
          v-for="(error, index) of errors"
          class="alert alert-danger"
        >
          {{ error }}
        </div>
      </div>

      <h2 class="text-center mt-5 mb-3">Sign Up with</h2>
      <div class="mr-auto ml-auto linkedin_btn">
        <img
          src="https://www.peoplecaddie.com/images/home_v1/sign_in_with_linkedin.png"
          height="38"
          @click="register_with_linkedin"
        />
      </div>

      <h2 class="text-center mt-3 mb-3">- Or -</h2>

      <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-control" v-model="email" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-control" v-model="password" />
      </div>

      <div class="btn btn-success" @click="register">Submit</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errors: [],
      success: false,
    };
  },
  methods: {
    register() {
      const { email, password } = this;

      if (!email) {
        this.success = false;
        this.errors.push("Please type your email.");
        return;
      }

      if (!password) {
        this.success = false;
        this.errors.push("Please type your password.");
        return;
      }

      this.$store
        .dispatch("register", { email, password })
        .then((response) => {
          this.success = response;
          this.errors = [];
          this.email = "";
          this.password = "";
        })
        .catch((error) => {
          this.success = false;
          this.errors.push(error);
        });
    },
    async register_with_linkedin() {
      try {
        await this.$auth.authenticate("linkedin").then(function () {});
      } catch (error) {
        console.log(error);
      }

      this.$store
        .dispatch("register_with_linkedin")
        .then((res) => {
          this.success = res;
        })
        .catch((error) => {
          this.errors.push(error);
        });
    },
  },
};
</script>
<style>
.linkedin_btn {
  cursor: pointer;
  width: 158px;
}
</style>