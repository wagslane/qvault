<template>
  <div class="text-input-wrapper">
    <input
      v-if="type!='textarea'"
      ref="input"
      class="input text"
      :value="content"
      :type="typeState"
      :style="{borderRadius: borderRadius}"
      readonly
    >
    <textarea
      v-else
      ref="input"
      class="input textarea"
      :type="typeState"
      :value="content"
      readonly
    />
    <DropdownMenu
      class="dropdown-menu"
      :actions="dropdownMenuActions"
      @showHideSecret="showHideSecret"
      @copyToClipboard="copyToClipboard"
      @showQrCode="showQrCode"
    />
    <AlertMessage
      ref="viewQR"
      :content="content"
      :qr-value="content"
    />
  </div>
</template>

<script>
import DropdownMenu from './DropdownMenu.vue';
import AlertMessage from './AlertMessage.vue';
import HideSVG from '../img/hide.svg';
import ClipboardSVG from '../img/clipboard.svg';
import QRIcon from '../img/qrIcon.svg';

export default{
  components:{
    DropdownMenu,
    AlertMessage
  },
  props:{
    content:{
      type: String,
      default: ''
    },
    type:{
      type: String,
      required: true
    },
    borderRadius:{
      type: String,
      default: '2px'
    },
    qrButton:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      hidden: true,
      copied: false
    };
  },
  computed:{
    typeState(){
      if (!this.hidden && this.type == 'password'){
        return 'text';
      }
      return this.type;
    },
    dropdownMenuActions(){
      let actions = [];
      if (this.content && this.content.length > 0 && this.type == 'password'){
        actions.push({
          label: 'Show / Hide',
          method: 'showHideSecret',
          icon: HideSVG,
        });
      }
      if (this.content && this.content.length > 0){
        if (this.qrButton){
          actions.push({
            label: 'Show QR',
            method: 'showQrCode',
            icon: QRIcon,
            fill: true
          });
        }
        if (this.copied){
          actions.push({
            label: 'Copied!',
            method: 'copyToClipboard',
            icon: ClipboardSVG,
          });
        } else{
          actions.push({
            label: 'Copy',
            method: 'copyToClipboard',
            icon: ClipboardSVG,
          });
        }
      }
      return actions;
    }
  },
  methods:{
    copyToClipboard(){
      window.nodeAPI.electron.clipboard.writeText(this.content);
      this.copied = true;
      setTimeout(() => {this.copied = false;}, 750);
    },
    showHideSecret(){
      this.hidden = !this.hidden;
    },
    showQrCode(){
      this.$refs.viewQR.show();
    }
  }
};
</script>

<style lang="less" scoped>
@import '../styles/colors.less';
@import '../styles/z_indices.less';

.text-input-wrapper{
  position: relative;
  display: flex;
  width: 100%;

  .input {
    flex: 1;
    box-sizing: border-box;
    border: 1px solid @gray-light;
    font-weight: 300;
    background-color: white;
    padding-left: 8px;
    outline: none;
    color: @gray-lightest;
    background-color: @black-darkest;

    &:focus {
      border: 1px solid @gray-light !important;
      outline: none;
    }
  }

  .text{
    height: 47px;
    line-height: 47px;
  }

  .textarea {
    resize: none;
    height: 140px;
    font-family: inherit;
    font-size: inherit;
    padding: 8px;
  }

  .dropdown-menu{
    margin-top: 12px;
  }
}
</style>
