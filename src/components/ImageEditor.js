import React, { Component, createRef } from "react";
import Cropper from "cropperjs";
// import 'cropperjs/dist/cropper.min.css'
import "./ImageEditor.css";

export default class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: "",
    };
    this.imgRef = createRef();
  }
  componentDidMount() {
    const cropper = new Cropper(this.imgRef.current, {
    //   aspectRatio: 1,
    dragMode:'none',
      // zoomable:false,
      crop: () => {
        const canvas = cropper.getCroppedCanvas();
        this.setState({
          previewImage: canvas.toDataURL("image/jpg"),
        });

        console.log("in crop");
      },
    });
  }
  render() {
    return (
      <div>
        <div className="imageContainer">
          <img ref={this.imgRef} src={this.props.imgsrc} alt="sourceImage" />
        </div>
        <div className="imagePreview">
          <img src={this.state.previewImage} alt="preview" />
        </div>
      </div>
    );
  }
}
