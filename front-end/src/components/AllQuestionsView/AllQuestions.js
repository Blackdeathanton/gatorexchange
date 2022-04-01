import React from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import "./css/AllQuestions.css";

export default function AllQuestions({questions}) {
    return (
        <div className="all-questions-view">
            <div className="all-questions-view-container">
                <div className="all-questions-view-top">
                    <h2>All Questions</h2>
                    <Link to='/ask-question'>
                        <button>Ask questions</button>
                    </Link>
                </div>
                <div className="all-questions-view-options">
                    <p>{questions && questions.length} Questions</p>
                </div>
                <div className="all-questions-view-content">{
                    questions.map((question, index) => (
                        <div className="question-view-content" key={index}>
                            <QuestionCard index={index} question={question}/>
                        </div>
                    ))}                    
                </div>
            </div>
        </div>
    );
}
