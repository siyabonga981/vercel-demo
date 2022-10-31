import Table from "react-bootstrap/Table";
import React, { Component } from "react";
import trash from "../images/trash.png";
class PastLeaveRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastRequests: [],
      user: null
    };
  }
  currentUser = {};

  getUser() {
    console.log("PLR");
    this.currentUser = JSON.parse(sessionStorage.getItem("user"));
    console.log(this.currentUser);
    this.setState({ user: this.currentUser }, () => {
        this.fetchPastLeaveRequests()});
  }

  fetchPastLeaveRequests = () => {
    const query = (
      this.state.user?.user?.role
        ? this.state.user?.user?.role?.includes("admin")
        : ""
    )
      ? ""
      : `?username=${this.state.user?.user?.username}`;
    fetch(`http://localhost:5000/api/getLeaveRequests${query}`, {
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
        throw new Error("Fetching requests has failed!");
      })
      .then((result) => {
        this.setState({
          pastRequests: result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getUser();
  }
  handleChangeStatus = (id, status) => {
    fetch(`http://localhost:5000/api/changeStatus/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          alert("Updating status has failed!");
          throw new Error("Updating status has failed!");
        }
      })
      .then((result) => {
        this.fetchPastLeaveRequests();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleRequestDelete = (id) => {
    const confirmDelete = window.confirm("Delete this record?");
    if (confirmDelete) {
      fetch(`http://localhost:5000/api/deleteLeaveRequest/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          else {
            alert("Delete has failed!");
            throw new Error("Delete has failed!");
          }
        })
        .then((result) => {
          this.fetchPastLeaveRequests();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    return !this.state.pastRequests?.length ? (
      <h1 className="red-text">No Leave Requests Found</h1>
    ) : (
      <Table striped bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Leave Type</th>
            <th>Month</th>
            <th>No. Of Days</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.state.pastRequests &&
            this.state.pastRequests.map((pastRequest) => (
              <tr key={pastRequest._id} value={pastRequest}>
                <td>{pastRequest.name}</td>
                <td>{pastRequest.username}</td>
                <td>{pastRequest.leaveType}</td>
                <td>{pastRequest.month}</td>
                <td>{pastRequest.numberOfDays}</td>
                <td>{pastRequest.status}</td>
                <td className="d-flex">
                  <div
                    className={
                      this.state.user?.user?.role?.includes("admin")
                        ? "d-flex"
                        : "d-none"
                    }
                  >
                    <button
                      onClick={() =>
                        this.handleChangeStatus(pastRequest._id, "Approved")
                      }
                      disabled={pastRequest?.status !== "Pending"}
                      className="btn btn-success mx-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        this.handleChangeStatus(pastRequest._id, "Rejected")
                      }
                      disabled={pastRequest?.status !== "Pending"}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                  <span className="d-flex">
                    <img
                      onClick={() => this.handleRequestDelete(pastRequest._id)}
                      width="60%"
                      src={trash}
                      className={
                        pastRequest.username === this.state.user?.user?.username
                          ? "d-flex cursor"
                          : "d-none"
                      }
                    />{" "}
                  </span>{" "}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  }
}

export default PastLeaveRequests;
