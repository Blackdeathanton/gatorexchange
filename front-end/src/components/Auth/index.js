import React, {useState} from 'react'
import "./index.css"
import axios from "axios";
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from "../../features/userSlice";


function Index() {
    const history = useHistory()
    // const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const [register, setRegister] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function validateEmail(email) {
        const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(email) === false) {
            return false;
        } else {
            return true;
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        if (email === "" || password === "" || username === "") {
            setError("Required field is missing.");
            setLoading(false);
        } else if (!validateEmail(email)) {
            setError("Email is malformed");
            setLoading(false);
        } else {
            const bodyJSON = {
                username: username,
                first_name: firstname,
                last_name: lastname,
                email: email,
                password: password
            };
            axios
                .post("/api/users/signup", bodyJSON)
                .then((res) => {
                    console.log(res.data);
                    alert("Registered successfully");
                    setLoading(false);
                    history.push('/temp')
                    history.goBack()
                })
                .catch((err) => {
                    setLoading(false);  
                    setError(err.response.data.error)
                });
        };
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        setError("")
        setLoading(true)

        if(email === "" || password === ""){
            setError("Required field is missing")
            setLoading(false)
        } else {
            const bodyJSON = {
                email: email,
                password: password
            };
            axios
                .post("/api/users/login", bodyJSON)
                .then((res) => {
                    setLoading(false);

                    let data = res.data
                    console.log(data)

                    dispatch(
                        login({
                            id: data.id,
                            username: data.username,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email
                        })
                    );
                    sessionStorage.setItem("token", data.refresh_token);
                    //TODO:
                    sessionStorage.setItem("username", data.username);
                    sessionStorage.setItem("email", data.email);
                    

                    history.push('/questions')
                })
                .catch((err) => {
                    setLoading(false);  
                    setError(err.response.data.error)
                });
        }
    } 

    return (
        <div className="auth">
            <div className="auth-container">
                <div className="auth-login">
                    <div className="auth-login-container">
                        { register ? (
                            <>
                                <div className="input-field">
                                    <p> Username</p>
                                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text"/>
                                </div>
                                <div className="input-field">
                                    <p> First name</p>
                                    <input value={firstname} onChange={(e) => setFirstname(e.target.value)} type="text"/>
                                </div>
                                <div className="input-field">
                                    <p> Last name</p>
                                    <input value={lastname} onChange={(e) => setLastname(e.target.value)} type="text"/>
                                </div>
                                <div className="input-field">
                                    <p> Email</p>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"/>
                                </div>
                                <div className="input-field">
                                    <p> Password</p>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
                                </div>
                                <button onClick={handleRegister}
                                        disabled={loading}
                                        style={{
                                            marginTop: "10px",
                                        }}
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="input-field">
                                    <p> Email</p>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" data-testid="login-email"/>
                                </div>
                                <div className="input-field">
                                    <p> Password</p>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" data-testid="login-password"/>
                                </div>
                                <button onClick={handleSignIn} 
                                        disabled={loading}
                                        style={{
                                            marginTop: "10px"
                                        }}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </>
                        )}
                        <p onClick = {() => setRegister(!register)} style={{
                            marginTop: "10px",
                            textAlign: "center",
                            color: "#0095ff",
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}> {register ? "Login" : "Register"}?</p>
                    </div>
                </div>
                {error !== "" && (
                    <p
                        style={{
                        color: "red",
                        fontSize: "14px",
                        }}
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}


export default Index;
