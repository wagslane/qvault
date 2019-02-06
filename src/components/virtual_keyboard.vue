<template>
  <div class="simple-keyboard"></div>
</template>

<script>
  import Keyboard from "simple-keyboard";
  import "simple-keyboard/build/css/index.css";

  export default{
    props:{
      inputID: {
        type: String,
        required: true
      }
    },
    mounted: function() {
      this.keyboard = new Keyboard({
        onKeyPress: btn => this.onKeyPress(btn),
        onChange: input => this.onChange(input),
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
      })
    },
    methods: {
      handleShift(){
        let currentLayout = this.keyboard.options.layoutName;
        let shiftToggle = currentLayout === "default" ? "shift" : "default";
        this.keyboard.setOptions({
          layoutName: shiftToggle
        });
      },
      onKeyPress(btn){
        if (btn === "{shift}"){
          this.handleShift();
        }
      },
      onChange(input) {
        document.getElementById(this.inputID).value = input;
      }
    }
  }
</script>