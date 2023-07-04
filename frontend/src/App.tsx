import { useState, useEffect } from 'react';
import SignUpModal from './components/SignUpModal';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import { User } from './models/users';
import * as NotesAPI from './network/notes_api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from "./styles/App.module.css";

function App() {

	const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginUpModal, setShowLoginUpModal] = useState(false);

	useEffect(()=>{
		async function fetchLoggedInUser(){
			try {
				const user = await NotesAPI.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.error(error)
				alert(error)
			}
		}
		fetchLoggedInUser();
	})

  return (
	<BrowserRouter>
		<div>
			<NavBar 
				loggedInUser={loggedInUser}
				onLoginClicked={()=>{setShowLoginUpModal(true)}}
				onSignUpClicked={()=>{setShowSignUpModal(true)}}
				onLogoutSuccessful={()=>{setLoggedInUser(null)}}
			/>

			<Container className={styles.pageContainer}>
				<Routes>
					<Route path='/' element={<NotesPage loggedInUser={loggedInUser} /> } />
					<Route path='/privacy' element={<PrivacyPage  />} />
					<Route path='/*' element={<NotFoundPage/>} />
				</Routes>
			</Container>

			{
				showSignUpModal && 
				<SignUpModal 
					onDismiss={()=>{setShowSignUpModal(false)}}
					onSignUpSuccessful={(user)=>{
						setLoggedInUser(user);
						setShowSignUpModal(false)
					}}
				/>
			}

			{
				showLoginUpModal &&
				<LoginModal
				onDimiss={()=>{setShowLoginUpModal(false)}}
				onLoginSuccessful={(user)=>{
					setLoggedInUser(user);
					setShowLoginUpModal(false)
				}}
				/>
			}

		</div>
	</BrowserRouter>
  );
}

export default App;
