import React from 'react';
import { Link } from 'react-router-dom';
import "./css/QuestionCard.css";

export default function QuestionCard() {
    return (
        <div className="question">
            <div className="question-container">
                <div className="question-left">
                    <div className="all-options">
                        <div className="all-option">
                            <p>1950</p>
                            <span>Votes</span>
                        </div>
                        <div className="all-option">
                            <p>1665</p>
                            <span>Answers</span>
                        </div>
                        <div className="all-option">
                            <p>1276</p>
                            <span>Views</span>
                        </div>
                    </div>
                </div>
                <div className="question-answer">
                    <Link to="/question">Q: Programmatically navigate using React router</Link>
                    <div style={{
                        width: "90%",
                    }}>
                        <div>
                        With react-router I can use the Link element to create links which are natively handled by react router. I see internally it calls this.context.transitionTo(...). I want to do a navigation. …
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                    }}>
                        <span className="tags">reactjs</span>
                        <span className="tags">javascript</span>
                        <span className="tags">jsx</span>
                    </div>
                    <div className="timestamp">
                        <small>Timestamp</small>
                    </div>
                </div>
            </div>
        </div>
    );
}