<template>
  <div>
    <div class="input-field">
      <div class="description">{{description}}</div>
      <input
        ref="input"
        :id="keyboardID"
        class="input-box"
        :type="type"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        v-on:blur="hide"
      />
      <img v-scroll-to="{
        el: '#'+keyboardID,
        offset: -300,
        }" class="keyboard-icon" 
        v-on:click="toggle" 
        height="40" 
        src="../img/keyboard-icon.png"
      >
    </div>
    <div v-bind:style="{ visibility: keyboardVisibility }" class="keyboardContainer">
      <div class="keyboard">
        <div :class="keyboardID"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Keyboard from "simple-keyboard";
  import "simple-keyboard/build/css/index.css";

  export default{
    data(){
      return{
        keyboardVisibility: "hidden",
        recentlyClosed: false
      }
    },
    props:{
      defaultValue:{
        type: String,
        required: false,
        default: ''
      },
      value:{
        type: String
      },
      description:{
        type: String,
        required: true
      },
      type:{
        type: String,
        required: true
      },
      keyboardID:{
        type: String,
        required: true
      },
      active:{
        type: Boolean
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

      this.keyboard = new Keyboard(`.${this.keyboardID}`, {
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
          this.keyboardVisibility = "hidden"
          return
        }
        if (this.recentlyClosed){
          return
        }
        this.keyboardVisibility = "visible"
        this.$refs.input.focus()
      },
      hide(){
        if (this.keyboardVisibility == "hidden"){
          return
        }
        this.keyboardVisibility = "hidden"
        this.recentlyClosed = true
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
            this.$refs.input.value = this.$refs.input.value.slice(0, -1)
          }
        } else if (btn === "{space}"){
          this.$refs.input.value += " "
        } else {
          this.$refs.input.value += btn
        }
        this.$emit('input', this.$refs.input.value);
      }
    }
  }
</script>

<style>
.input-field {
  padding: 15px 25px;
  margin-bottom: 12px;
  border-radius: 5px;
  background-color: #1A1D1F;
  letter-spacing: -0.04px;
  font-size: 16px;
  min-width: 450px;
}

.description {
  height: 47px;
  line-height: 47px;
  display:inline-block;
  color: #FFFFFF;
  text-align:center;
  font-weight: 500;
}

.keyboard-icon{
  float: right;
  margin-right:10px;
  margin-top: 5px;
  cursor: pointer;
}

.input-box {
  float: right;
  box-sizing: border-box;
  height: 47px;
  line-height: 47px;
  width: 311px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 2px;
  font-weight: 300;
  background-color: white;
  padding-left: 5px;
  outline: none;
  color: #B3B3B3;
  background-color: #0B0C0D;
}

.input-box:focus {
  border: 2px solid #D8A22E;
  outline: none;
}

.keyboardContainer {
  background-color: #aaaaaa;
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
  background: #191919;
  color: white;
}

.simple-keyboard.custom-theme .hg-button:active {
  background: #D8A22E;
  color: white;
}

#root .simple-keyboard.custom-theme + .simple-keyboard-preview {
  background: #D8A22E;
}
</style>
