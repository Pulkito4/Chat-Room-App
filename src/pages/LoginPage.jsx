import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
	const { user, handleUserLogin } = useAuth();
	const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, []);


    const handleInputChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
            /* dynamic handling of email and password fields */
        });
    };

	return (
		<div className="auth--container">
			<div className="form--wrapper">
				<form onSubmit={(e)=>{handleUserLogin(e,credentials)}}>
					<div className="field--wrapper">
						<label>Email:</label>
						<input
							type="email"
							required
							name="email"
							placeholder="Enter your email"
                            value={credentials.email}
                            onChange={handleInputChange}
						/>
					</div>

                    <div className="field--wrapper">
						<label>Password:</label>
						<input
							type="password"
							required
							name="password"
							placeholder="Enter your password"
                            value={credentials.password}
                            onChange={handleInputChange}
						/>
					</div>

                    <div className="field--wrapper">
                        <input type="submit" value="Login" className="btn btn--lg btn--main"/>
                    </div>
				</form>

                <p>Dont have an account? Register <Link to="/register">here</Link></p>
			</div>
		</div>
	);
};

export default LoginPage;
