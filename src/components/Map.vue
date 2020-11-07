<template>
  <div>
    <canvas
        ref="main-canvas"
        class="main-canvas"
        :width="config.width"
        :height="config.height"
    >
      map
    </canvas>
    <Webcam :users="users" :you="you" class="webcam"/>
  </div>
</template>

<script>
import Webcam from "./Webcam.vue";

export default {
  name: "Map",
  components: {Webcam},
  data() {
    return {
      config: {
        width: 900,
        height: 500,
      },
      userId: "",
      you: {
        x: 250,
        y: 250,
        id: ''
      },
      corX: 0,
      corY: 0,
      users: [],
      images: {},
      direction: 'up',
      looksLeft: false
    };
  },
  methods: {
    init() {
      window.requestAnimationFrame(this.draw);
    },
    draw() {
      if (!this.$refs["main-canvas"]) return;
      const ctx = this.$refs["main-canvas"].getContext("2d");
      ctx.clearRect(0, 0, this.config.width, this.config.height); // clear canvas

      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, this.config.width, this.config.height);

      this.drawBackground(ctx);

      ctx.fillStyle = 'blue';
      ctx.beginPath();
      // ctx.arc(this.config.width / 2, this.config.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();

      this.drawDana(ctx);

      ctx.fillStyle = 'red';
      for (const person of this.users) {
        ctx.beginPath();
        // ctx.arc(person.x + this.corX, person.y + this.corY, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.drawImage(this.images.redDana, person.x + this.corX, person.y + this.corY, 50, 75);
      }
      ctx.restore();

      window.requestAnimationFrame(this.draw);
    },
    drawBackground(ctx) {
      if (!this.images.map) return;
      ctx.drawImage(this.images.map, this.corX, this.corY)
    },
    drawDana(ctx) {
      if (!this.images.right) return;
      switch (this.direction) {
        case "right":
          this.looksLeft = false;
          ctx.drawImage(this.images.right, this.config.width / 2, this.config.height / 2, 50, 75);
          break;

        case "left":
          this.looksLeft = true;
          ctx.drawImage(this.images.left, this.config.width / 2, this.config.height / 2, 50, 75);
          break;

        default:
          if (this.looksLeft) {
            ctx.drawImage(this.images.left, this.config.width / 2, this.config.height / 2, 50, 75);
          } else {
            ctx.drawImage(this.images.right, this.config.width / 2, this.config.height / 2, 50, 75);
          }
          break;
      }
    },
    loadImages() {
      // banners
      const images = [
        {
          name: 'map',
          src: 'awesome_map.png'
        },
        {
          name: 'left',
          src: 'dana/left.png'
        },
        {
          name: 'right',
          src: 'dana/right.png'
        },
        {
          name: 'redDana',
          src: 'dana/red_dana.png'
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
      if (key === "w" || key === 'ArrowUp') {
        y = -10;
        this.direction = 'up'
      } else if (key === "s" || key === 'ArrowDown') {
        y = 10;
        this.direction = 'down'
      } else if (key === "a" || key === 'ArrowLeft') {
        x = -10;
        this.direction = 'left'
      } else if (key === "d" || key === 'ArrowRight') {
        x = 10;
        this.direction = 'right'
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
            .filter((userSnap) => userSnap.id !== this.userId)
            .map((userSnap) => userSnap.data());
      });
    },
    initUser() {
      const newId = this.$users.doc().id;
      localStorage.setItem("userId", newId);
      this.$users.doc(newId).set({
        x: 250,
        y: 250,
        id: newId
      });
      this.you.x = 250;
      this.you.y = 250;
      this.getUsers();
    },
  },
  mounted() {
    this.init();
    this.loadImages();
    window.addEventListener('keypress', this.onKeyPress);
    const userId = localStorage.getItem('userId');
    if (userId) this.getUser(userId);
    else this.initUser();
  },
  watch: {
    you: {
      handler: ({x, y}) => console.log({x, y}),
      deep: true,
    },
  },
};
</script>

<style scoped>
.main-canvas {
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
}

.webcam {
  position: fixed;
  top: 0;
  right: 0;
}
</style>
