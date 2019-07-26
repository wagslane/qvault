<template>
  <div>
    <div class="box">
      <div class="description">
        {{ description }}
      </div>
      <TextInput
        v-model="passThroughValue"
        class="text-input"
        :type="type"
        :keyboard-id="keyboardId"
        :active="active"
        :default-value="defaultValue"
      />
    </div>
  </div>
</template>

<script>
import TextInput from "./textInput.vue";

export default{
  components:{
    TextInput
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
    description:{
      type: String,
      required: true
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
    }
  },
  data(){
    return{
      passThroughValue: this.value
    };
  },
  watch: { 
    passThroughValue: function(passThroughValue) {
      this.$emit('input', passThroughValue);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../styles/colors.less';

.box {
  padding: 15px 25px;
  margin-bottom: 12px;
  border-radius: 5px;
  background-color: @black-mid;
  letter-spacing: -0.04px;
  font-size: 16px;
  min-width: 450px;
  display: flex;

  .description {
    height: 47px;
    line-height: 47px;
    display: inline-block;
    color: white;
    text-align: left;
    font-weight: 500;
    margin-right: 20px;
  }

  .text-input{
    flex: 1;
  }
}
</style>
