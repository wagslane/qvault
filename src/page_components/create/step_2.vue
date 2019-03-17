<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body center-text">
        <StepProgress :filled="1" />
        <h1>Key Backup</h1>
        <h2>Will you use a Q Card to backup your access and dual encrypt your vault?</h2>

        <router-link class="btn" :to="{name: 'create_step_3'}">
          Yes, use my Q Card
        </router-link>

        <router-link class="link" :to="{name: 'create_step_5'}">
          Skip for now
        </router-link>
      </div>

      <div class="footer">
        <div class="back" @click="$router.go(-1)">
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>
