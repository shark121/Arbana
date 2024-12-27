const Vibrant =  require("node-vibrant/node");

let imageUrl = 'https://www.google.com/images/srpr/logo4w.png';




Vibrant.Vibrant.from(imageUrl)
    .getPalette()
    .then(palette => {
        console.log('Extracted Palette:');
        for (const [swatch, color] of Object.entries(palette)) {
            console.log(`${swatch}: ${color.getHex()}`);
        }
    })
    .catch(err => {
        console.error('Error extracting palette:', err);
    });