// import React, { useEffect, useRef } from "react";

// const AudioVisualizer = ({ audioContext, sourceNode }) => {
//   const canvasRef = useRef(null);
//   const analyserRef = useRef(null);
//   const dataArrayRef = useRef(null);
//   const animationFrameIdRef = useRef(null);

//   useEffect(() => {
//     if (audioContext && sourceNode) {
//       const canvas = canvasRef.current;
//       const canvasCtx = canvas.getContext("2d");

//       analyserRef.current = audioContext.createAnalyser();
//       analyserRef.current.fftSize = 2048;

//       sourceNode.connect(analyserRef.current);

//       dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);

//       const draw = () => {
//         analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
//         canvasCtx.fillStyle = "rgb(200, 200, 200)";
//         canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

//         canvasCtx.lineWidth = 2;
//         canvasCtx.strokeStyle = "rgb(0, 0, 0)";
//         canvasCtx.beginPath();

//         const sliceWidth = (canvas.width * 1.0) / analyserRef.current.fftSize;
//         let x = 0;

//         for (let i = 0; i < analyserRef.current.fftSize; i++) {
//           const v = dataArrayRef.current[i] / 128.0;
//           const y = (v * canvas.height) / 2;

//           if (i === 0) {
//             canvasCtx.moveTo(x, y);
//           } else {
//             canvasCtx.lineTo(x, y);
//           }

//           x += sliceWidth;
//         }

//         canvasCtx.lineTo(canvas.width, canvas.height / 2);
//         canvasCtx.stroke();

//         animationFrameIdRef.current = requestAnimationFrame(draw);
//       };

//       draw();

//       return () => {
//         cancelAnimationFrame(animationFrameIdRef.current);
//         analyserRef.current.disconnect();
//       };
//     }
//   }, [audioContext, sourceNode]);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         width: "100%",
//         height: "100px",
//         strokeStyle: "#FF5733",
//         backgroundColor: "#282c34",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//       }}
//     />
//   );
// };

// export default AudioVisualizer;

import React, { useEffect, useRef } from "react";

const AudioVisualizer = ({ audioContext, sourceNode }) => {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    if (audioContext && sourceNode) {
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext("2d");

      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 2048;

      sourceNode.connect(analyserRef.current);

      dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);

      const draw = () => {
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
        canvasCtx.fillStyle = "white";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 1;

        const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#EE51B1");
        gradient.addColorStop(0.5, "#E3C515");
        gradient.addColorStop(1, "#00718F");

        canvasCtx.strokeStyle = gradient;
        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / analyserRef.current.fftSize;
        let x = 0;

        for (let i = 0; i < analyserRef.current.fftSize; i++) {
          const v = dataArrayRef.current[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

        animationFrameIdRef.current = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        cancelAnimationFrame(animationFrameIdRef.current);
        analyserRef.current.disconnect();
      };
    }
  }, [audioContext, sourceNode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    />
  );
};

export default AudioVisualizer;
