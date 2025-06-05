    const downloadBtn = document.getElementById('downloadBtn');
    const input = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let selectedTemplate = 'template1.jpeg';
    let imageX = 240, imageY = 560;
    const imageDiameter = 200;
    const radius = imageDiameter / 2;

    let isDragging = false, offsetX, offsetY;
    let userImage, background;

    document.querySelectorAll('.template').forEach(img => {
      img.addEventListener('click', () => {
        document.querySelectorAll('.template').forEach(t => t.classList.remove('selected'));
        img.classList.add('selected');
        selectedTemplate = img.getAttribute('data-template');
        if (userImage) drawCanvas();
      });
    });

    function drawCanvas() {
      canvas.style.display = 'block';
      if (!background || !userImage) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(imageX + radius, imageY + radius, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#7e7100';
      ctx.stroke();
      ctx.closePath();
      ctx.restore();

      const aspectRatio = userImage.width / userImage.height;
      let cropWidth = userImage.width, cropHeight = userImage.height;
      if (aspectRatio > 1) cropWidth = cropHeight;
      else cropHeight = cropWidth;

      const cropX = (userImage.width - cropWidth) / 2;
      const cropY = (userImage.height - cropHeight) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(imageX + radius, imageY + radius, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(userImage, cropX, cropY, cropWidth, cropHeight, imageX, imageY, imageDiameter, imageDiameter);
      ctx.restore();
    }

    downloadBtn.addEventListener('click', () => {
      const file = input.files[0];
      if (!file) {
        alert("Please upload your image.");
        return;
      }

      background = new Image();
      background.src = selectedTemplate;

      userImage = new Image();
      userImage.src = URL.createObjectURL(file);

      background.onload = () => {
        userImage.onload = () => {
          drawCanvas();
        };
      };

      background.onerror = () => {
        alert("Background template image not found.");
      };
    });

    canvas.addEventListener('mousedown', e => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      const dx = mouseX - (imageX + radius);
      const dy = mouseY - (imageY + radius);

      if (dx * dx + dy * dy <= radius * radius) {
        isDragging = true;
        offsetX = dx;
        offsetY = dy;
      }
    });

    canvas.addEventListener('mousemove', e => {
      if (!isDragging) return;
      imageX = e.offsetX - offsetX - radius;
      imageY = e.offsetY - offsetY - radius;
      drawCanvas();
    });

    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);

    downloadBtn.addEventListener('dblclick', () => {
      if (!userImage || !background) return;
      const link = document.createElement('a');
      link.download = 'eid-greeting-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
