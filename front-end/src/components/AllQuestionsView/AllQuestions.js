import React from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import "./css/AllQuestions.css";

export default function AllQuestions() {
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
                    <p> No. questions</p>
                </div>
                <div className="all-questions-view-content">
                    <div className="question-view-content">
                        <QuestionCard />
                        <QuestionCard />
                        <QuestionCard />
                        <QuestionCard />
                        <QuestionCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
