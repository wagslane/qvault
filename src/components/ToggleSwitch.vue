<template>
  <div>
    <span
      class="toggle-wrapper"
      role="checkbox"
      :aria-checked="value.toString()"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <span
        class="toggle-background"
        :class="backgroundStyles"
      />
      <span
        class="toggle-indicator"
        :style="indicatorStyles" 
      />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value:{
      type: Boolean,
      required: true,
    }
  },
  computed: {
    backgroundStyles() {
      return {
        'gold-mid': this.value,
        'gray-lighter': !this.value,
      };
    },
    indicatorStyles() {
      return { transform: this.value ? 'translateX(36px)' : 'translateX(0)' };
    }
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../styles/colors.less';

.gold-mid{
  background-color: @gold-mid;
}

.gray-lighter{
  background-color: @gray-lighter;
}

.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 60px;
  height: 24px;
  border-radius: 9999px;

  &:focus {
    outline: 0;
  }
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  transition: background-color .4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: #fff;
  border-radius: 9999px;
  box-shadow:  0 2px 4px rgba(0,0,0,0.1);
  transition: transform .4s ease;
}
</style>
