import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { createStudent, updateStudent } from '../actions/studentsActions';

class StudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {},
      submitted: false,
      error: { input: '', message: '' }
    };
  }
  componentWillMount() {
    if (this.props.edit) {
      this.props.students.students.map((student, key) => {
        if (this.props.studentID.toLowerCase() === student.code.toLowerCase()) {
          this.setState({ ...this.state, student: student });
        }
      });
    } else {
      var defaultLocation = null;
      this.props.locations.locations.forEach(location => {
        if (location._id === this.props.user.config.DEFAULT_LOCATION) {
          defaultLocation = location;
        }
      });
      if (defaultLocation !== null) {
        this.setState({
          ...this.state,
          student: {
            _house: this.props.user.user.house,
            timelastout: new Date(),
            yeargroup: 0,
            location: {
              id: defaultLocation._id,
              name: defaultLocation.name,
              colour: defaultLocation.colour
            }
          }
        });
      } else {
        this.setState({
          ...this.state,
          student: {
            _house: this.props.user.user.house,
            timelastout: new Date(),
            yeargroup: 0,
            location: { id: null, name: 'Undefined', colour: '#ffffff' }
          }
        });
      }
    }
  }
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      ...this.state,
      student: { ...this.state.student, [name]: value }
    });
  }
  handleLocationChange(event) {
    const value = event.target.value;
    var location;
    this.props.locations.locations.map(nlocation => {
      if (nlocation._id === value) {
        location = nlocation;
      }
    });
    this.setState({
      ...this.state,
      student: {
        ...this.state.student,
        location: {
          name: location.name,
          id: location._id,
          colour: location.colour
        }
      }
    });
  }
  handleHouseChange(event) {
    const value = event.target.value;
    this.setState({ ...this.state, student: { _house: value } });
  }

  submitData() {
    var unique = true;
    this.props.students.students.map(student => {
      if (
        student.code.toLowerCase() === this.state.student.code.toLowerCase()
      ) {
        unique = false;
      }
    });
    if (
      unique ||
      this.state.student.code.toLowerCase() ===
        this.props.studentID.toLowerCase()
    ) {
      if (this.props.edit) {
        this.props.dispatch(
          updateStudent(
            this.state.student._id,
            this.state.student,
            this.props.user.user.house
          )
        );
      } else {
        this.props.dispatch(
          createStudent(this.state.student, this.props.user.user.house)
        );
      }
      this.setState({ ...this.state, submitted: true });
    } else {
      this.setState({
        ...this.state,
        error: { input: 'code', message: 'Code Already Taken' }
      });
    }
  }
  disableRole(role) {
    if (role <= this.props.user.user.role) {
      return true;
    }
    return false;
  }
  render() {
    if (this.state && this.state.submitted) {
      return <Redirect exact to="/students" />;
    }
    var date = new Date(this.state.student.timelastout);
    var locationHTML = this.props.locations.locations.map((location, key) => {
      return (
        <option
          key={key}
          value={location._id}
          selected={location._id === this.state.student.location.id}
          style={{ backgroundColor: location.colour }}
        >
          {location.name}
        </option>
      );
    });
    var houseHTML = this.props.houses.houses.map((house, key) => {
      return (
        <option
          key={key}
          value={house._id}
          selected={house._id === this.state.student._house}
        >
          {house.name}
        </option>
      );
    });
    return (
      <div className="container row">
        <h3>Edit Student</h3>
        <div className="col-6">
          <div className="student-card-large">
            <div
              className="student-card-body-large"
              style={{
                borderColor: this.state.student.location
                  ? this.state.student.location.colour
                  : 'white'
              }}
            >
              <p className="student-card-body-date">
                {date.toLocaleTimeString()}
                <br />
                {date.toLocaleDateString()}
              </p>
              <p className="student-card-body-name">
                {this.state.student.firstname} {this.state.student.surname}
              </p>
              <div className="student-card-body-bottom">
                <p>
                  {
                    this.props.user.config.YEARGROUP_NAMES[
                      this.state.student.yeargroup
                    ]
                  }
                </p>
                <br />
                <p className="student-card-body-bottom">
                  {this.state.student.location
                    ? this.state.student.location.name
                    : null}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <input
            required
            className="form-input"
            onChange={this.handleChange.bind(this)}
            name="firstname"
            style={{
              borderColor:
                this.state.error.input !== 'firstname' ? 'black' : 'red'
            }}
            value={this.state.student.firstname}
            placeholder="Firstname"
            disabled={this.disableRole(2)}
          />
          <input
            required
            className="form-input"
            onChange={this.handleChange.bind(this)}
            name="surname"
            style={{
              borderColor:
                this.state.error.input !== 'surname' ? 'black' : 'red'
            }}
            value={this.state.student.surname}
            placeholder="Surname"
            disabled={this.disableRole(2)}
          />
          <input
            required
            className="form-input"
            onChange={this.handleChange.bind(this)}
            name="code"
            style={{
              borderColor: this.state.error.input !== 'code' ? 'black' : 'red'
            }}
            value={this.state.student.code}
            placeholder="Code"
            disabled={this.disableRole(2)}
          />
          <input
            required
            className="form-input"
            onChange={this.handleChange.bind(this)}
            type="password"
            name="password"
            style={{
              borderColor: this.state.error.input !== 'code' ? 'black' : 'red'
            }}
            placeholder="Password"
            disabled={this.disableRole(2)}
          />
          <select
            required
            className="form-input"
            name="yeargroup"
            onChange={this.handleChange.bind(this)}
            style={{
              borderColor:
                this.state.error.input !== 'yeargroup' ? 'black' : 'red'
            }}
            disabled={this.disableRole(2)}
          >
            {this.props.user.config.YEARGROUP_NAMES.map((yeargroup, key) => (
              <option
                key={key}
                value={key}
                selected={
                  yeargroup ===
                  this.props.user.config.YEARGROUP_NAMES[
                    this.state.student.yeargroup
                  ]
                }
              >
                {yeargroup}
              </option>
            ))}
          </select>
          <select
            required
            className="form-input"
            name="location"
            style={{
              backgroundColor: this.state.student.location
                ? this.state.student.location.colour
                : null,
              borderColor:
                this.state.error.input !== 'location' ? 'black' : 'red'
            }}
            onChange={this.handleLocationChange.bind(this)}
          >
            {locationHTML}
          </select>
          <select
            required
            className="form-input"
            name="house"
            style={{
              borderColor: this.state.error.input !== 'house' ? 'black' : 'red'
            }}
            onChange={this.handleHouseChange.bind(this)}
            disabled={this.disableRole(1)}
          >
            {houseHTML}
          </select>
          <button className="btn-green" onClick={this.submitData.bind(this)}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    students: state.students,
    locations: state.locations,
    user: state.user,
    houses: state.houses
  };
}

export default connect(mapStateToProps)(StudentPage);
