import { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  getUser() {
    console.log(sessionStorage.getItem("user"));
    if (sessionStorage.getItem("user")) {
      console.log("state set", JSON.parse(sessionStorage.getItem("user")));
      this.setState({ user: JSON.parse(sessionStorage.getItem("user")) }, () =>
        console.log(this.state)
      );
    }
  }

  componentDidMount() {
    setTimeout(() => this.getUser(), 1500);
    console.log('hi')
  }

  // componentDidMount() {
  //   console.log("did mount");
  //   this.getUser();
  //   console.log(this.state);

  // }

  logout = () => {
    sessionStorage.clear();
    this.setState({ user: null });
    window.open("http://localhost:5000/api/logout", "_self");
  };
  render() {
    return (
      <div className="navbar">
        <span className="logo mb-3">
          <Link className="link" to="/">
            Leave Management System
          </Link>
        </span>
        {this.state.user ? (
          <ul className="list">
            <li className="listItem" onClick={this.logout}>
              Logout
            </li>
          </ul>
        ) : (
          <Link className="link" to="login">
            Login
          </Link>
        )}
      </div>
    );
  }
}

export default Navbar;
