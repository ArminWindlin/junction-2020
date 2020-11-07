<template>
  <video autoplay playsinline></video>
</template>

<script>
export default {
  name: "Map",
  props: { users: { default: () => [], type: Array } },
  watch: {
    users: function(users) {
      console.log(users[0].x);
    },
  },
  mounted() {
    const mediaStreamConstraints = {
      video: true,
    };

    // Video element where stream will be placed.
    const localVideo = document.querySelector("video");

    // Local stream that will be reproduced on the video.
    let localStream;
    console.log(localStream);

    // Handles success by adding the MediaStream to the video element.
    function gotLocalMediaStream(mediaStream) {
      localStream = mediaStream;
      localVideo.srcObject = mediaStream;
    }

    // Handles error by logging a message to the console with the error message.
    function handleLocalMediaStreamError(error) {
      console.log("navigator.getUserMedia error: ", error);
    }

    // Initializes media stream.
    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(gotLocalMediaStream)
      .catch(handleLocalMediaStreamError);
  },
};
</script>

<style scoped></style>
