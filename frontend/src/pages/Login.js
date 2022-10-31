import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Google from "../images/google.png";
import Github from "../images/github.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      user: undefined,
      isNormalLogin: false,
    };
  }

  user = {};

  google = () => {
    window.open("http://localhost:5000/api/google", "_self");
  };

  github = () => {
    window.open("http://localhost:5000/api/github", "_self");
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (
      Object.values(this.state)?.includes(null) ||
      Object.values(this.state)?.includes("")
    ) {
      alert("Please enter all credentials!");
      return false;
    } else {
      this.setState({ isNormalLogin: true });
      fetch(
        `http://localhost:5000/api/login?username=${this.state.username}&password=${this.state.password}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.status === 200) return response.json();
          else {
            alert(response.statusText);
            throw new Error("Authentication has failed!");
          }
        })
        .then((user) => {
          this.setState({ user });
          sessionStorage.setItem("user", JSON.stringify(user));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    let { username, password, user } = this.state;
    return (
      <div className="login">
        <h1 className="loginTitle">Choose a Login Method</h1>
        <div className="wrapper">
          <div className="left">
            <div className="loginButton google" onClick={this.google}>
              <img src={Google} alt="" className="icon" />
              Google
            </div>
            <div className="loginButton github" onClick={this.github}>
              <img src={Github} alt="" className="icon" />
              Github
            </div>
          </div>
          <div className="center">
            <div className="line" />
            <div className="or">OR</div>
          </div>
          <div className="right">
            <Form>
              <input
                onChange={this.handleInputChange}
                type="text"
                placeholder="Username"
                name="username"
              />
              <input
                onChange={this.handleInputChange}
                type="text"
                placeholder="Password"
                name="password"
              />
              <button className="submit" onClick={this.handleSubmit}>
                Login
              </button>
            </Form>
            {user && <Navigate to="/" replace={true} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
