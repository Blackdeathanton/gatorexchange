import { textAlign } from '@mui/system'
import React, {useState} from 'react'
import "./index.css"

function Index() {
    const [register, setRegister] = useState(false)

    return (
        <div className="auth">
            <div className="auth-container">
                <div className="auth-login">
                    <div className="auth-login-container">
                        { register ? (
                            <>
                                <div className="input-field">
                                    <p> Username</p>
                                    <input type="text"/>
                                </div>
                                <div className="input-field">
                                    <p> Email</p>
                                    <input type="text"/>
                                </div>
                                <div className="input-field">
                                    <p> Password</p>
                                    <input type="text"/>
                                </div>
                                <button style={{
                                    marginTop: "10px"
                                }}>Register</button>
                            </>
                        ) : (
                            <>
                                <div className="input-field">
                                    <p> Email</p>
                                    <input type="text"/>
                                </div>
                                <div className="input-field">
                                    <p> Password</p>
                                    <input type="text"/>
                                </div>
                                <button style={{
                                    marginTop: "10px"
                                }}>Login</button>
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
            </div>
        </div>
    )
}


export default Index