import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl, FormGroup, FormSelect } from "react-bootstrap";

class LeaveRequestDialog extends Component {
  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  user = JSON.parse(sessionStorage.getItem("user")) || {};
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      month: new Date().toLocaleString('en-za', { month: 'long' })
    };
  }

  render() {
    const leaveTypes = [
      "Sick Leave",
      "Study Leave",
      "Annual Leave",
      "Special Leave",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <>
        <div className={this.user?.user?.role === "admin" ? "hide" : "d-flex"}>
          <button className={"btn btn-success"} onClick={this.handleShow}>
            New Leave Request
          </button>
        </div>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Leave Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row d-flex">
                <div className="form-group">
                  <Form.Label>Name</Form.Label>
                  <FormControl
                    name="name"
                    type="text"
                    id="_id"
                    defaultValue={this.user?.user?.name}
                    readOnly
                    onChange={this.props.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <Form.Label>Username</Form.Label>
                  <FormControl
                    name="username"
                    type="text"
                    id="username"
                    defaultValue={this.user?.user?.username}
                    readOnly
                    onChange={this.props.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <Form.Label>Leave Type:</Form.Label>
                  <FormGroup className="form-group">
                    {/* Dropdown containing a list of leave types */}
                    <FormSelect
                      name="leaveType"
                      onChange={this.props.handleInputChange}
                    >
                      {/* Map through leaveTypes array to create a list of options to select from */}
                      {leaveTypes &&
                        leaveTypes.map((leaveType) => (
                          <option key={leaveType} value={leaveType}>
                            {leaveType}
                          </option>
                        ))}
                    </FormSelect>
                  </FormGroup>
                </div>

                <div className="form-group">
                  <Form.Label>Month</Form.Label>
                  <FormGroup className="form-group">
                    {/* Dropdown containing a list of months of the year */}
                    <FormSelect
                      name="month"
                      defaultValue={this.state.month}
                      onChange={this.props.handleInputChange}
                    >
                      {/* Map through media array to create a list of options to select from */}
                      {months &&
                        months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                    </FormSelect>
                  </FormGroup>
                </div>
                <div className="form-group">
                  <Form.Label>No. of days</Form.Label>
                  <FormControl
                    name="numberOfDays"
                    type="number"
                    id="numberOfDays"
                    onChange={this.props.handleInputChange}
                  />
                </div>
              </div>

              <Button
                onClick={this.props.handleSubmit}
                className="btn primary-btn mt-3"
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default LeaveRequestDialog;
