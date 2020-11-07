<template>
  <canvas ref="main-canvas" id="main-canvas" :width="config.width" :height="config.height">
    map
  </canvas>
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      config: {
        width: 500,
        height: 500
      },
      you: {
        x: 250,
        y: 250,
        dX: 250,
        dY: 250,
      },
      persons: [
        {
          x: 60,
          y: 60,
          dX: 60,
          dY: 60,
        },
        {
          x: 60,
          y: 120,
          dX: 60,
          dY: 120,
        },
        {
          x: 400,
          y: 350,
          dX: 400,
          dY: 350,
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
      ctx.clearRect(0, 0, this.config.width, this.config.height); // clear canvas

      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, this.config.width, this.config.height);

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(this.you.dX, this.you.dY, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'blue';
      for (const person of this.persons) {
        ctx.beginPath();
        ctx.arc(person.dX, person.dY, 10, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.restore();

      window.requestAnimationFrame(this.draw);
    },
    onKeyPress(e) {
      const key = e.key;
      console.log(key)
      let x = 0;
      let y = 0;
      if (key === 'w') {
        y = -10;
      } else if (key === 's') {
        y = 10;
      } else if (key === 'a') {
        x = -10
      } else if (key === 'd') {
        x = 10
      }

      this.you.x += x;
      this.you.y += y;
      for (const person of this.persons) {
        person.dX -= x;
        person.dY -= y;
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
