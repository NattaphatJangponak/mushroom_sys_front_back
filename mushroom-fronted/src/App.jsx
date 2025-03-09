import React  from 'react';
import { useLocation } from 'react-router-dom';
import AppRouter from '../src/routes/AppRouter';
import Navbar from './components/Navbar';
// import AuthContext from  './context/AuthContext';
function App() {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login', '/register'];
  // const { user } = useContext(AuthContext);
  return (
    <div>
      
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />} 
      {/* user={user} */}
      <AppRouter />
    </div>
  );
}

export default App;
