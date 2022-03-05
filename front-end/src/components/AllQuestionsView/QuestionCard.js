import React from 'react';
import { Link } from 'react-router-dom';
import "./css/QuestionCard.css";
import ReactHtmlParser from 'react-html-parser';

export default function QuestionCard({question}) {
    function truncate(string, n) {
        return (string?.length > n) ? string.substr(0, n-1) + "..." : string;
    }
    
    return (
        <div className="question">
            <div className="question-container">
                <div className="question-left">
                    <div className="all-options">
                        <div className="all-option">
                            <p>{question?.upvotes}</p>
                            <span>Votes</span>
                        </div>
                        <div className="all-option">
                            <p>{question?.answers?.length}</p>
                            <span>Answers</span>
                        </div>
                        <div className="all-option">
                            <p>{question?.views}</p>
                            <span>Views</span>
                        </div>
                    </div>
                </div>
                <div className="question-answer">
                    <Link to={`/question?q=${question?.id}`}>{question?.title}</Link>
                    <div style={{
                        width: "90%",
                    }}>
                        <div>{ReactHtmlParser(truncate(question?.body,300))}</div>
                    </div>
                    <div style={{
                            display: "flex",
                        }}>
                        {question?.tags.map((tag) => (
                            <>
                                <span className="tags">{tag}</span>
                            </>
                        ))}
                    </div>
                    <div className="timestamp">
                        <small>{new Date(question?.createdtime).toLocaleString()}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
