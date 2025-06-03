const downloadBtn = document.getElementById('downloadBtn');
const input = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

downloadBtn.addEventListener('click', () => {
  const file = input.files[0];
  if (!file) {
    alert("Please upload your image.");
    return;
  }

  const background = new Image();
  background.src = 'template2.jpg'; // Ensure this file exists in your folder

  const userImage = new Image();
  userImage.src = URL.createObjectURL(file);

  background.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    userImage.onload = () => {
      const x = 240;
      const y = 480;
      const diameter = 200;
      const radius = diameter / 2;

      // Circle frame border
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius + 8, 0, Math.PI * 2); // Border
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#7e7100';
      ctx.stroke();
      ctx.closePath();
      ctx.restore();

      // Crop user image to square from center
      const aspectRatio = userImage.width / userImage.height;
      let cropWidth, cropHeight;

      if (aspectRatio > 1) {
        cropHeight = userImage.height;
        cropWidth = cropHeight;
      } else {
        cropWidth = userImage.width;
        cropHeight = cropWidth;
      }

      const cropX = (userImage.width - cropWidth) / 2;
      const cropY = (userImage.height - cropHeight) / 2;

      // Draw cropped image clipped in circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        userImage,
        cropX, cropY, cropWidth, cropHeight, // cropped source
        x, y, diameter, diameter // destination
      );

      ctx.restore();

      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'eid-greeting-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        URL.revokeObjectURL(userImage.src);
      }, 100);
    };
  };

  background.onerror = () => {
    alert("Background template image not found. Please ensure 'template.jpg' is in the correct folder.");
  };
});
