import * as random from "./util/random";

export default (hash) => {
  // You may want to remove this line for production
  console.log(hash);

  // set the shared PRNG to new seed
  random.set_seed(hash);

  return (context: CanvasRenderingContext2D, width: number, height: number) => {
    const dim = Math.min(width, height);
    let lineWidth = dim * 0.01;
    context.lineWidth = lineWidth;

    const step = width / 6;
    const white = "#F2F5F1";
    const colors = ["#D40920", "#1356A2", "#F7D842"];

    type Square = {
      y: number;
      x: number;
      width: number;
      height: number;
      color?: string;
    };

    var squares: Square[] = [
      {
        y: 0,
        x: 0,
        width: width,
        height,
        color: undefined,
      },
    ];

    function splitSquaresWith(coordinates) {
      // Loops through the squares, and find if one should be split
      const { x, y } = coordinates;

      for (let i = squares.length - 1; i >= 0; i--) {
        const square = squares[i];
        if (x && x > square.x && x < square.x + square.width) {
          if (random.boolean()) {
            squares.splice(i, 1);
            splitOnX(square, x);
          }
        }

        if (y && y > square.y && y < square.y + square.height) {
          if (random.boolean()) {
            squares.splice(i, 1);
            splitOnY(square, y);
          }
        }
      }
    }

    function splitOnX(square, splitAt) {
      // Create two new squares, based on splitting the given one at the x coordinate given
      let squareA = {
        x: square.x,
        y: square.y,
        width: square.width - (square.width - splitAt + square.x),
        height: square.height,
      };

      let squareB = {
        x: splitAt,
        y: square.y,
        width: square.width - splitAt + square.x,
        height: square.height,
      };

      squares.push(squareA);
      squares.push(squareB);
    }

    function splitOnY(square, splitAt) {
      // Create two new squares, based on splitting the given one at the y coordinate given
      var squareA = {
        x: square.x,
        y: square.y,
        width: square.width,
        height: square.height - (square.height - splitAt + square.y),
      };

      var squareB = {
        x: square.x,
        y: splitAt,
        width: square.width,
        height: square.height - splitAt + square.y,
      };

      squares.push(squareA);
      squares.push(squareB);
    }

    for (let i = 0; i < width; i += step) {
      splitSquaresWith({ y: i });
      splitSquaresWith({ x: i });
    }

    for (let i = 0; i < colors.length; i++) {
      squares[random.rangeFloor(0, squares.length)].color = colors[i];
    }

    for (let i = 0; i < squares.length; i++) {
      context.beginPath();
      context.rect(
        squares[i].x,
        squares[i].y,
        squares[i].width,
        squares[i].height
      );

      if (squares[i].color) {
        context.fillStyle = squares[i].color;
      } else {
        context.fillStyle = white;
      }
      context.fill();
      context.stroke();
    }

    // let step = 20;
    // for (let x = 0; x < width; x += step) {
    //   for (let y = 0; y < height; y += step) {
    //     let leftToRight = random.boolean();
    //     if (leftToRight) {
    //       context.moveTo(x, y);
    //       context.lineTo(x + step, y + step);
    //     } else {
    //       context.moveTo(x + step, y);
    //       context.lineTo(x, y + step);
    //     }
    //   }
    // }
    // context.stroke();
  };
};
