import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {TagsInput} from 'react-tag-input-component';
import './AskQuestion.css';
import axios from "axios";
import {useHistory, useLocation} from 'react-router-dom';

export default function AskQuestion() {

    const location = useLocation();
    
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [id, setId] = location.state ? useState(location.state.id) : useState("");
    const [title, setTitle] = location.state ? useState(location.state.title) : useState("");
    const [body, setBody] = location.state ? useState(location.state.body) : useState("");
    const [tags, setTags] = location.state ? useState(location.state.tags) : useState([]);

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

    const handleSaveEdit = async (e) => {
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
                .post(`/api/v3/questions/${id}/update`, bodyJSON, config)
                .then((res) => {
                    alert("Question Updated successfully");
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
                <h1>{ (title!=="") ? 'Edit a question' : ' Ask a public question'}</h1>
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
                { location.state ? (
                    <>
                        <button disabled={loading} type="submit" onClick={handleSaveEdit} className="button">{
                            loading ? 'Saving Edits...' : 'Save Edit'
                        }</button>
                    </>
                ) : (
                    <>
                        <button disabled={loading} type="submit" onClick={handleSubmit} className="button">{
                            loading ? 'Adding question...' : 'Add your question'
                        }</button>
                    </>
                )} 
            </div>
        </div>
    );
}