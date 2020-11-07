import firebase from "firebase";
import {
  getRoomId,
  configuration,
  registerPeerConnectionListeners,
} from "./webcam";
export default async function createRoom(
  peerConnection,
  localStream,
  remoteStream,
  you,
  specificRoom = null
) {
  const db = firebase.firestore();
  const roomId = specificRoom ?? getRoomId(you);
  const roomRef = db.collection("rooms").doc(roomId);

  console.log("Create PeerConnection with configuration: ", configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners(peerConnection);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = roomRef.collection("callerCandidates");

  peerConnection.addEventListener("icecandidate", (event) => {
    if (!event.candidate) {
      console.log("Got final candidate!");
      return;
    }
    console.log("Got candidate: ", event.candidate);
    callerCandidatesCollection.add(event.candidate.toJSON());
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("Created offer:", offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await roomRef.set(roomWithOffer);
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
  // Code for creating a room above

  peerConnection.addEventListener("track", (event) => {
    console.log("Got remote track:", event.streams[0]);
    event.streams[0].getTracks().forEach((track) => {
      console.log("Add a track to the remoteStream:", track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  roomRef.onSnapshot(async (snapshot) => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log("Got remote description: ", data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  roomRef.collection("calleeCandidates").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above
}
