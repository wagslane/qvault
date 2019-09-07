<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    // qrcode options: https://github.com/soldair/node-qrcode#qr-code-options
    options: {
      type: Object,
      required: false,
      default: () => { return { errorCorrectionLevel:"medium"};}
    },
  },
  // update QR code when props change
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler() {
        this.generate();
      },
    },
  },
  mounted() {
    this.generate();
  },
  methods: {
    generate() {
      QRCode.toCanvas(this.$refs.canvas, this.value, this.options, (err) => {
        if (err) {
          throw err;
        }
      });
    },
  },
};
</script>
