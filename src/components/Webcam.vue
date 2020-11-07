<template>
  <div>
    <video id="localVideo" muted autoplay playsinline></video>
    <video id="remoteVideo" autoplay playsinline></video>
  </div>
</template>

<script>
import joinRoom from "./joinRoom";
import createRoom from "./createRoom";

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
      console.log('yea')
      const closeUsers = this.users.filter((u) => getCloseUser(u, this.you));
      if (closeUsers.length > 0) {
        if (closeUsers[0].id < this.you.id){
          if(this.you.roomId) return;
          console.log('yea1')
          createRoom(
              this.peerConnection,
              this.localStream,
              this.remoteStream,
              this.you
          ).then(()=> this.$users.doc(this.you.id).update({
            roomId: this.you.id
          }))
        } else if(closeUsers[0].roomId) {
          console.log('yea2')
          joinRoom(
              this.peerConnection,
              this.localStream,
              this.remoteStream,
              this.you,
              closeUsers[0].roomId
          );
        }
      }
    },
    createRoom() {
      console.log(this.you);
    },
    onKeyPress(e) {
      const key = e.key;
      if (key === "Enter") {
        createRoom(
          this.peerConnection,
          this.localStream,
          this.remoteStream,
          this.you
        );
      }
    },
  },
  mounted() {
    window.addEventListener("keypress", this.onKeyPress);
    const mediaStreamConstraints = {
      video: true,
    };

    // Video element where stream will be placed.
    const localVideo = document.querySelector("#localVideo");

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

    this.remoteStream = new MediaStream();
    document.querySelector("#remoteVideo").srcObject = this.remoteStream;
  },
};
</script>

<style scoped></style>
