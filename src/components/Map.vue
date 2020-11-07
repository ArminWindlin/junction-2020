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
      users: []
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

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(this.config.width / 2, this.config.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'blue';
      for (const person of this.users) {
        ctx.beginPath();
        ctx.arc(person.x + this.corX, person.y + this.corY, 10, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.restore();

      window.requestAnimationFrame(this.draw);
    },
    onKeyPress(e) {
      const key = e.key;
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
      this.corX += x;
      this.corY += y;

      // save to db
      this.$users.doc(this.userId).set(this.you);
    },
    async getUser(userId) {
      const snapshot = await this.$users.doc(userId).get();
      if (snapshot.exists) {
        this.userId = userId;
        this.you = snapshot.data();
        this.corX = this.you.x - this.config.width / 2;
        this.corY = this.you.y - this.config.height / 2;
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
