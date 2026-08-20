const fs = require('fs');
const http = require('http');

// Simple HTML page to render SVG into Canvas and output PNG file
const svgContent = fs.readFileSync('./icon-512.svg', 'utf8');

const htmlContent = `
<!DOCTYPE html>
<html>
<body>
<canvas id="canvas" width="512" height="512"></canvas>
<script>
  const svgString = ${JSON.stringify(svgContent)};
  const img = new Image();
  const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  img.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 512, 512);
    const a = document.createElement('a');
    a.download = 'icon-512.png';
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
  };
  img.src = url;
</script>
</body>
</html>
`;

fs.writeFileSync('./render_icon.html', htmlContent);
console.log('HTML Canvas Renderer generated.');
