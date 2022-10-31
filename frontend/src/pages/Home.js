// import { useState } from "react";
import { Component } from "react";
import LeaveRequestDialog from "./LeaveRequestDialog";
import PastLeaveRequests from "./PastLeaveRequests";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      leaveType: "Sick Leave",
      month: new Date().toLocaleString("en-za", { month: "long" }),
      numberOfDays: null,
      status: null,
      show: false,
    };
  }
  currentUser = {};

  async getUser() {
    return await JSON.parse(sessionStorage.getItem("user"));
  }
  componentDidMount() {
    this.currentUser = this.getUser()
      .then((res) => res)
      .then((user) => {
        this.setState(
          {
            name: user?.user?.name,
            username: user?.user?.username,
          },
          () => {
            console.log(this.state, "xxxxxxx");
          }
        );
      });
  }
  handleSubmit = (event) => {
    event.preventDefault();

    console.log(this.state);
    return;
    let body = this.state;
    body.status = "Pending";
    delete body.show;
    fetch("http://localhost:5000/api/addLeaveRequest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        this.handleClose();
        if (response.status === 200) return response.json();
        else {
          alert(response.statusText);
          throw new Error("Authentication has failed!");
        }
      })
      .then((result) => {
        alert(result.msg);
        this.handleClose();
        window.location.reload();
      })
      .catch((err) => {
        this.handleClose();
        console.log(err);
      });
  };

  handleInputChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        console.log(this.state);
      }
    );
  };
  render() {
    return (
      <div className="home">
        <div className="d-flex justify-content-between align-items-center">
          <h3>Hi, {this?.state?.name}</h3>
          <div
            className={
              this.props?.user?.user?.role === "admin" ? "d-none" : "d-block"
            }
          >
            <LeaveRequestDialog
              handleSubmit={this.componentDidMounthandleSubmit}
              handleInputChange={this.handleInputChange}
            />
          </div>
        </div>
        <div>
          <PastLeaveRequests />
        </div>
      </div>
    );
  }
}

export default Home;
