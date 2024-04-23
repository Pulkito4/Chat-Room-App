import { useContext } from "react";
import { createContext, useState, useEffect } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const [user, setUser] = useState(null);

	useEffect(() => {
		// Check if user is authenticated when the component mounts
		const cookieFallback = localStorage.getItem('cookieFallback');
		if (cookieFallback) {
		  const sessionData = JSON.parse(cookieFallback);
		  if (sessionData && sessionData.a_session_662254954734fb37416e) {
			// If session exists, consider the user as authenticated
			setUser({}); // You can replace this with actual user data if available
		  }
		}
		setLoading(false);
		getUserOnLoad();
	}, []);

	const getUserOnLoad = async () => {
		try {
			const accountDetails = await account.get();
			setUser(accountDetails);
		} catch (error) {
			console.info(error);
			// do not worry about the above error/warning
			// when we log out this function is stil running so it will console log an error
		}
		setLoading(false);
	};

	const handleUserLogin = async (e, credentials) => {
		e.preventDefault();

		try {
			let response = await account.createEmailPasswordSession(
				credentials.email,
				credentials.password
			);
			const accountDetails = await account.get();
			setUser(accountDetails);
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	const handleUserLogout = async () => {
		try {
			await account.deleteSession("current");
			setUser(null);
			navigate("/login");
		} catch (error) {
			console.error(error);
		}
	};

	const handleUserRegister = async (e, credentials) => {
		e.preventDefault();

		if (credentials.password1 !== credentials.password2) {
			alert("Passwords do not match!");
			return;
		}

		try {
			let response = await account.create(
				ID.unique(),
				credentials.email,
				credentials.password1,
                credentials.name
			);

            console.log("REGISTERED: ", response);
            await account.createEmailPasswordSession(credentials.email, credentials.password1)
            const accountDetails = await account.get();
            console.log("Account Details: ", accountDetails);
			setUser(accountDetails);
            navigate("/");

		} catch (error) {
			console.error(error);
		}
	};

	const contextData = {
		user,
		handleUserLogin,
		handleUserLogout,
		handleUserRegister,
	};

	return (
		<AuthContext.Provider value={contextData}>
			{loading ? <p>Loading...</p> : children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthContext;
