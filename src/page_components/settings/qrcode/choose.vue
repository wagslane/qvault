<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Manage Two Factor Encryption</h1>
        <h2>Manage the security of your vault using 2FE</h2>

        <router-link
          class="btn"
          :to="{name: 'settings_qrcode_add_or_change'}"
        >
          <span v-if="($root.qr_required)">
            Change 2FE QR Code
          </span>
          <span v-else>
            Add 2FE QR Code
          </span>
        </router-link>

        <router-link
          v-if="($root.qr_required)"
          class="btn"
          :to="{name: 'settings_qrcode_delete'}"
        >
          Turn off 2FE
        </router-link>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.push({name: 'settings'})"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>
