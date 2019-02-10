<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class= "body">
        <StepProgress :filled="3" />
        <h1>Create a Qcard backup</h1>
        <h2>Backup your vault for safekeeping</h2>
        <form @submit.prevent="save_step_2">

          <div v-if="$root.char_key">
            <div class='highlight-box'>
              <h3>Write the following characters on your Q-Card:</h3>
              <div class='character-code'>
                <div class= 'spacing'>
                  <span>{{$root.char_key}}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <h2>Generating backup key, please wait...</h2>
          </div>
        </form>
      </div>

      <div class="footer">
        <div class="back" @click="$router.go(-1)" />
        <router-link v-if="$root.char_key" :to="{name: 'create_step_4'}">
          <button class="continue">
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
