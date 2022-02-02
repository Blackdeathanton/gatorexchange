import React from 'react';
import './css/index.css';
import AllQuestions from './AllQuestions';
import Sidebar from '../Sidebar/Sidebar';


export default function index() {
    return (
        <div className="all-questions-view-main">
            <div className="all-questions-view-main-content">
                <Sidebar/>
                <AllQuestions/>
            </div>
        </div>
    );
}