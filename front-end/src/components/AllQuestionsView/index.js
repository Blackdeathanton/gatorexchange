import React, { useEffect, useState } from "react";
import './css/index.css';
import AllQuestions from './AllQuestions';
import Sidebar from '../Sidebar/Sidebar';
import axios from "axios";

export default function Index() {

    const [questions, setQuestions] = useState([]);
    let search = window.location.search
    const params = new URLSearchParams(search)
    const id = params.get("q")
    const tags = params.get("tag")

    useEffect(() => {
        async function getQuestion() {
            if (id){
                await axios
                    .get(`/api/v2/search?q=${id}`)
                    .then((res) => {
                        setQuestions(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else if (tags){
                await axios
                    .get(`/api/v3/questions/tagged/${tags}`)
                    .then((res) => {
                        res.data !== null ? setQuestions(res.data) : setQuestions([]);
                        
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                await axios
                .get("/api/v1/questions")
                .then((res) => {
                    setQuestions(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
            }




            // if(id?.length>0){
            //     if(id[0] === '_') {
            //         await axios
            //             .get(`/api/v3/questions/tagged/${id.substring(1)}`)
            //             .then((res) => {
            //                 setQuestions(res.data);
            //             })
            //             .catch((err) => {
            //                 console.log(err);
            //             });
            //     } 

            //     // else if(id === "recent" || id === "views" || id === "upvotes") {
            //     //     await axios
            //     //         .get(`/api/v1/questions?sort=${id}`)
            //     //         .then((res) => {
            //     //             setQuestions(res.data);
            //     //         })
            //     //         .catch((err) => {
            //     //             console.log(err);
            //     //         });
                    
            //     // } 
                
            //     else {
            //         await axios
            //             .get(`/api/v2/search?q=${id}`)
            //             .then((res) => {
            //                 setQuestions(res.data);
            //             })
            //             .catch((err) => {
            //                 console.log(err);
            //             });
            //     }
            // } 
            
            // else if (tags){
            //     await axios
            //         .get(`/api/v3/questions/tagged/${tags}`)
            //         .then((res) => {
            //             setQuestions(res.data);
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //         });
            // }
            
            // else {
            //     await axios
            //     .get("/api/v1/questions")
            //     .then((res) => {
            //         setQuestions(res.data);
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     });
            // }
        }
        getQuestion();
    }, [id, tags]);

    return (
        <div className="all-questions-view-main">
            <div className="all-questions-view-main-content">
                <Sidebar/>
                <AllQuestions questions={questions}/>
            </div>
        </div>
    );
}