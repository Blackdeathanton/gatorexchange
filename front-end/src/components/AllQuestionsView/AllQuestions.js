import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterListIcon from "@material-ui/icons/FilterList";
import QuestionCard from './QuestionCard';
import "./css/AllQuestions.css";
import {TagsInput} from 'react-tag-input-component';
import "@pathofdev/react-tag-input/build/index.css";
import { useHistory } from 'react-router-dom';

export default function AllQuestions({questions}) {

    const [showFilters, setFiltersVisibility] = useState(false);
    const history = useHistory();
    
    const [noAnswer, setNoAnswer] = useState(false);
    const [hasUpvotes, setHasUpvotes] = useState(false);

    const [sort, setSort] = useState("recent");

    const [tags, setTags] = useState([])

    const toggleFilterDisplay = () => {
        setFiltersVisibility(!showFilters)
    }


    const handleApplyFilter = () => {
        let url = "/questions";
        let alreadyIncluded = false

        if (tags.length > 0){
            url += "?tag=" + tags.join(' ')
            alreadyIncluded = true;
        }
        if (noAnswer && hasUpvotes){
            url += alreadyIncluded ? "&filters=NoAnswer,HasUpvotes" : "?filters=NoAnswer,HasUpvotes";
            alreadyIncluded = true
        } else if (noAnswer){
            url += alreadyIncluded ? "&filters=NoAnswer" : "?filters=NoAnswer";
            alreadyIncluded = true
        } else if (hasUpvotes){
            url += alreadyIncluded ? "&filters=HasUpvotes" : "?filters=HasUpvotes";
            alreadyIncluded = true
        }
        url += alreadyIncluded ? "&sort=" + sort : "?sort=" + sort;
        history.push(encodeURI(url))
    }

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
                    <div className="main-filter">
                        {/* <div className="main-tabs">
                            <div className="main-tab">
                                <Link to="/questions?q=recent">Recent</Link>
                            </div>
                            <div className="main-tab">
                                <Link to="/questions?q=views">Views</Link>
                            </div>
                            <div className="main-tab">
                                <Link to="/questions?q=upvotes">Upvotes</Link>
                            </div>
                        </div> */}
                        <div className="main-filter-item" onClick={toggleFilterDisplay}>
                            <FilterListIcon />
                            <p>Filter</p>
                        </div>
                    </div>
                </div>

                { showFilters ? (
                    <>
                        <div className="filter-options-main-container">
                            <div className="filters-container">
                                <div className="filter-container">
                                    <legend>Filter by</legend>
                                    <div className="filter-items">
                                        <div className="filter-item">
                                            <input type="checkbox" checked={noAnswer} onChange={(e) => setNoAnswer(e.target.checked)}/>
                                            <p>No answers</p>
                                        </div>
                                        <div className="filter-item">
                                            <input type="checkbox" checked={hasUpvotes} onChange={(e) => setHasUpvotes(e.target.checked)}/>
                                            <p>Has upvotes</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-container">
                                    <legend>Sort by</legend>
                                    <div className="filter-item">
                                        <input type="radio" value="recent" checked={sort==="recent"} onChange={(e) => setSort(e.target.value)}/>
                                        <p>Recent</p>
                                    </div>
                                    <div className="filter-item">
                                        <input type="radio" value="views" checked={sort==="views"} onChange={(e) => setSort(e.target.value)}/>
                                        <p>Views</p>
                                    </div>
                                    <div className="filter-item">
                                        <input type="radio" value="upvotes" checked={sort==="upvotes"} onChange={(e) => setSort(e.target.value)}/>
                                        <p>Upvotes</p>
                                    </div>
                                </div>
                                <div className="filter-container">
                                    <legend>Tagged with</legend>
                                    <div className="filter-tag-container">
                                        <TagsInput 
                                            value={tags}
                                            onChange={setTags}
                                            name="tags" 
                                            placeHolder="Eg., Python"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="filters-footer">
                                <button type="submit" onClick={handleApplyFilter} className="filters-button button">Apply filter</button>
                                <p className="filters-button" onClick={toggleFilterDisplay}> Cancel </p>
                            </div>
                        </div>
                    </>
                ) :
                ( 
                    <>
                    
                    </>
                )
                } 
                
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
