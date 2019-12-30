<template>
  <div class="position">
    <svg
      class="step-progress"
      :height="circleHeight"
      :width="width"
    >
      <line
        v-for="line in lines"
        :key="line.x1+line.x2+line.y1+line.y2"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :style="line.style"
      />
      <circle
        v-for="circle in circles"
        :key="circle.cx+circle.cy"
        :cx="circle.cx"
        :cy="circle.cy"
        :r="circle.r"
        :stroke="circle.stroke"
        :stroke-width="circle.stroke_width"
        :fill="circle.fill"
      />
    </svg>
  </div>
</template>

<script>
export default {

  props: {
    filled: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      circleRadius: 7.5,
      width: 450,
      fillColor: "#CE9B2C",
      emptyColor: "#7E8A95",
      total: 5
    };
  },

  computed: {
    circleHeight() {
      return this.circleRadius * 2;
    },
    circles() {
      let circles = [];
      for (let i = 0; i < this.filled; i++) {
        circles.push({
          cx: this.circleRadius + this.spacing() * i,
          cy: this.circleRadius,
          r: this.circleRadius - 1,
          stroke: this.fillColor,
          stroke_width: 1,
          fill: this.fillColor
        });
      }
      for (let i = 0; i < this.empty(); i++) {
        circles.push({
          cx:
            this.circleRadius +
            this.spacing() * this.filled +
            this.spacing() * i,
          cy: this.circleRadius,
          r: this.circleRadius - 1,
          stroke: this.emptyColor,
          stroke_width: 1,
          fill: this.emptyColor
        });
      }
      return circles;
    },
    lines() {
      const linesFilled = this.filled - 1;
      const linesEmpty = this.empty() + 1;
      let lines = [];
      for (let i = 0; i < linesFilled; i++) {
        lines.push({
          x1: this.circleRadius + this.spacing() * i,
          y1: this.circleRadius,
          x2: this.circleRadius + this.spacing() * (i + 1),
          y2: this.circleRadius,
          style: `stroke:${this.fillColor};stroke-width:2`
        });
      }
      for (let i = 0; i < linesEmpty; i++) {
        lines.push({
          x1:
            this.circleRadius +
            linesFilled * this.spacing() +
            this.spacing() * i,
          y1: this.circleRadius,
          x2:
            this.circleRadius +
            linesFilled * this.spacing() +
            this.spacing() * (i + 1),
          y2: this.circleRadius,
          style: `stroke:${this.emptyColor};stroke-width:2`
        });
      }
      return lines;
    }
  },

  methods: {
    empty() {
      return this.total - this.filled;
    },
    spacing() {
      return (
        (this.width - this.circleRadius * 2) / (this.filled + this.empty() - 1)
      );
    }
  }
};
</script>

<style lang="less" scoped>
svg {
  margin: auto;
  display: block;
}
.position {
  margin-top: 30px;
}
</style>
