import React, { useContext } from "react";

//import { Chat, Notifications, Person, Search } from "@material-ui/icons"

import Logout from "../Logout";

import { NavLink } from "react-router-dom";
import { UidContext } from "../Appcontext";
import { useSelector } from "react-redux";

import Search from "../Search/Search";
function NavigationBar() {
  const uid = useContext(UidContext);
  const userData = useSelector((state) => state.userReducer);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg sticky-top  navbar-light bg-light"
        style={{ marginBottom: "20px" }}
      >
        <div className="container-fluid">
          <NavLink
            className="navbar-brand"
            exact
            to="/home/allposts"
            style={{ textDecoration: "none" }}
          >
            Soundbond
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  exact
                  to="/map"
                  style={{ textDecoration: "none" }}
                >
                  Map
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  exact
                  to={`/profil/${userData.username}/posts`}
                  style={{ textDecoration: "none" }}
                >
                  Profil
                </NavLink>
              </li>
            </ul>
            <Search />
            <form className="d-flex">
              {uid ? (
                <>
                  <span style={{ margin: "4px" }}>
                    Bonjour {userData.username}
                  </span>

                  <Logout />
                </>
              ) : (
                <>
                  {" "}
                  <NavLink
                    className="nav-link"
                    exact
                    to="/login"
                    style={{ textDecoration: "none" }}
                  >
                    Se connecter
                  </NavLink>
                  <NavLink
                    className="nav-link"
                    exact
                    to="/register"
                    style={{ textDecoration: "none" }}
                  >
                    S'inscrire
                  </NavLink>
                </>
              )}
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}
export default NavigationBar;
