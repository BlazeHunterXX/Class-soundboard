{
  const canvas = document.createElement('canvas');
  canvas.id = "train-canvas";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const p = 8;
  let xPos = -150;

  const trainMap = [
   ,
   ,
   ,
   ,
   ,
   
  ];

  const colors = ["transparent", "#e63946", "#1d3557", "#a8dadc", "#a01a24"];

  function animateTrain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trainMap.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel !== 0) {
          ctx.fillStyle = colors[pixel];
          ctx.fillRect(xPos + (x * p), (canvas.height - 100) + (y * p), p, p);
        }
      });
    });

    xPos += 2;
    if (xPos > canvas.width) {
      xPos = -150;
    }
    requestAnimationFrame(animateTrain);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animateTrain();
}
