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
import Keyboard from "simple-keyboard";
import dropdown_menu from './dropdown_menu.vue';
import hide_svg from '../img/hide.svg';
import keyboard_svg from '../img/keyboard.svg';
import "simple-keyboard/build/css/index.css";

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
      hidden: true
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
          icon: keyboard_svg,
        }
      ];
      if (this.value && this.value.length > 0 && this.type == 'password'){
        actions.push({
          label: 'Show / Hide',
          method: 'show_hide_secret',
          icon: hide_svg,
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
      if (btn === "{bksp}"){
        if (this.$refs.input.value.length > 0){
          this.$refs.input.value = this.$refs.input.value.slice(0, -1);
        }
      } else if (btn === "{space}"){
        this.$refs.input.value += " ";
      } else {
        this.$refs.input.value += btn;
      }
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
  z-index: 100;
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
