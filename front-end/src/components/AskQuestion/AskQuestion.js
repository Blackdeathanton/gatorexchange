import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {TagsInput} from 'react-tag-input-component';
import './AskQuestion.css';
import axios from "axios";
import {useHistory} from 'react-router-dom';

export default function AskQuestion() {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    

    const handleQuill = (value) => {
        setBody(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (title !== "" && body !== "") {
            setLoading(true)
            const bodyJSON = {
                //TODO:
                author: sessionStorage.getItem("username"),
                author_email: sessionStorage.getItem("email"),
                title: title,
                body: body,
                tags: tags
            };
            const config = {
                headers: {
                    "token": sessionStorage.getItem("token")
                }
            }
            await axios
                .post("/api/v1/questions", bodyJSON, config)
                .then((res) => {
                    alert("Question added successfully");
                    setLoading(false);
                    history.push("/questions");
                })
                .catch((err) => {
                    setLoading(false);  
                    console.log(err);
                });
        }
    };

    return (
        <div className="ask-question">
            <div className="ask-question-container">
                <div className="ask-question-top">
                    <h1> Ask a public question</h1>
                </div>
                <div className="question-container">
                    <div className="question-options">
                        <div className="question-option">
                            <div className="title">
                                <h3>Title</h3>
                                <small>
                                    Be specific and imagine you're asking a question to another person
                                </small>
                                <input 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    type="text" 
                                    placeholder="Add question title"
                                />
                            </div>
                            <div className="title">
                                <h3>Body</h3>
                                <small>
                                    Include all the information someone would need to answer your question
                                </small>
                                <ReactQuill 
                                    value={body}
                                    onChange={handleQuill}
                                    // modules={Editor.modules}
                                    className="react-quill"
                                    theme="snow"
                                />
                            </div>
                            <div className="title">
                                <h3>Tags</h3>
                                <small>
                                    Add upto 5 tags to describe what your question is about
                                </small>
                                <TagsInput 
                                    value={tags}
                                    onChange={setTags}
                                    name="tags" 
                                    placeHolder="press enter to add new tag"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button disabled={loading} type="submit" onClick={handleSubmit} className="button">{
                    loading ? 'Adding question...' : 'Add your question'
                }</button>
            </div>
        </div>
    );
}