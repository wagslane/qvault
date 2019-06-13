<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body center-text">
        <StepProgress :filled="1" />
        <h1>Key Backup</h1>
        <h2>
          <a
            href="https://qvault.io"
            class="link"
          >Will you use Qvault cards?</a>
        </h2>

        <h3>
          Qvault cards are physical plastic cards which allow you to dual encrypt your vault 
          as well as setup a recovery code in case you forget your password.
        </h3>

        <router-link
          class="btn"
          :to="{name: 'create_step_3'}"
        >
          Yes, use my Qvault cards
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
