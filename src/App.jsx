import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes";
import { AuthProvider } from "./utils/AuthContext";
import { Analytics } from '@vercel/analytics/react';


import Room from "./pages/Room";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
	return (
		<Router>
			<AuthProvider>
			<Analytics />

				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					{/* All protected pages will be inside the PrivateRoutes parent component and all the unprotected routes will sit outside it */}
					<Route element={<PrivateRoutes />}>
						<Route path="/" element={<Room />} />
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
