import { useState } from "react";

function useImageData(src: string): Uint8ClampedArray {
  const [imageData, setImageData] = useState<Uint8ClampedArray>(
    new Uint8ClampedArray()
  );

  let initialImage = new Image();
  initialImage.src = src;
  initialImage.crossOrigin = "";

  initialImage.addEventListener("load", () => {
    let initialCanvas = document.createElement("canvas");
    let initialContext = initialCanvas.getContext("2d");
    if (initialContext === null) {
      return [];
    }

    initialCanvas.width = initialImage.width;
    initialCanvas.height = initialImage.height;

    initialContext.drawImage(initialImage, 0, 0);

    const dataUrl = initialCanvas.toDataURL("image/jpg");

    let downloadedImage = new Image();
    downloadedImage.src = dataUrl;

    downloadedImage.addEventListener("load", () => {
      let finalCanvas = document.createElement("canvas");
      let finalContext = finalCanvas.getContext("2d");
      if (finalContext === null) {
        return [];
      }

      finalCanvas.width = downloadedImage.width;
      finalCanvas.height = downloadedImage.height;

      finalContext.drawImage(downloadedImage, 0, 0);

      setImageData(
        finalContext.getImageData(0, 0, finalCanvas.width, finalCanvas.height)
          .data
      );
    });
  });

  return imageData;
}

export default useImageData;
