import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import SignUp from './Auth/SignUp/SignUp';
import SignIn from './Auth/SignIn/SignIn';
import NavBar from './Shared/Navbar/Navbar';
import AdminDashboard from './Admin/AdminDashboard';
import Manager from './Manager/Manager';
import ViewMatches from './Manager/Match/ViewMatches/ViewMatches';
import MatchCard from './Manager/Match/MatchCard/MatchCard';
import { AuthProvider } from './Auth/Auth';
import Guest from './Guest/Guest';
import FanViewMatches from './Fan/FanViewMatches/FanViewMatches';
import EditDetails from './Fan/EditDetails/EditDetails';
import ChangePassword from './Fan/ChangePassword/ChangePassword';
import VerifiedManagerRoute from './Auth/ManagerRoutes/VerifiedManagerRoute';
import PendingManagerRoute from './Auth/ManagerRoutes/PendingManagerRoute';
import Pending from './Manager/Pending/Pending';
import Reservations from './Fan/Reservations/Reservations';
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
            <VerifiedManagerRoute exact path='/manager'>
              <Manager />
            </VerifiedManagerRoute>
            <VerifiedManagerRoute exact path='/manager/matches'>
              <ViewMatches />
            </VerifiedManagerRoute>
            <VerifiedManagerRoute path='/manager/matches/:id'>
              <MatchCard />
            </VerifiedManagerRoute>
            <Route exact path='/home'>
              <Guest />
            </Route>
            <Route exact path='/me/matches'>
              <FanViewMatches />
            </Route>
            <Route exact path='/me/profile'>
              <EditDetails />
            </Route>
            <PendingManagerRoute exact path='/pending'>
              <Pending />
            </PendingManagerRoute>
            <Route exact path='/me/changepassword'>
              <ChangePassword />
            </Route>
            <Route exact path='/me/reservations'>
              <Reservations />
            </Route>
            <Redirect to='/signin' />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
