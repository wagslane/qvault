<template>
  <div class="input-wrap">
    <span
      class="icon"
      @click="toggle"
    >
      <svg
        v-scroll-to="{
          el: '#'+keyboardId,
          offset: -300,
        }"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="20pt"
        height="20pt"
        viewBox="0 0 20 20"
        version="1.1"
      >
        <g id="surface1">
          <path
            style="stroke:none; fill-rule:nonzero; fill-opacity:1;"
            d="M 16.667969 2.5 L 3.332031 2.5 C 2.414062 2.5 1.675781 3.246094 1.675781 4.167969 L 1.667969 12.5 C 1.667969 13.421875 2.414062 14.167969 3.332031 14.167969 L 16.667969 14.167969 C 17.585938 14.167969 18.332031 13.421875 18.332031 12.5 L 18.332031 4.167969 C 18.332031 3.246094 17.585938 2.5 16.667969 2.5 Z M 9.167969 5 L 10.832031 5 L 10.832031 6.667969 L 9.167969 6.667969 Z M 9.167969 7.5 L 10.832031 7.5 L 10.832031 9.167969 L 9.167969 9.167969 Z M 6.667969 5 L 8.332031 5 L 8.332031 6.667969 L 6.667969 6.667969 Z M 6.667969 7.5 L 8.332031 7.5 L 8.332031 9.167969 L 6.667969 9.167969 Z M 5.832031 9.167969 L 4.167969 9.167969 L 4.167969 7.5 L 5.832031 7.5 Z M 5.832031 6.667969 L 4.167969 6.667969 L 4.167969 5 L 5.832031 5 Z M 13.332031 12.5 L 6.667969 12.5 L 6.667969 10.832031 L 13.332031 10.832031 Z M 13.332031 9.167969 L 11.667969 9.167969 L 11.667969 7.5 L 13.332031 7.5 Z M 13.332031 6.667969 L 11.667969 6.667969 L 11.667969 5 L 13.332031 5 Z M 15.832031 9.167969 L 14.167969 9.167969 L 14.167969 7.5 L 15.832031 7.5 Z M 15.832031 6.667969 L 14.167969 6.667969 L 14.167969 5 L 15.832031 5 Z M 10 19.167969 L 13.332031 15.832031 L 6.667969 15.832031 Z M 10 19.167969 "
          />
        </g>
      </svg>
    </span>
    <input
      :id="keyboardId"
      ref="input"
      :type="type"
      :value="value"
      @input="$emit('input', $event.target.value)"
      @blur="hide"
    >
    <div
      :style="{ visibility: keyboardVisibility }"
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
import "simple-keyboard/build/css/index.css";

export default{
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
      type: Boolean
    }
  },
  data(){
    return{
      keyboardVisibility: "hidden",
      recentlyClosed: false,
      bodyPaddingMax: 280
    };
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
    toggle(){
      if (this.keyboardVisibility == "visible"){
        this.keyboardVisibility = "hidden";
        document.getElementById("body-contents").style.paddingBottom = '0px';
        return;
      }
      if (this.recentlyClosed){
        return;
      }
      this.keyboardVisibility = "visible";
      document.getElementById("body-contents").style.paddingBottom = `${this.bodyPaddingMax}px`;
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

<style lang="less" scoped>
@import '../styles/colors.less';

.input-wrap{
  display: flex;
  flex-direction: row;
  flex: 1;

  .icon{
    background-color: @black-light;
    cursor: pointer;
    height: 47px;
    border-radius: 2px 0px 0px 2px;
    border: 1px solid @gray-mid;
    border-right: 0px;

    svg {
      margin-top: 10px;
      margin-left: 13.5px;
      margin-right: 13.5px;

      path {
        fill: white;
      }
    }

    &:hover{
      background-color: @black-lightest;
    }
  }

    input {
      flex: 1;
      box-sizing: border-box;
      height: 47px;
      line-height: 47px;
      border: 1px solid @gray-mid;
      border-radius: 0px 2px 2px 0px;
      font-weight: 300;
      background-color: white;
      padding-left: 5px;
      outline: none;
      color: @gray-lightest;
      background-color: @black-darkest;

      &:focus {
        border: 2px solid @gold-mid;
        outline: none;
      }
    }
}

span{
  display: block;
}

.keyboardContainer {
  background-color: @gray-lightest;
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
  border-radius: 0;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: rgba(0, 0, 0, 0.0);
}

.simple-keyboard.custom-theme .hg-row .hg-button {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: @black-dark;
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
