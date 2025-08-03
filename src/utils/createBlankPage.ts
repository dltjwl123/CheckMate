export const createBlankImageDataUrl = (
  width: number,
  height: number,
  fill: string = "white"
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL("image/png");
};
