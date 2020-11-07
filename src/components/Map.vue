<template>
  <canvas ref="main-canvas">
    map
  </canvas>
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      person: [],
    };
  },
  methods: {
    init() {
      window.requestAnimationFrame(this.draw);
    },
    draw() {
      const ctx = this.$refs['main-canvas'].getContext('2d');
      ctx.clearRect(0, 0, 300, 300); // clear canvas

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(100, 100, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();

      window.requestAnimationFrame(this.draw);
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>
</style>
