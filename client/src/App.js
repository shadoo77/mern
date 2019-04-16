import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import NavBar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";

import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Dashboard from "./components/dashboard/dashboard";
import PrivateRoute from "./components/common/PrivateRoute";
import CreatProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import NotFound from "./components/not-found/NotFound";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

import store from "./store/store";

import "./App.css";
import { setCurrentUser, logoutUser } from "./store/actions/authActions";
import { clearCurrentProfile } from "./store/actions/profileActions";

if (localStorage.jwtToken) {
  // Get token from localstorage is same like localstorage.getItem('jwtToken')
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user when he/she isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Logout user automaticlly after an expire time
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    // Clear current profile
    store.dispatch(clearCurrentProfile());
    // Redirect login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <div className="container">
            <Switch>
              <Route path="/" exact component={Landing} />

              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:handle" component={Profile} />

              <PrivateRoute path="/dashboard" exact component={Dashboard} />

              <PrivateRoute
                path="/create-profile"
                exact
                component={CreatProfile}
              />
              <PrivateRoute
                path="/edit-profile"
                exact
                component={EditProfile}
              />
              <PrivateRoute
                path="/add-experience"
                exact
                component={AddExperience}
              />
              <PrivateRoute
                path="/add-education"
                exact
                component={AddEducation}
              />
              <PrivateRoute path="/feed" exact component={Posts} />
              <PrivateRoute exact path="/post/:id" component={Post} />
              <Route path="/not-found" component={NotFound} />
              <Route exact component={NotFound} />

              <Footer />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
