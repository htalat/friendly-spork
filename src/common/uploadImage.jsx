import React, { Component } from "react";
import { uploadImages } from "../services/imageService";
import Buttons from "./buttons";
import Images from "./images";
import Spinner from "./spinner";


export default class UploadImages extends Component {
    constructor(props){
        super(props);
        this.state = {
            uploading: false,
            images: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.images !== this.props.images) {
            this.setState({
                images: this.props.images,
            });
        }
    }

    onChange = async (e) => {
        const files = Array.from(e.target.files);
        this.setState({ uploading: true });

        const formData = new FormData();

        //For multiple files.
        // files.forEach((file, i) => {
        //     formData.append(i, file)
        // })
        let file = files[0];
        formData.append("file", file)

        let response = await uploadImages(formData);
        console.log(response)
        let image = response.name;
        let images = [image];

        this.setState({ 
            uploading: false,
            images
        })

        this.props.onHandleChange(images);
    }

    removeImage = id => {
        this.setState({
            images: this.state.images.filter(image => image !== id)
        })
    }

    render() {
        const { uploading, images } = this.state

        const content = () => {
            switch (true) {
                case uploading:
                    return <Spinner />
                case images.length > 0:
                    return <Images images={images} removeImage={this.removeImage} />
                default:
                    return <Buttons onChange={this.onChange} />
            }
        }

        return (
            <div>
                <div className='buttons'>
                    {content()}
                </div>
            </div>
        )
    }
}