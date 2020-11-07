<template>
  <canvas ref="main-canvas" id="main-canvas" width="500" height="500">
    map
  </canvas>
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      you: {
        x: 20,
        y: 20
      },
      persons: [
        {
          x: 60,
          y: 60
        },
        {
          x: 60,
          y: 120
        }
      ]
    };
  },
  methods: {
    init() {
      window.requestAnimationFrame(this.draw);
    },
    draw() {
      const ctx = this.$refs['main-canvas'].getContext('2d');
      ctx.clearRect(0, 0, 500, 500); // clear canvas

      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 500, 500);

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(this.you.x, this.you.y, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'blue';
      ctx.beginPath();
      for (const person of this.persons) {
        ctx.arc(person.x, person.y, 10, 0, 2 * Math.PI);
      }
      ctx.fill();

      ctx.restore();

      window.requestAnimationFrame(this.draw);
    },
    onKeyPress(e) {
      const key = e.key;
      console.log(key)
      if (key === 'w') {
        this.you.y -= 10;
      } else if (key === 's') {
        this.you.y += 10;
      } else if (key === 'a') {
        this.you.x -= 10;
      } else if (key === 'd') {
        this.you.x += 10;
      }
    }
  },
  mounted() {
    this.init();
    window.addEventListener('keypress', this.onKeyPress)
  }
}
</script>

<style scoped>
#main-canvas {
  width: 500px;
  height: 500px;
}
</style>
