import "./App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [text, setText] = useState("");
	// const [test, setTest] = useState(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [confirm, setConfirm] = useState("");

	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const [token, setToken] = useState(localStorage.getItem("myToken"));

	const [content, setContent] = useState("");
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	useEffect(() => {
		axios.get("/").then((response) => setText(response.data));
		// axios.get
	}, []);

	useEffect(() => {
		console.log(token);
		axios
			.get("/profile")
			.then((response) => {
				console.log("profile");
				console.log(response);
				setText(response.data);
			})
			.catch((err) => console.log(err));
	}, [token]);

	const handleName = (e) => {
		setName(e.target.value);
	};

	const handleEmail = (e) => {
		setEmail(e.target.value);
	};

	const handlePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleConfirm = (e) => {
		setConfirm(e.target.value);
	};

	const handleSignUp = (e) => {
		e.preventDefault();
		axios
			.post("/sign-up", {
				name: name,
				username: email,
				password: password,
				confirm: confirm,
			})
			.then((response) => console.log(response))
			.catch((err) => console.log(err));
	};

	const handleLoginEmail = (e) => {
		setLoginEmail(e.target.value);
	};

	const handleLoginPassword = (e) => {
		setLoginPassword(e.target.value);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		axios
			.post("/login", {
				username: loginEmail,
				password: loginPassword,
			})
			.then((response) => {
				console.log(response);
				localStorage.setItem("myToken", response.data.token);
				setToken(response.data.token);
			})
			.catch((err) => console.log(err));
	};

	const handleEditorChange = (newContent, editor) => {
		console.log("Content was updated:", newContent);
		setContent(newContent);
	};

	return (
		<div className="App">
			<p>Yo</p>
			<p>{text}</p>
			<form onSubmit={handleSignUp}>
				<label>
					Name
					<input name="name" required onChange={handleName} />
				</label>
				<label>
					Email
					<input
						name="email"
						required
						type="email"
						onChange={handleEmail}
						autoComplete="username"
					/>
				</label>

				<label>
					Password
					<input
						type="password"
						name="password"
						autoComplete="new-password"
						required
						minLength="8"
						onChange={handlePassword}
					/>
				</label>

				<label>
					Confirm Password
					<input
						type="password"
						name="confirm"
						required
						minLength="8"
						onChange={handleConfirm}
						autoComplete="new-password"
					/>
				</label>

				<input type="submit" value="sign-up" />
			</form>
			<br />
			<form onSubmit={handleLogin}>
				<label>
					Email
					<input
						name="email"
						required
						type="email"
						onChange={handleLoginEmail}
						autoComplete="username"
					/>
				</label>

				<label>
					Password
					<input
						type="password"
						name="password"
						required
						minLength="8"
						onChange={handleLoginPassword}
						autoComplete="current-password"
					/>
				</label>
				<input type="submit" value="Log in" />
			</form>

			<Editor
				apiKey="bq2z3nnsyx6agpruod00p08tfiqb8jcv23htolhuud8bnu0z"
				value={content}
				init={{
					height: 500,
					menubar: false,
					plugins: [
						"advlist autolink lists link image charmap print preview anchor",
						"searchreplace visualblocks code fullscreen",
						"insertdatetime media table paste code help wordcount",
					],
					toolbar:
						"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
				}}
				onEditorChange={handleEditorChange}
			/>
		</div>
	);
};

export default App;
