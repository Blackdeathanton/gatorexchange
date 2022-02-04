import React from 'react';
import MainQuestion from './MainQuestion';
import './index.css';
import Sidebar from '../Sidebar/Sidebar';

export default function index() {
    return (
        <div className="question-view">
            <div className="question-view-container">
                <Sidebar/>
                <MainQuestion/>
            </div>
        </div>
    );
}