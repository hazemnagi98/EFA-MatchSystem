import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import SignUp from './Auth/SignUp/SignUp';
import SignIn from './Auth/SignIn/SignIn';
import NavBar from './Shared/Navbar/Navbar';
import AdminDashboard from './Admin/AdminDashboard';
import { AuthProvider } from './Auth/Auth';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ backgroundColor: 'whitesmoke' }}>
          <NavBar />
          <Switch>
            <Route exact path='/signup'>
              <SignUp />
            </Route>
            <Route exact path='/signin'>
              <SignIn />
            </Route>
            <Route exact path='/admin'>
              <AdminDashboard />
            </Route>
            <Redirect to='/signup' />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
