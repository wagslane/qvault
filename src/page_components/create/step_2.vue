<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body center-text">
        <StepProgress :filled="1" />
        <h1>Key Backup</h1>
        <h2>
          Will you use a <a
            href="https://amazon.com"
            class="link"
          >Q Card?</a>
        </h2>

        <h3>
          A Q Card is a plastic card that allows you to restore vault access if you
          forget your password, and dual encrypt your vault for added security.
        </h3>

        <router-link
          class="btn"
          :to="{name: 'create_step_3'}"
        >
          Yes, use my Q Cards
        </router-link>

        <router-link
          class="link"
          :to="{name: 'create_step_5'}"
        >
          Skip for now
        </router-link>
      </div>

      <div class="footer">
        <div
          class="back"
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>
