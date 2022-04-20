import { Avatar } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { Link } from 'react-router-dom';
import "./index.css";
import ReactHtmlParser from 'react-html-parser';
import {useHistory} from 'react-router-dom';

function MainQuestion() {
    const history = useHistory();
    const [show, setShow] = useState(false)
    const [answer, setAnswer] = useState("")
    const [comment, setComment] = useState("")
    const [questionData, setQuestionData] = useState()
    let search = window.location.search
    const params = new URLSearchParams(search)
    const id = params.get("q")

    const handleQuill = (value) => {
        setAnswer(value)
    }

    const handleQuestionUpvote = () => {
        //TODO
        if (!sessionStorage.getItem("token")){
            history.push("/auth");
            return;
        }
        const config = {
            headers: {
                "token": sessionStorage.getItem("token")
            }
        }

        axios.post(`/api/v2/questions/${id}/vote/upvote`, {}, config).then((res) => {
            history.push("/temp")
            history.goBack()
        }).catch((err) => console.log(err))
    }
    
    const handleQuestionDownvote = () => {
        //TODO
        if (!sessionStorage.getItem("token")){
            history.push("/auth");
            return;
        }
        const config = {
            headers: {
                "token": sessionStorage.getItem("token")
            }
        }
        axios.post(`/api/v2/questions/${id}/vote/downvote`, {}, config).then((res) => {
            history.push("/temp")
            history.goBack()
        }).catch((err) => console.log(err))
    }

    const handleAnswerUpvote = (answerId) => {
        //TODO
        if (!sessionStorage.getItem("token")){
            history.push("/auth");
            return;
        }
        const config = {
            headers: {
                "token": sessionStorage.getItem("token")
            }
        }
        axios.post(`/api/v3/questions/${id}/answers/${answerId}/vote/upvote`, {}, config).then((res) => {
            history.push("/temp")
            history.goBack()
        }).catch((err) => console.log(err))
    }
    
    const handleAnswerDownvote = (answerId) => {
        //TODO
        if (!sessionStorage.getItem("token")){
            history.push("/auth");
            return;
        }
        const config = {
            headers: {
                "token": sessionStorage.getItem("token")
            }
        }
        axios.post(`/api/v3/questions/${id}/answers/${answerId}/vote/downvote`, {}, config).then((res) => {
            history.push("/temp")
            history.goBack()
        }).catch((err) => console.log(err))
    }

    const handleSubmit = async() => {
        if(answer !== "") {
            //TODO
            if (!sessionStorage.getItem("token")){
                history.push("/auth");
                return;
            }

            const body = {
                question_id: id,
                body:  answer,
                author: sessionStorage.getItem("username"),//TODO
            }
            const config = {
                headers: {
                    "token": sessionStorage.getItem("token")
                }
            }

            await axios.post("/api/v2/answers", body, config).then((res) => {
                console.log(res.data)
                alert("Answer added successfully")
                setAnswer("")
                getUpdatedAnswer()
            }).catch((err) => console.log(err))
        }
    }

    const handleComment = async() => {
        if (comment !== ""){
            //TODO
            if (!sessionStorage.getItem("token")){
                history.push("/auth");
                return;
            }

            const body = {
                question_id: id,
                body: comment,
                author: sessionStorage.getItem("username")
            }

            const config = {
                headers: {
                    "token": sessionStorage.getItem("token")
                }
            }

            await axios.post("/api/v2/comments", body, config).then((res) => {
                console.log(res.data)
                setComment("")
                setShow(false)
                getUpdatedAnswer()
            })
        }
    }
    
    async function getUpdatedAnswer() {
        await axios.get(`api/v1/questions/${id}`).then((res) => {
            setQuestionData(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleEditQuestion = () => {
        let data = {
            type: "question",
            id: questionData?.id,
            title : questionData?.title,
            body: questionData?.body,
            tags: questionData?.tags
        }
        history.push('/edit-question', data)
    }

    const handleDeleteQuestion = async() => {
        const config = {
            headers: {
                "token": sessionStorage.getItem("token")
            }
        }
        await axios
                .delete(`/api/v2/questions/${questionData.id}`, config)
                .then((res) => {
                    alert("Question deleted successfully");
                    history.push("/questions");
                })
                .catch((err) => {
                    console.log(err);
                });
    }

    const handleEditAnswer = (answerId, body) => {
        let data = {
            type: "answer",
            id: questionData?.id,
            answerId: answerId,
            body: body,
        }
        history.push('/edit-answer', data)
    }

    const handleDeleteAnswer = async(answerId) => {
        const config = {
            headers: {
                "token": sessionStorage.getItem("token")
            }
        }
        await axios
                .delete(`/api/v3/questions/${questionData.id}/answers/${answerId}`, config)
                .then((res) => {
                    alert("Answer deleted successfully");
                    history.push('temp');
                    history.goBack();
                })
                .catch((err) => {
                    console.log(err);
                });
    }

    useEffect(() => {
        async function getQuestionDetails() {
            await axios.get(`api/v1/questions/${id}`).then((res) => {
                setQuestionData(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }
        getQuestionDetails()
    }, [id])

    return (
        <div className="main"> 
           <div className="main-question-container">
               <div className="main-top">
                   <h2 className="main-question">{questionData?.title}</h2>
                   <Link to='./ask-question'><button>Ask Question</button></Link>
               </div>
               <div className="main-desc">
                   <div className="info">
                       <p>Asked<span>{new Date(questionData?.createdtime).toLocaleString()}</span></p>
                       <p>Active<span>{new Date(questionData?.updatedtime).toLocaleString()}</span></p>
                       <p>Viewed<span>{questionData?.views} times</span></p>
                   </div>
               </div>
               <div className="question-body">
                   <div className="question-body-container">
                       <div className="question-body-left">
                            <div className="all-options">
                                <p className="arrow" onClick={handleQuestionUpvote}>▲</p>
                                <p className="arrow">{questionData?.upvotes - questionData?.downvotes}</p>
                                <p className="arrow" onClick={handleQuestionDownvote}>▼</p>
                           </div>
                       </div>
                       <div className="question-answer">
                            <p>{ReactHtmlParser(questionData?.body)}</p>
                            <div className="author">
                               <small>Asked {new Date(questionData?.createdtime).toLocaleString()}</small>
                               <div className="author-details"><Avatar/><p>{questionData?.author}</p></div>
                            </div>
                            {
                                questionData?.author === sessionStorage.getItem("username") && (
                                    <div className="question-modify-options">
                                        <span data-testid="edit-question" onClick={handleEditQuestion}>Edit</span>
                                        <span data-testid="delete-question" onClick={handleDeleteQuestion}>Delete</span>
                                    </div>
                                )
                            }
                            <div className="comments">
                               <div className="comment">
                                    {
                                        questionData?.comments && questionData?.comments?.map((comment) => <p>
                                            {comment?.body} - <span>{comment?.author}</span> <small>{new Date(comment?.createdtime).toLocaleString()}</small>
                                        </p>)
                                    }
                               </div>
                               <p onClick={() => setShow(!show)}>Add a comment</p>
                               {show && (
                                    <div className="title">
                                        <textarea 
                                            value={comment}
                                            onChange= {(e) => setComment(e.target.value)}
                                            type="text" 
                                            placeholder="Add your comment..." 
                                            style={{
                                            margin: "5px 0px",
                                            padding: "10px",
                                            border: "1px solid rgba(0,0,0,0.2)",
                                            borderRadius: "3px",
                                            outline: "none"
                                        }} rows={5}></textarea>
                                        <button 
                                            onClick={handleComment}
                                            style={{maxWidth:"fit-content"}}>Add comment
                                        </button>
                                    </div>
                               )}
                           </div>
                       </div>
                   </div>
               </div>
               <div style={{flexDirection:"column"}} className="question-body">
                   <p data-testid="answers-count" style={{marginBottom:"20px", fontSize:"1.3rem", fontWeight:"300"}}>{questionData?.answers?.length} Answer(s)</p>
                    {
                       questionData?.answers?.map((answer) => (
                        <>
                        <div key={answer?.id} className="question-body-container">
                            <div className="question-body-left">
                            <div className="all-options">
                                    <p className="arrow" onClick={() => {handleAnswerUpvote(answer?.id)}}>▲</p>
                                    <p className="arrow">{answer?.upvotes-answer?.downvotes}</p>
                                    <p className="arrow" onClick={() => {handleAnswerDownvote(answer?.id)}}>▼</p>
                            </div>
                            </div>
                            <div className="question-answer">
                                <p>{ReactHtmlParser(answer?.body)}</p>
                                <div className="author">
                                    <small>Asked {new Date(answer?.createdtime).toLocaleString()}</small>
                                    <div className="author-details"><Avatar/><p>{answer?.author}</p></div>
                                </div>
                                {
                                    answer?.author === sessionStorage.getItem("username") && (
                                        <div className="answer-modify-options">
                                            <span data-testid="edit-answer" onClick={() => {handleEditAnswer(answer?.id, answer?.body)}}>Edit</span>
                                            <span data-testid="delete-answer" onClick={() => {handleDeleteAnswer(answer?.id)}}>Delete</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        </>
                        ))  
                    }
                   
               </div>
           </div>
           <div className="main-answer">
               <h3 style={{fontSize: "22px", margin:"10px 0", fontWeight:"400"}}>Your answer</h3>
               <ReactQuill className="react-quill" theme="snow" style={{height: "200px"}} value={answer} onChange={handleQuill}/>
           </div>
           <button data-testid="post-answer-button" type="submit" onClick={handleSubmit} style={{maxWidth:"fit-content", marginTop:"50px"}}>Post your answer</button>
        </div>
    );
}

export default MainQuestion;
