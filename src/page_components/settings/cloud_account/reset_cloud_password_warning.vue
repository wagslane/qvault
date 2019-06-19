<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <form
        @submit.prevent="$router.push({
          name: 'utility_reset_cloud_password', 
          params: {donePath: 'settings_cloud_account_login_register'}
        });"
      >
        <div class="body center-text">
          <h1>Are You Sure?</h1>
          <h2>If you reset your cloud password then your existing vault will be overwritten</h2>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="$router.go(-1)"
          >
            <div class="icon" />
          </div>

          <button
            class="continue"
            type="submit"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
