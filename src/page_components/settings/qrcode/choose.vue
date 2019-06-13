<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Manage Dual Encryption</h1>
        <h2>Dual encryption enhances the security of your vault</h2>

        <router-link
          class="btn"
          :to="{name: 'settings_qrcode_add_or_change'}"
        >
          <span v-if="($root.qr_required)">
            Change Key Card
          </span>
          <span v-else>
            Add Key Card
          </span>
        </router-link>

        <router-link
          v-if="($root.qr_required)"
          class="btn"
          :to="{name: 'settings_qrcode_delete'}"
        >
          Turn off dual encryption
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
