import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import SignUp from './Auth/SignUp/SignUp';
import SignIn from './Auth/SignIn/SignIn';
import NavBar from './Shared/Navbar/Navbar';
import AdminDashboard from './Admin/AdminDashboard';
import Manager from './Manager/Manager';
import ViewMatches from './Manager/Match/ViewMatches/ViewMatches';
import MatchCard from './Manager/Match/MatchCard/MatchCard';
import { AuthProvider } from './Auth/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="App" style={{ backgroundColor: 'whitesmoke' }}>
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
            <Route exact path='/manager'>
              <Manager />
            </Route>
            <Route exact path='/manager/matches'>
              <ViewMatches />
            </Route>
            <Route path='/manager/matches/:id'>
              <MatchCard />
            </Route>
            <Redirect to='/signin' />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
