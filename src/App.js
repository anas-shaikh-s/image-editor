import "./App.css";
// import ImageEditor from "./components/ImageEditor";
import Canvas from "./components/Canvas";
// import Test from "./components/Test";
// import test from "./bg6.jpg";
import imgSrc from "./bg5.jpg";
// import { useState } from "react";

function App() {
  // const [image, setImage] = useState(null);

  return (
    <div className="App">
      {/* <ImageEditor imgsrc={test} /> */}
      {/* <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          console.log(e.target.files[0]);

          const imgObj = new Image();
          imgObj.src = e.target.src;
          setImage(imgObj);
        }}
      /> */}
      <Canvas imgSrc={imgSrc} />
      {/* <Test /> */}
    </div>
  );
}

export default App;
