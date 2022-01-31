import React from 'react';
import { Link } from 'react-router-dom';
import Question from './Question';
import "./css/AllQuestionsView.css";

export default function AllQuestionsView() {
    return (
        <div className="all-questions-view">
            <div className="all-questions-view-container">
                <div className="all-questions-view-top">
                    <h2>All Questions</h2>
                    <Link>
                        <button>Ask questions</button>
                    </Link>
                </div>
                <div className="all-questions-view-options">
                    <p> No. questions</p>
                </div>
                <div className="all-questions-view-content">
                    <div className="question-view-content">
                        <Question />
                        <Question />
                        <Question />
                        <Question />
                        <Question />
                    </div>
                </div>
            </div>
        </div>
    );
}
