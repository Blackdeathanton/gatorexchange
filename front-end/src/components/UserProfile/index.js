import React from "react";
import Sidebar from '../Sidebar/Sidebar';
import axios from "axios";

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
            </div>
        </div>
    );
}