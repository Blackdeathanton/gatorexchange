import React, { useEffect, useState } from "react";
import './css/index.css';
import AllQuestions from './AllQuestions';
import Sidebar from '../Sidebar/Sidebar';
import axios from "axios";

export default function Index() {

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function getQuestion() {
            await axios
                .get("/api/v1/questions")
                .then((res) => {
                    setQuestions(res.data.reverse());
                    // console.log(res.data)
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        getQuestion();
    }, []);

    return (
        <div className="all-questions-view-main">
            <div className="all-questions-view-main-content">
                <Sidebar/>
                <AllQuestions questions={questions}/>
            </div>
        </div>
    );
}