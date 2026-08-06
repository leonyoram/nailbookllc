const Jimp = require("jimp");

async function main() {
  const image = await Jimp.read("public/images/Logo/Nail Book LLC.png");
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];

    if (red > 240 && green > 240 && blue > 240) {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  await image.writeAsync("public/images/Logo/Nail Book LLC Transparent.png");
  console.log("Done generating transparent logo!");
}

main().catch(console.error);
