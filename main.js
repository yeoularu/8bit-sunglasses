/*
import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceDetection from "@tensorflow-models/face-detection";
*/

const app = async () => {
  const video = document.getElementById("video");
  let detector;

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  const sunglassesImg = new Image();
  sunglassesImg.src = "./sunglasses.png";

  const accessCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      })
      .then((stream) => {
        video.srcObject = stream;
      });
  };

  const detectFaces = async () => {
    const prediction = await detector.estimateFaces(video);

    ctx.drawImage(video, 0, 0, 640, 480);

    prediction.forEach((predictions) => {
      // Drawing rectangle that'll detect the face
      const rightEye = predictions.keypoints[0];
      const leftEye = predictions.keypoints[1];
      const dx = leftEye.x - rightEye.x;
      const dy = leftEye.y - rightEye.y;
      const angle = Math.atan2(dy, dx);
      const sunglassesRightEnd = {
        x: rightEye.x - dx / 2,
        y: rightEye.y - dy / 2,
      };
      const sunglassesWidth = Math.hypot(dx, dy) * 2;

      ctx.save();
      ctx.translate(sunglassesRightEnd.x, sunglassesRightEnd.y);
      ctx.rotate(angle);
      ctx.drawImage(
        sunglassesImg,
        0,
        0,
        sunglassesWidth,
        (sunglassesWidth * 160) / 832
      );
      ctx.restore();
    });
  };

  accessCamera();
  video.addEventListener("loadeddata", async () => {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = {
      runtime: "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
    };
    detector = await faceDetection.createDetector(model, detectorConfig);

    setInterval(detectFaces, 33);
  });
};

app();
