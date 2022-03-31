import React, { useEffect, useState } from "react";
import './index.css';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import axios from "axios";

export default function Tags() {
  const [tagslist, setTagslist] = useState([])
  useEffect(() => {
    async function getTags() {
          await axios
          .get("/api/v3/tags")
          .then((res) => {
              console.log(res.data);
              setTagslist(res.data);
          })
          .catch((err) => {
              console.log(err);
          });
    }
    getTags();
  },[]);

return (
  <div className="all-tags-view-main">
      <div className="all-tags-view-main-content">
          <Sidebar/>
          <div className="all-tags-view">
            <div className="all-tags-view-container">
                <div className="all-tags-view-top">
                    <h2>Tags</h2>
                    <p style={{maxWidth: "57%"}}>A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.</p>
                </div>
                <div className="all-tags-view-content">{
                    tagslist.map((tag, index) => (
                        <div className="tag-view-content" key={index}>
                            <Link to={`/questions?q=_${encodeURI(tag.name)}`}><div className="tagname">{tag.name}</div></Link>
                            <div style={{marginBottom: "5px"}}>Sample description</div>
                            <div style={{marginBottom: "5px"}}>{tag.count} question(s)</div>
                        </div>
                    ))}                    
                </div>
            </div>
        </div>
      </div>
  </div>
);
}
