<template>
  <div>
    <canvas
      ref="main-canvas"
      id="main-canvas"
      :width="config.width"
      :height="config.height"
    >
      map
    </canvas>
    <Webcam :users="users" :you="you" />
  </div>
</template>

<script>
import Webcam from "./Webcam.vue";
export default {
  name: "Map",
  components: { Webcam },
  data() {
    return {
      config: {
        width: 800,
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
      images: {
        map: null
      }
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

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(
        this.config.width / 2,
        this.config.height / 2,
        10,
        0,
        2 * Math.PI
      );
      ctx.fill();

      ctx.fillStyle = "blue";
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
      ctx.drawImage(this.images.map, this.corX, this.corY)
    },
    loadImages() {
      // banners
      let mapImage = new window.Image();
      mapImage.src = require('../assets/awesome_map.png');
      mapImage.onload = () => {
        this.images.map = mapImage;
      };
    },
    onKeyPress(e) {
      const key = e.key;
      let x = 0;
      let y = 0;
      if (key === "w" || key === 'ArrowUp') {
        y = -10;
      } else if (key === "s" || key === 'ArrowDown') {
        y = 10;
      } else if (key === "a" || key === 'ArrowLeft') {
        x = -10;
      } else if (key === "d" || key === 'ArrowRight') {
        x = 10;
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
      handler: ({ x, y }) => console.log({ x, y }),
      deep: true,
    },
  },
};
</script>

<style scoped>
</style>
