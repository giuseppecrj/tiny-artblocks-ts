export default () => {
  return (context: CanvasRenderingContext2D, width: number, height: number) => {
    context.fillStyle = "rgb(45,42,36)";
    context.fillRect(0, 0, width, height);
  };
};
