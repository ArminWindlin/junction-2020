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
        height: 500,
      },
      userId: '',
      you: {
        x: 250,
        y: 250,
      },
      corX: 0,
      corY: 0,
      users: [],
      images: {},
      direction: 'up',
      dirCounter: [0,0,0,0] // up,right,down,left
    };
  },
  methods: {
    init() {
      window.requestAnimationFrame(this.draw);
    },
    draw() {
      if (!this.$refs['main-canvas']) return;
      const ctx = this.$refs['main-canvas'].getContext('2d');
      ctx.clearRect(0, 0, this.config.width, this.config.height); // clear canvas

      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, this.config.width, this.config.height);

      this.drawBackground(ctx);

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(this.config.width / 2, this.config.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();

      this.drawDana(ctx);

      ctx.fillStyle = 'blue';
      for (const person of this.users) {
        ctx.beginPath();
        ctx.arc(person.x + this.corX, person.y + this.corY, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();

      window.requestAnimationFrame(this.draw);
    },
    drawBackground(ctx) {
      if (!this.images.map) return;
      ctx.drawImage(this.images.map, 10, 10)
    },
    drawDana(ctx) {
      if (!this.images.up) return;
      switch (this.direction) {
        case "right":
          ctx.drawImage(this.images.right, this.config.width / 2, this.config.height / 2, 50, 50);
          break;

        case "left":
          ctx.drawImage(this.images.left, this.config.width / 2, this.config.height / 2, 50, 50);
          break;

        default:
          ctx.drawImage(this.images.up, this.config.width / 2, this.config.height / 2, 50, 50);
          break;
      }
    },
    loadImages() {
      // banners
      const images = [
        {
          name: 'map',
          src: 'sample_map.jpg'
        },
        {
          name: 'up',
          src: 'dana/up.png'
        },
        {
          name: 'down',
          src: 'dana/down.png'
        },
        {
          name: 'left',
          src: 'dana/left.png'
        },
        {
          name: 'right',
          src: 'dana/right.png'
        }
      ]

      images.forEach(img => {
        const imageObject = new window.Image();
        imageObject.src = require(`../assets/${img.src}`)

        imageObject.onload = () => {
          this.images[img.name] = imageObject;
        }
        console.log(this.images)
      })
    },
    onKeyPress(e) {
      const key = e.key;
      let x = 0;
      let y = 0;
      if (key === 'w') {
        y = -10;
        this.direction = 'up'
      } else if (key === 's') {
        this.direction = 'down'
        y = 10;
      } else if (key === 'a') {
        this.direction = 'left'
        x = -10
      } else if (key === 'd') {
        this.direction = 'up'
        x = 10
      }

      this.you.x += x;
      this.you.y += y;
      this.corX -= x;
      this.corY -= y;

      // save to db
      this.$users.doc(this.userId).set(this.you);
    },
    async getUser(userId) {
      const snapshot = await this.$users.doc(userId).get();
      if (snapshot.exists) {
        this.userId = userId;
        this.you = snapshot.data();
        this.corX = this.config.width / 2 - this.you.x;
        this.corY = this.config.height / 2 - this.you.y;
        this.getUsers();
      } else this.initUser();
    },
    getUsers() {
      this.$users.onSnapshot((querySnapshot) => {
        this.users = querySnapshot.docs
            .filter(userSnap => userSnap.id !== this.userId)
            .map(userSnap => userSnap.data());
      });
    },
    initUser() {
      const newId = this.$users.doc().id;
      localStorage.setItem('userId', newId)
      this.$users.doc(newId).set({
        x: 250,
        y: 250,
      })
      this.you.x = 250;
      this.you.y = 250;
      this.getUsers();
    }
  },
  mounted() {
    this.init();
    this.loadImages();
    window.addEventListener('keypress', this.onKeyPress);
    const userId = localStorage.getItem('userId');
    if (userId) this.getUser(userId);
    else this.initUser();
  }
}
</script>

<style scoped>
#main-canvas {
  width: 500px;
  height: 500px;
}
</style>