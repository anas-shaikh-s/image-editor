import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import "./canvas.style.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Canvas = ({ imgSrc }) => {
  const [canvas, setCanvas] = useState("");
  const [option, setOption] = useState("");
  const [zoom, setZoom] = useState(false);
  const [selection, setSelection] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [textColor, setTextColor] = useState("#FF0000");
  const [strokeColor, setStrokeColor] = useState("#FF0000");
  const [fontSize, setFontSize] = useState(25);
  const [shapesCount, setShapesCount] = useState(0);
  const [brushWidth, setBrushWidth] = useState(4);
  const [brushColor, setBrushColor] = useState("#000000");
  // const [cursor, setCursor] = useState("pointer");
  const cnavasRef = useRef();
  // const [degree, setDegree] = useState(0);
  // const [up, setUp] = useState(0);
  // const [rotateThisImg, setRotateThisImg] = useState("");
  // const [isRedoing, setIsRedoing] = useState(false);
  // const [h, setH] = useState([]);
  // const divRef = useRef();
  // console.log(imgSrc);
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  //creating canvas
  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: cnavasRef.current.clientHeight,
      width: cnavasRef.current.clientWidth,
      allowTouchScrolling: false,
      centeredScaling: true,
    });

  //useEffect for handling cavas events

  useEffect(() => {
    //return if canvas is not created yet
    if (!canvas) {
      return;
    }
    //setting bg img for canvas
    fabric.Image.fromURL(imgSrc, function (img, isError) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      });
      // setRotateThisImg(img);
    });

    // canvas.hoverCursor = 'move';
    // canvas.hoverCursor = 'pointer';

    //if canvas will be selectable or not
    canvas.selection = selection;
    //if zoom is enable
    canvas.off("mouse:down").off("mouse:move").off("mouse:up");
    if (option === "zoom") {
      // console.log("option is zoom");
      canvas.isDrawingMode = false;
      canvas.off("mouse:down").off("mouse:move").off("mouse:up");
      return;
    }

    //if drawing is enable
    if (option === "pen") {
      canvas.off("mouse:down").off("mouse:move").off("mouse:up");
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = parseInt(brushWidth);
      canvas.freeDrawingBrush.color = brushColor;
      canvas.on("mouse:up", function () {
        setShapesCount((shapesCount) => shapesCount + 1);
        // setOption("");
      });
      return;
    }
    canvas.isDrawingMode = false;
    // addImg();

    //canvas events based on the selected options
    if (option === "rect") {
      // console.log("Draw rect");
      //turning off previous events
      // canvas.isDrawingMode = false;
      canvas.off("mouse:down").off("mouse:move").off("mouse:up");

      //global vars for the events
      var rect, isDown, origX, origY;

      //start drawing

      canvas.on("mouse:down", function (o) {
        isDown = true;
        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        rect = new fabric.Rect({
          left: origX,
          top: origY,
          // originX: "left",
          // originY: "top",
          width: pointer.x - origX,
          height: pointer.y - origY,
          // angle: 0,
          // transparentCorners: false,
          fill: "",
          stroke: strokeColor,
          strokeWidth: parseInt(strokeWidth),
          padding: 0,
        });
        canvas.add(rect);
      });

      canvas.on("mouse:move", function (o) {
        if (!isDown) return;
        var pointer = canvas.getPointer(o.e);

        if (origX > pointer.x) {
          rect.set({ left: Math.abs(pointer.x) });
        }
        if (origY > pointer.y) {
          rect.set({ top: Math.abs(pointer.y) });
        }

        rect.set({ width: Math.abs(origX - pointer.x) });
        rect.set({ height: Math.abs(origY - pointer.y) });

        canvas.renderAll();
      });

      //end drawing
      canvas.on("mouse:up", function (o) {
        isDown = false;
        canvas.off("mouse:down").off("mouse:move").off("mouse:up");
        setOption("");
        setShapesCount((shapesCount) => shapesCount + 1);
      });
    } else if (option === "circle") {
      // console.log("Draw circle");
      //turning off previous events
      // canvas.isDrawingMode = false;
      canvas.off("mouse:down").off("mouse:move").off("mouse:up");

      let circle, isDown, origX, origY;
      //start drawing
      canvas.on("mouse:down", function (o) {
        isDown = true;
        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        circle = new fabric.Circle({
          left: origX,
          top: origY,
          // originX: "left",
          // originY: "top",
          radius: pointer.x - origX,
          fill: "",
          stroke: strokeColor,
          strokeWidth: parseInt(strokeWidth),
          padding: 0,
        });
        canvas.add(circle);
        circle.selectable = selection;
      });

      canvas.on("mouse:move", function (o) {
        if (!isDown) return;
        var pointer = canvas.getPointer(o.e);
        var radius =
          Math.max(Math.abs(origY - pointer.y), Math.abs(origX - pointer.x)) /
          2;
        if (radius > circle.strokeWidth) {
          radius -= circle.strokeWidth / 2;
        }
        circle.set({ radius: radius });

        if (origX > pointer.x) {
          circle.set({ originX: "right" });
        } else {
          circle.set({ originX: "left" });
        }
        if (origY > pointer.y) {
          circle.set({ originY: "bottom" });
        } else {
          circle.set({ originY: "top" });
        }
        canvas.renderAll();
      });
      //end drawing
      canvas.on("mouse:up", function (o) {
        isDown = false;
        canvas.off("mouse:down").off("mouse:move").off("mouse:up");
        setOption("");
        setShapesCount((shapesCount) => shapesCount + 1);
      });
    } else if (option === "text") {
      //turning off previous events
      // canvas.isDrawingMode = false;
      canvas.off("mouse:down").off("mouse:move").off("mouse:up");
      let text, isDown, origX, origY;
      //start drawing
      canvas.on("mouse:down", function (o) {
        isDown = true;
        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        text = new fabric.IText("Add text ", {
          left: origX,
          top: origY,
          originX: "left",
          originY: "top",
          fontSize: fontSize,
          fill: textColor,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
      });

      canvas.on("mouse:move", function (o) {
        if (!isDown) return;
        var pointer = canvas.getPointer(o.e);

        if (origX > pointer.x) {
          text.set({ originX: "right" });
        } else {
          text.set({ originX: "left" });
        }
        if (origY > pointer.y) {
          text.set({ originY: "bottom" });
        } else {
          text.set({ originY: "top" });
        }
        canvas.renderAll();
      });
      //end drawing
      canvas.on("mouse:up", function (o) {
        isDown = false;
        canvas.off("mouse:down").off("mouse:move").off("mouse:up");
        setOption("");
      });
    }
  }, [
    canvas,
    option,
    selection,
    imgSrc,
    strokeWidth,
    zoom,
    textColor,
    fontSize,
    strokeColor,
    brushWidth,
    brushColor,
  ]);

  //function for addign image into canvas
  // const addImg = () => {
  //   fabric.Image.fromURL(imgSrc, function (oImg) {
  //     // oImg.scale(0.5);
  //     oImg.scaleX = canvas.width / oImg.width;
  //     oImg.scaleY = canvas.height / oImg.height;
  //     // oImg.rotate(180);
  //     canvas.add(oImg);
  //     oImg.selectable = false;
  //     canvas.renderAll();
  //     oImg.hoverCursor = "default";
  //     oImg.sendToBack();
  //     // oImg.centeredRotation = true

  //     // setRotateThisImg(oImg);
  //     // console.log(oImg);
  //   });
  // };

  // const rotateLeft = () => {
  //   setDegree(degree - 90);
  //   rotateThisImg.rotate(degree);

  //   canvas.renderAll();
  // };

  // const rotateRight = () => {
  //   setDegree(degree + 90);
  //   rotateThisImg.rotate(degree);
  //   canvas.renderAll();
  // };

  // deleting the selected objects
  const handleDelete = () => {
    //getting all selected objects
    var activeGroup = canvas.getActiveObjects();
    if (activeGroup) {
      for (let i in activeGroup) {
        canvas.remove(activeGroup[i]);
        // console.log(activeGroup[i].get("type"));
        if (activeGroup[i].get("type") !== "i-text") {
          setShapesCount((shapesCount) => shapesCount - 1);
        }
      }
      canvas.discardActiveObject();
      canvas.renderAll();
    } else {
      canvas.getActiveObject().remove();
      setShapesCount((shapesCount) => shapesCount - 1);
    }
  };

  const handleClear = () => {
    var allObjs = canvas.getObjects();
    if (allObjs) {
      for (let i in allObjs) {
        console.log(allObjs[i].get("type"));
        canvas.remove(allObjs[i]);
        // console.log(allObjs[i].get("type"));
        if (allObjs[i].get("type") !== "i-text") {
          setShapesCount((shapesCount) => shapesCount - 1);
        }
      }
      canvas.renderAll();
    }
    // else {
    //   canvas.getActiveObject().remove();
    //   setShapesCount((shapesCount) => shapesCount - 1);
    // }
  };
  // console.log(option);
  return (
    <div className="imageEditor">
      <h1>Image Editor</h1>

      <div className="mainContainer">
        <TransformWrapper disabled={!zoom} z>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <div className="toolbar">
                {/* <button onClick={addImg}>Add img</button> */}
                <div className="tool-control">
                  <button
                    className="btn"
                    onClick={() => {
                      setOption((option) => (option === "pen" ? "" : "pen"));
                      setZoom(false);
                      setSelection(!selection);
                    }}
                    style={{
                      backgroundColor: option === "pen" ? "red" : "white",
                    }}
                  >
                    Pencile
                  </button>

                  <select
                    value={brushWidth}
                    onChange={(e) => setBrushWidth(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                  </select>

                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    width="100%"
                    style={{ width: "100%" }}
                  />
                </div>
                <button
                  className="btn"
                  onClick={() => {
                    setOption("rect");
                    setZoom(false);
                    // setUp(up + 1);
                    setSelection(true);
                  }}
                  style={{
                    backgroundColor: option === "rect" ? "red" : "white",
                  }}
                >
                  Draw Rect
                </button>

                <button
                  className="btn"
                  onClick={() => {
                    setOption("circle");
                    setZoom(false);
                    // setUp(up + 1);
                    setSelection(true);
                  }}
                  style={{
                    backgroundColor: option === "circle" ? "red" : "white",
                  }}
                >
                  Draw circle
                </button>

                <button
                  className="btn"
                  onClick={() => {
                    setZoom(!zoom);
                    setOption("zoom");
                    setSelection(!selection);
                  }}
                  style={{ backgroundColor: zoom ? "red" : "white" }}
                >
                  Move
                </button>
                <button className="btn" onClick={() => zoomIn()}>
                  +
                </button>
                <button className="btn" onClick={() => zoomOut()}>
                  -
                </button>
                <div className="tool-control">
                  <button
                    className="btn"
                    onClick={() => {
                      setOption("text");
                      setZoom(false);
                      setSelection(true);
                    }}
                    style={{
                      backgroundColor: option === "text" ? "red" : "white",
                      margin: "0",
                    }}
                  >
                    Text
                  </button>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    width="100%"
                    style={{ width: "100%" }}
                  />
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                    <option value="60">60</option>
                  </select>
                </div>
                {/* <button onClick={rotateLeft}>Rotate Left</button>
      <button onClick={rotateRight}>Rotate Right</button> */}
                <button className="btn" onClick={handleDelete}>
                  Delete
                </button>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="strokeWidth">Stroke</label>
                  {/* <input
                    className="field"
                    type="number"
                    placeholder="stroke width"
                    min="1"
                    id="strokeWidth"
                    value={strokeWidth}
                    onChange={(e) => {
                      setStrokeWidth(e.target.value);
                    }}
                    style={{ width: "20%" }}
                  /> */}
                  <select
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                  </select>

                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                  />
                </div>

                <button
                  className="btn"
                  onClick={() => {
                    handleClear();
                    // canvas.clear();
                    // setUp(up + 1);
                    // setShapesCount(0);
                    // setOption("");
                    // setSelection(true);
                    // setStrokeWidth(4);
                    // setBrushColor("#000000");
                    // setBrushWidth(4);
                    // setFontSize(25);
                    // setStrokeColor("#FF0000");
                    // setTextColor("#FF0000");
                  }}
                >
                  clear
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    console.log(canvas.toDataURL("jpg"));
                    // canvas.clear(); to clear the canvas after exprot
                  }}
                >
                  Export <small>(base64)</small>
                </button>
                <button className="btn" disabled>
                  {shapesCount}
                </button>
              </div>

              {/* <div className="tools">
                <button onClick={zoomIn}>+</button>
                <button onClick={zoomOut}>-</button>
                <button onClick={resetTransform}>x</button>
              </div> */}
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid black",
                }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <canvas
                  ref={cnavasRef}
                  id="canvas"
                  style={{
                    height: "100%",
                    width: "100%",

                    // border: "2px solid black",
                    // transform: `rotate(${degree}deg)`,
                  }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};
export default Canvas;
