import { Avatar } from '@mui/material';
import React, { useState } from "react";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { Link } from 'react-router-dom';
import "./index.css";

function MainQuestion() {
    const [show, setShow] = useState(false)
    return (
        <div className="main"> 
           <div className="main-question-container">
               <div class="main-top">
                   <h2 className="main-question">React-router urls don't work when refreshing or writing manually</h2>
                   <Link to='./ask-question'><button>Ask Question</button></Link>
               </div>
               <div className="main-desc">
                   <div className="info">
                       <p>Timestamp</p>
                       <p>Active<span>Today</span></p>
                       <p>Viewed<span>10 times</span></p>
                   </div>
               </div>
               <div className="question-body">
                   <div className="question-body-container">
                       <div className="question-body-left">
                            <div className="all-options">
                                <Link><p className="arrow">▲</p></Link>
                                <p className="arrow">0</p>
                                <Link><p className="arrow">▼</p></Link>
                           </div>
                       </div>
                       <div className="question-answer">
                           <p>I'm using React-router and it works fine while I'm clicking on link buttons, but when I refresh my webpage it does not load what I want.

For instance, I am in localhost/joblist and everything is fine because I arrived here pressing a link. But If I refresh the webpage I get:I'm using React-router and it works fine while I'm clicking on link buttons, but when I refresh my webpage it does not load what I want.

For instance, I am in localhost/joblist and everything is fine because I arrived here pressing a link. But If I refresh the webpage I get:I'm using React-router and it works fine while I'm clicking on link buttons, but when I refresh my webpage it does not load what I want.

For instance, I am in localhost/joblist and everything is fine because I arrived here pressing a link. But If I refresh the webpage I get:I'm using React-router and it works fine while I'm clicking on link buttons, but when I refresh my webpage it does not load what I want.

For instance, I am in localhost/joblist and everything is fine because I arrived here pressing a link. But If I refresh the webpage I get:</p>
                           <div className="author">
                               <small>Asked "Timestamp"</small>
                               <div className="author-details"><Avatar/><p>Author name</p></div>
                           </div>
                           <div className="comments">
                               <div className="comment">
                                   <p>This is comment - <span>User name <small>Timestamp</small></span></p>
                               </div>
                               <p onClick={() => setShow(!show)}>Add a comment</p>
                               {show && (
                                    <div className="title">
                                        <textarea type="text" placeholder="Add your comment..." style={{
                                            margin: "5px 0px",
                                            padding: "10px",
                                            border: "1px solid rgba(0,0,0,0.2)",
                                            borderRadius: "3px",
                                            outline: "none"
                                        }} rows={5}></textarea>
                                        <button style={{maxWidth:"fit-content"}}>Add comment</button>
                                    </div>
                               )}
                           </div>
                       </div>
                   </div>
               </div>
               <div style={{flexDirection:"column"}} className="question-body">
                   <p style={{marginBottom:"20px", fontSize:"1.3rem", fontWeight:"300"}}>1 Answer</p>
                   <div className="question-body-container">
                        <div className="question-body-left">
                           <div className="all-options">
                                <Link><p className="arrow">▲</p></Link>
                                <p className="arrow">0</p>
                                <Link><p className="arrow">▼</p></Link>
                           </div>
                       </div>
                       <div className="question-answer">
                           <p>I'm not sure if the reason why this choice was originally made is documented anywhere (although, for all I know, it could be explained in great length in some PEP somewhere), but we can certainly come up with various reasons why it makes sense.
                              One reason is simply that rounding towards negative (or positive!) infinity means that all numbers get rounded the same way, whereas rounding towards zero makes zero special. The mathematical way of saying this is that rounding down towards is translation invariant, i.e. it satisfies the equation:</p>
                           <div className="author">
                               <small>Asked "Timestamp"</small>
                               <div className="author-details"><Avatar/><p>Author name</p></div>
                           </div>
                        </div>
                   </div>
               </div>
           </div>
           <div className="main-answer">
               <h3 style={{fontSize: "22px", margin:"10px 0", fontWeight:"400"}}>Your answer</h3>
               <ReactQuill className="react-quill" theme="snow" style={{height: "200px"}}/>
           </div>
           <button style={{maxWidth:"fit-content", marginTop:"50px"}}>Post your answer</button>
        </div>
    );
}

export default MainQuestion;
