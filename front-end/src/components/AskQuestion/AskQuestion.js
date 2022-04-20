import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {TagsInput} from 'react-tag-input-component';
import './AskQuestion.css';
import axios from "axios";
import {useHistory, useLocation} from 'react-router-dom';

export default function AskQuestion() {

    const location = useLocation();
    
    const history = useHistory();
    const qid = location.state ? location.state.id : "";
    const aid = location.state ? location.state.answerId : "";
    const qtitle = location.state ? location.state.title : "";
    const qbody = location.state ? location.state.body : "";
    const qtags = location.state ? location.state.tags : [];

    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(qid);
    const [answerId, setAnswerId] = useState(aid);
    const [title, setTitle] = useState(qtitle);
    const [body, setBody] = useState(qbody);
    const [tags, setTags] = useState(qtags);

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
                    history.push(`/question?q=${res.data.InsertedID}`);
                })
                .catch((err) => {
                    setLoading(false);  
                    console.log(err);
                });
        }
    };

    const handleSaveEditQuestion = async (e) => {
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
                    history.push(`/question?q=${id}`);
                })
                .catch((err) => {
                    setLoading(false);  
                    console.log(err);
                });
        }
    };

    const handleSaveEditAnswer = async (e) => {
        e.preventDefault();
    
        if (body !== "") {
            setLoading(true)
            const bodyJSON = {
                //TODO:
                author: sessionStorage.getItem("username"),
                author_email: sessionStorage.getItem("email"),
                body: body,
            };
            const config = {
                headers: {
                    "token": sessionStorage.getItem("token")
                }
            }
            await axios
                .post(`/api/v3/questions/${id}/answers/${answerId}/update`, bodyJSON, config)
                .then((res) => {
                    alert("Answer Updated successfully");
                    setLoading(false);
                    history.push(`/question?q=${id}`);
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
                <h1>{ (location.state) ? ((location.state.type === 'question') ? 'Edit Question': 'Edit answer') : 'Ask a public question'}</h1>
                </div>
                <div className="question-container">
                    <div className="question-options">
                        <div className="question-option">
                            {
                                (!location.state || location.state.type === 'question') && (
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
                                            data-testid="ask-ques-title"
                                        />
                                    </div>
                                ) 
                            }
                            <div className="title" data-testid="ask-ques-body">
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
                            {
                                (!location.state || location.state.type === 'question') && (
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
                                )
                            }
                        </div>
                    </div>
                </div>
                { location.state ? (
                    <>
                        <button disabled={loading} type="submit" data-testid="save-edit" onClick={location.state.type==='question' ? handleSaveEditQuestion : handleSaveEditAnswer} className="button">{
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