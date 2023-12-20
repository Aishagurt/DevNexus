import './App.css';
import Appbar from './components/Appbar.tsx';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ProfilePage from './components/ProfilePage.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/logOut' element={<LoginForm />} />
          <Route path="/" element={<Appbar />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signUp' element={<SignUpForm />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}
