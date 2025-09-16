const video = document.getElementById("video");
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");

// Resize canvas to match video
function resizeCanvas() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

hands.onResults((results) => {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw video feed
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  // Draw hand landmarks + connections
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
      drawLandmarks(ctx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
});

// Use back camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({image: video});
  },
  width: 640,
  height: 480,
  facingMode: "environment" // 🔑 back camera
});
camera.start();
