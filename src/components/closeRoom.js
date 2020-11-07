import firebase from "firebase";
import { getRoomId } from "./webcam";

export default async function closeRoom(peerConnection, remoteStream, you) {
  console.log("Closing Room!");
  const roomId = getRoomId(you);

  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  document.querySelector("#remoteVideo").srcObject = null;

  // Delete room on hangup
  if (roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection("rooms").doc(roomId);
    const calleeCandidates = await roomRef.collection("calleeCandidates").get();
    calleeCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection("callerCandidates").get();
    callerCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }
}
