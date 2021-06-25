import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
var demoImg = "http://fabricjs.github.io/assets/pug.jpg";

const Test = () => {
  const [canvas, setCanvas] = useState("");
  const [text, setText] = useState("");
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);
  const initCanvas = () => new fabric.Canvas("c");

  useEffect(() => {
    if (!canvas) {
      return;
    }
    fabric.Image.fromURL(demoImg, function (img) {
      img.scale(0.5).set({
        left: 150,
        top: 150,
        angle: -15,
      });
      canvas.add(img).setActiveObject(img);
    });

    // events

    canvas.on({
      "touch:gesture": function () {
        setText("gesture");
      },
      "touch:drag": function () {
        setText("drag");
      },
      "touch:orientation": function () {
        setText("orientation");
      },
      "touch:shake": function () {
        setText("shake");
      },
      "touch:longpress": function () {
        setText("longpress");
      },
    });
  }, [canvas]);

  return (
    <div>
      <p
        id="info"
        onTouchStart={() => console.log("strt")}
        style={{
          background: "#eef",
          width: "583px",
          padding: "10px",
          overflow: " scroll",
          height: "40px",
        }}
      >
        {text}
      </p>
      <canvas
        id="c"
        width="600"
        height="500"
        style={{ border: "2px solid black" }}
        onTouchStart={() => console.log("strt")}
      ></canvas>
    </div>
  );
};

export default Test;
