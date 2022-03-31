import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

export default function Sidebar(){
    return (
        <div className="sidebar">
            <div className="sidebar-container">
                <div className="sidebar-options">
                    <div className="sidebar-option">
                        <Link to='/questions'>Home</Link>
                    </div>
                    <div className="sidebar-option">
                        <Link to='/questions'>Questions</Link>
                    </div>
                    <div className="sidebar-option">
                        <Link to='/questions'>Tags</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}