<template>
  <div>
    <qrcode-stream @decode="onDecode" @init="onInit"/>
  </div>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

export default {
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },

  methods: {
    onDecode(qrKey) {
      this.$emit("scanned", qrKey);
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        let err = "";
        if (error.name === "NotAllowedError") {
          err = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          err = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          err = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          err = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          err = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          err = "ERROR: Stream API is not supported in this browser";
        }
        this.$emit("scanned", err);
      }
    }
  }
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>
