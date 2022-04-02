import React from 'react';
import "./css/Appbar.css";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { Avatar } from "@material-ui/core";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useDispatch } from 'react-redux';
import { logout } from "../../features/userSlice";

function Appbar() {

    const user = useSelector(selectUser);
    const history = useHistory();
    const dispatch = useDispatch()

    const handleSearch = (value) => {
        console.log(value);
        history.push(`/questions?q=${value}`);
    }

    const logOut = () => {
        console.log("log out");
        sessionStorage.clear();
        dispatch(logout());
    }

    return (
        <header>
            <div className="header-container">
                <div className="header-left">
                    <Link to='/questions'>
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
                <div className="header-right">
                    <div className="header-right-container">
                        {
                            user || sessionStorage.getItem("token") ? (
                                <>
                                    {window.innerWidth < 768 && <SearchIcon />}

                                    <Avatar
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    />
                                    <PowerSettingsNewIcon onClick={() => logOut()}/>        
                                </>
                            ) :
                            (
                                <>
                                    <Link to='/auth'>Log In</Link>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Appbar;
