import React from 'react';
import "./css/Appbar.css";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from 'react-router-dom';
import {useHistory} from 'react-router-dom';

function Appbar() {

    const history = useHistory();
    const handleSearch = (value) => {
        console.log(value);
        history.push(`/?q=${value}`);
    }
    return (
        <header>
            <div className="header-container">
                <div className="header-left">
                    <Link to='/'>
                        <div className="header-left-img-container">
                            <img src = {require('./img/gator.png')} alt="logo"/>
                            <span>GatorExchange</span>
                        </div>
                    </Link>
                    
                </div>
                <div className="header-middle">
                    <div className="header-search-container">
                        <SearchIcon />
                        <input type='text' 
                               placeholder='Search...' 
                               onKeyPress={(e) => e.key === 'Enter' && handleSearch(e.target.value)}>
                        </input>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Appbar;
