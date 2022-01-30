import React from 'react';
import "./css/Appbar.css";
import SearchIcon from "@mui/icons-material/Search";

function Appbar() {
    return (
        <header>
            <div className="header-container">
                <div className="header-left">
                    <div className="header-left-img-container">
                        <img src = {require('./img/gator.png')} alt="logo"/>
                        <text>GatorExchange</text>
                    </div>
                </div>
                <div className="header-middle">
                    <div className="header-search-container">
                        <SearchIcon />
                        <input type='text' placeholder='Search...'></input>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Appbar;
