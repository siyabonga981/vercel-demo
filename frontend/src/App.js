import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const App = () => {
  let currentUser;
  const user = useRef(null);
  const saveUser = (user) => {
    console.log(user, 'xxxx')
    sessionStorage.setItem("user", JSON.stringify(user));
  };
  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/api/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("Authentication has failed!");
        })
        .then((resObject) => {
          let userToSave = {
            user: {
              name: resObject.user.displayName,
              username: resObject.user.id,
            },
          };
          saveUser(userToSave);
          user.current = userToSave;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Navbar user={user?.current} />
        <Routes>
          <Route
            path="/"
            element={
              <Home user={user?.current} />
            }
          />
          <Route
            path="/login"
            element={
              user?.current ?<Navigate to="/" /> : <Login />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
