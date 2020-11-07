<template>
  <video autoplay playsinline></video>
</template>

<script>
import { createRoom } from "./webcam";
const getCloseUser = ({ x, y }, you) => x === you.x && y === you.y;
export default {
  name: "Map",
  props: { users: { default: () => [], type: Array }, you: Object },
  watch: {
    users: function() {
      this.check();
    },
  },
  data() {
    return {
      peerConnection: null,
      localStream: null,
      remoteStream: null,
    };
  },
  methods: {
    check() {
      const closeUsers = this.users.filter((u) => getCloseUser(u, this.you));
      if (closeUsers.length > 0) {
        this.createRoom();
      }
    },
    createRoom() {
      console.log(this.you);
      createRoom(
        this.peerConnection,
        this.localStream,
        this.remoteStream,
        this.you
      );
    },
  },
  mounted() {
    const mediaStreamConstraints = {
      video: true,
    };

    // Video element where stream will be placed.
    const localVideo = document.querySelector("video");

    // Handles success by adding the MediaStream to the video element.
    function gotLocalMediaStream(mediaStream) {
      this.localStream = mediaStream;
      localVideo.srcObject = mediaStream;
    }

    // Handles error by logging a message to the console with the error message.
    function handleLocalMediaStreamError(error) {
      console.log("navigator.getUserMedia error: ", error);
    }

    // Initializes media stream.
    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(gotLocalMediaStream.bind(this))
      .catch(handleLocalMediaStreamError);
  },
};
</script>

<style scoped></style>
