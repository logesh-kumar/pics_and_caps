import Jimp from "jimp";

var loadedImage;

export const generateImage = (file, imageCaption) =>
  Jimp.read(file)
    .then(function (image) {
      loadedImage = image;
      return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    })
    .then(function (font) {
      loadedImage

        .print(font, -10, -10, {
          text: imageCaption,
        })
        .write(file);
    })
    .catch(function (err) {
      console.error(err);
    });
