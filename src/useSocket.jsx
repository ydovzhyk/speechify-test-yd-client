import { useRef } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import {
  addLetter,
  setConfirmation,
  setNotifacation,
} from "./redux/technical/technical-slice";

// const serverURL = "http://localhost:8080";
const serverURL =
  "https://speechify-test-yd-server-4f435b1fac7b.herokuapp.com/";
const subscriptions = ["final", "partial", "transcriber-ready", "error"];

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  const initialize = () => {
    if (!socketRef.current) {
      socketRef.current = io(serverURL);

      socketRef.current.on("connect", () => {
        console.log("connected to server");

        subscriptions.forEach((event) => {
          socketRef.current.on(event, (data) => {
            console.log(`Received ${event}: `, data);

            if (
              event === "transcriber-ready" &&
              data === "Transcriber is ready"
            ) {
              dispatch(setConfirmation(true));
              setTimeout(() => {
                dispatch(setNotifacation(false));
                dispatch(setConfirmation(false));
              }, 7500);
            }

            if (event === "final") {
              for (let i = 0; i < data.length; i++) {
                dispatch(addLetter(data[i]));
              }
              if (data.length > 0) {
                dispatch(addLetter(" "));
              }
            }
          });
        });
      });
    } else {
      return;
    }
  };

  const disconnect = async () => {
    await socketRef.current.disconnect();
    console.log("disconnected from the server");
  };

  const sendAudio = (audioData, sampleRate) => {
    if (socketRef.current) {
      socketRef.current.emit("incoming-audio", { audioData, sampleRate });
    }
  };

  return { initialize, disconnect, sendAudio };
};

export default useSocket;
