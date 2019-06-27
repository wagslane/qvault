<template>
  <div class="text-input-wrapper">
    <input
      v-if="type!='textarea'"
      :id="keyboardId"
      ref="input"
      class="input text"
      :class="{missing: isMissing}"
      :type="typeState"
      :value="value"
      :style="{borderRadius: borderRadius}"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
      @blur="hide"
    >
    <textarea
      v-else
      :id="keyboardId"
      ref="input"
      class="input textarea"
      :class="{missing: isMissing}"
      :type="typeState"
      :value="value"
      :placeholder="placeholder"
      :style="{borderRadius: borderRadius}"
      @input="$emit('input', $event.target.value)"
      @blur="hide"
    />
    <dropdown_menu
      class="dropdown-menu"
      :actions="dropdown_menu_actions"
      @show_hide_secret="show_hide_secret"
      @toggle_keyboard="toggle_keyboard"
      @copy_to_clipboard="copy_to_clipboard"
      @generate_password="generate_password"
    />
    <div
      :style="{ visibility: keyboardVisibility, height: keyboardContainerHeight + 'px' }"
      class="keyboardContainer"
    >
      <div class="keyboard">
        <div :class="keyboardId" />
      </div>
    </div>
  </div>
</template>

<script>
import Keyboard from "../locked_dependencies/simple-keyboard/simple-keyboard";
import dropdown_menu from './dropdown_menu.vue';
import HideSVG from '../img/hide.svg';
import KeyboardSVG from '../img/keyboard.svg';
import ClipboardSVG from '../img/clipboard.svg';
import LockSVG from '../img/lock.svg';
import "../locked_dependencies/simple-keyboard/simple-keyboard.css";
import { clipboard } from 'electron';
import { GeneratePassword } from '../lib/QVaultCrypto/QVaultCrypto.js';

export default{
  components:{
    dropdown_menu
  },
  props:{
    defaultValue:{
      type: String,
      required: false,
      default: ''
    },
    value:{
      type: String,
      default: ''
    },
    type:{
      type: String,
      required: true
    },
    keyboardId:{
      type: String,
      required: true
    },
    active:{
      type: Boolean,
      required: false,
      default: false
    },
    borderRadius:{
      type: String,
      default: '2px'
    },
    isMissing:{
      type: Boolean,
      default: false
    },
    generatePassword:{
      type: Boolean,
      default: false
    },
    placeholder:{
      type: String,
      required: false,
      default: ''
    }
  },
  data(){
    return{
      keyboardVisibility: "hidden",
      recentlyClosed: false,
      keyboardContainerHeight: 270,
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
    dropdown_menu_actions(){
      let actions = [
        {
          label: 'Keyboard',
          method: 'toggle_keyboard',
          icon: KeyboardSVG,
        }
      ];
      if (this.value && this.value.length > 0 && this.type == 'password'){
        actions.push({
          label: 'Show / Hide',
          method: 'show_hide_secret',
          icon: HideSVG,
        });
      }
      if (this.value && this.value.length > 0){
        if (this.copied){
          actions.push({
            // length of string must match so pad with spaces
            label: 'Copied!',
            method: 'copy_to_clipboard',
            icon: ClipboardSVG,
          });
        } else{
          actions.push({
            label: 'Copy',
            method: 'copy_to_clipboard',
            icon: ClipboardSVG,
          });
        }
      }
      if (!this.value && this.generatePassword){
        actions.push({
          label: 'Generate Password',
          method: 'generate_password',
          icon: LockSVG,
          fill: true,
        });
      }
      return actions;
    }
  },
  watch: { 
    defaultValue: function(defaultValue) {
      this.$refs.input.value = defaultValue;
      this.$emit('input', this.$refs.input.value);
    },
    active: function(active){
      if (active){
        this.$refs.input.focus();
      }
    }
  },
  mounted: function(){
    if (this.active){
      this.$refs.input.focus();
    }

    this.keyboard = new Keyboard(`.${this.keyboardId}`, {
      preventMouseDownDefault: true,
      theme: "simple-keyboard hg-theme-default custom-theme",
      onKeyPress: btn => this.onKeyPress(btn),
      layout: {
        'default': [
          '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
          'q w e r t y u i o p [ ] \\',
          'a s d f g h j k l ; \'',
          '{shift} z x c v b n m , . /',
          '{space}'
        ],
        'shift': [
          '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
          'Q W E R T Y U I O P { } |',
          'A S D F G H J K L : "',
          '{shift} Z X C V B N M < > ?',
          '{space}'
        ]
      }
    });
  },
  methods:{
    async generate_password(){
      const passwordLength = 15;
      this.$refs.input.value = await GeneratePassword(passwordLength);
      this.$refs.input.setSelectionRange(passwordLength, passwordLength);
      this.$emit('input', this.$refs.input.value);
    },
    copy_to_clipboard(){
      clipboard.writeText(this.value);
      this.copied = true;
      setTimeout(() => {this.copied = false;}, 750);
    },
    show_hide_secret(){
      this.hidden = !this.hidden;
    },
    toggle_keyboard(){
      if (this.keyboardVisibility == "visible"){
        this.keyboardVisibility = "hidden";
        document.getElementById("body-contents").style.paddingBottom = '0px';
        return;
      }
      if (this.recentlyClosed){
        return;
      }
      this.keyboardVisibility = "visible";
      document.getElementById("body-contents").style.paddingBottom = `${this.keyboardContainerHeight}px`;
      this.$refs.input.focus();
    },
    hide(){
      if (this.keyboardVisibility == "hidden"){
        return;
      }
      this.keyboardVisibility = "hidden";
      document.getElementById("body-contents").style.paddingBottom = '0px';
      this.recentlyClosed = true;
      setTimeout(() => this.recentlyClosed = false, 200);
    },
    onKeyPress(btn){
      if (btn === "{shift}"){
        let currentLayout = this.keyboard.options.layoutName;
        let shiftToggle = currentLayout === "default" ? "shift" : "default";
        this.keyboard.setOptions({
          layoutName: shiftToggle
        });
        return;
      }

      let pos = this.$refs.input.selectionStart;

      if (btn === "{bksp}"){
        if (pos > 0){
          this.$refs.input.value = this.$refs.input.value.slice(0, pos-1) + this.$refs.input.value.slice(pos);
          pos--;
        }
      } else if (btn === "{space}"){
        this.$refs.input.value = this.$refs.input.value.slice(0, pos) + " " + this.$refs.input.value.slice(pos);
        pos++;
      } else {
        this.$refs.input.value = this.$refs.input.value.slice(0, pos) + btn + this.$refs.input.value.slice(pos);
        pos++;
      }

      if (pos < 0){
        pos = 0;
      } else if (pos > this.$refs.input.value.length){
        pos = this.$refs.input.value.length;
      }
      this.$refs.input.setSelectionRange(pos, pos);
      this.$emit('input', this.$refs.input.value);
    }
  }
};
</script>

<style lang="less">
@import '../styles/colors.less';

.text-input-wrapper{
  position: relative;
  display: flex;
  width: 100%;

  .missing{
    border-color: @red-pink !important;
  }

  .input {
    flex: 1;
    box-sizing: border-box;
    border: 1px solid @gray-mid;
    font-weight: 300;
    background-color: white;
    padding-left: 8px;
    outline: none;
    color: @gray-lightest;
    background-color: @black-darkest;

    &:focus {
      border: 2px solid @gold-mid;
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

.keyboardContainer {
  z-index: 300;
  background-color: @black-darkest;
  position: fixed;
  width: 100%;
  bottom: 0px;
  left: 0px;
}

.keyboard{
  max-width: 1000px;
  background: none;
  margin: 0 auto;
}

.simple-keyboard.custom-theme {
  background-color: rgba(0, 0, 0, 0.0);
  padding: 8px;
}

.simple-keyboard.custom-theme .hg-row{
  border: 0px;
  margin: 0px;
  border-radius: 0px;
  overflow: hidden;
}

.simple-keyboard.custom-theme .hg-row:nth-child(1){
  border-radius: 6px 6px 0px 0px;
}

.simple-keyboard.custom-theme .hg-row:nth-last-child(1){
  border-radius: 0px 0px 6px 6px;
}

.simple-keyboard.custom-theme .hg-row .hg-button {
  border-radius: 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: @black-dark;
  color: white;
  margin: 0px;
  padding: 0px;
  border: 0px;
}

.simple-keyboard.custom-theme .hg-button:hover {
  background: @black-light;
  color: white;
}

.simple-keyboard.custom-theme .hg-button:active {
  background: @gold-mid;
  color: white;
}

#root .simple-keyboard.custom-theme + .simple-keyboard-preview {
  background: @gold-mid;
}
</style>
