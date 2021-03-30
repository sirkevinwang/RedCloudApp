import React, {
    useEffect,
    useState
} from 'react';
import './App.css';
import Dropzone from 'react-dropzone-uploader';
import {
    createWorker
} from "tesseract.js";
//import { POST_FCM_TOKEN } from './actions/types';

//import axios from "axios";



function App() {

    const [text, setText] = useState(null);

    const [imageUrl] = useState(null);


    useEffect(() => {
        if (imageUrl != null) {
            ExtractTextFromImage();
        }
    });

    const worker = createWorker({
        logger: (m) => console.log(m),
    });

    const ExtractTextFromImage = async (imageUrl) => {
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
            data: {
                text
            },

        } = await worker.recognize(imageUrl);
        console.log(text);

        var splitCorrect = text.substr(0, text.indexOf(' correct')).split(" "); 
        var numCorrect = splitCorrect[splitCorrect.length - 1]
        console.log(numCorrect);
        var splitIncorrect = text.substr(0, text.indexOf(' incorrect')).split(" "); 
        var numIncorrect = splitIncorrect[splitIncorrect.length - 1]
        
        console.log(numIncorrect);

        const accessToken = '7752~kyvtyeWw0Nh0eTtulblCmrsjmOv4ShH1pHJ7lihJ9jjei4eLp6Dfea55kwXnmGKs';

        const requestOptions = {
            method: 'POST',
            mode: 'no-cors', 
            /*access_token: '7752~kyvtyeWw0Nh0eTtulblCmrsjmOv4ShH1pHJ7lihJ9jjei4eLp6Dfea55kwXnmGKs',
            token_type: 'Bearer',*/
            headers: {/*Authorization: `Bearer ${accessToken}`, */
                      AccessToken: '7752~kyvtyeWw0Nh0eTtulblCmrsjmOv4ShH1pHJ7lihJ9jjei4eLp6Dfea55kwXnmGKs',
                      Accept: '*/*',
                      'Content-Type': 'application/json',
                      "Access-Control-Allow-Origin" : "*", 
                      "Access-Control-Allow-Credentials" : true },
            body: JSON.stringify( { "grade_data":{      "77520000000078275":{         "posted_grade":1       } }})
        };
        const response = await fetch('https://canvas.instructure.com/api/v1/courses/77520000000022705/assignments/77520000000358453/submissions/update_grades', requestOptions);
        if (!response.ok) {
            throw new Error('Failed to post');
        }

        setText(text);
        await worker.terminate();
    };


    const getUploadParams = () => {
        return {
            url: 'https://httpbin.org/post'
        }
    }

    const handleChangeStatus = ({
        meta
    }, status) => {
        if (status === 'headers_received') {
            alert("Uploaded");
            setText("Reconizing...");
            ExtractTextFromImage(meta.previewUrl);
        } else if (status === 'aborted') {
            alert("Something went wrong")
        }
    }


    return ( <React.Fragment>

        <nav className = "navbar navbar-light bg-light justify-content-center mt-3" >
        <a className = "navbar-brand" href = "/" > React OCR </a><br/ >
        <p> Optical Character Recognition with React and Tesseract.js </p>  
        </nav >


        <Dropzone getUploadParams = {
            getUploadParams
        }
        onChangeStatus = {
            handleChangeStatus
        }
        maxFiles = {
            1
        }
        multiple = {
            false
        }
        canCancel = {
            false
        }
        accept = "image/jpeg, image/png, image/jpg"
        inputContent = {
            (files,extra) => (extra.reject ? 'Only PNG and JPG Image files are allowed' : 'Drop  image here')
        }
        styles = {
            {
                dropzoneActive: {
                    borderColor: 'green'
                },
                dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
                    inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
            }
        }
        />  <div className = "container text-center pt-5" > {
            text
        } </div> 

        </React.Fragment>
    )
};

export default App;