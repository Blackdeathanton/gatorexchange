import React, { useState, useEffect } from "react";
import './css/index.css';
import Sidebar from '../Sidebar/Sidebar';
import axios from "axios";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function UserProfile() {

    let search = window.location.search
    const params = new URLSearchParams(search)
    const name = params.get("q")
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        async function getUserDetails() {
            await axios
                .get(`/api/v4/users/${name}`)
                .then((res) => {
                    console.log(res.data);
                    setUserDetails(res.data[0]);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        getUserDetails();
    }, [name]);

    return (
        <div className="user-profile-main">
            <div className="user-profile-content">
                <Sidebar/>
                <div className="user-profile-view">
                    <div className="user-profile-container">
                        
                        {/* top section */}
                        <div className="user-profile-top">
                            <div className="user-avatar">
                                <Avatar style={{
                                            width: "120px",
                                            height: "120px"
                                        }}/>
                            </div>
                            <div className="user-details">
                                <h2>{userDetails?.username}</h2>
                                <p>{userDetails?.firstname+' '+userDetails?.lastname}</p>
                                <p>{userDetails?.email}</p>
                                <p>Member since {userDetails?.createdtime?.substring(0,10)}</p>
                            </div>
                        </div>
                        
                        <div className="user-profile-bottom">
                          <div className="user-profile-left">
                            {/* Stats section */}
                            <div className="user-profile-stats">
                                <h2>Stats</h2>
                                <div className="stats-container">
                                    <div className="stats-content">
                                        <div className="stats-item">
                                            <div>{userDetails?.questions?.length}</div>
                                            <p>Questions</p>
                                        </div>
                                        <div className="stats-item">
                                            <div>{userDetails?.answers?.length}</div>
                                            <p>Answers</p>
                                        </div>
                                        <div className="stats-item">
                                            <div>{userDetails?.tags?.length}</div>
                                            <p>Tags</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags Section */}
                            <div className="user-profile-tags">
                                <h2>Tags</h2>
                                <div className="tags-container">
                                    <div className="tags-content">
                                        {    
                                            userDetails?.tags?.map((tag, index) => (
                                            <div className="tag-item" key={index}>
                                                <Link to={`/questions?tag=${encodeURIComponent(tag._id)}`}><div className="tagname">{tag._id}</div></Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                          </div>
                          <div className="user-profile-right">
                            <div className="user-profile-questions">
                                <h2>Questions</h2>
                                <div className="user-questions-container">
                                    <div className="user-questions-content">
                                        {    
                                            userDetails?.questions?.map((question, index) => (
                                            <div className="question-item" key={index}>
                                                <Link to={`/question?q=${encodeURIComponent(question.id)}`}>{question.title}</Link>
                                                <p>{question.createdtime.substring(0,10)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}