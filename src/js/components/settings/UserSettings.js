import React from 'react';
import { connect } from 'react-redux';
import { createUser, updateUser, logoutUser } from '../../actions/usersActions';

class UserSettings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      password: '',
      cpassword: '',
      perror: false,
      submitted: false
    };
  }
  componentWillMount() {
    if (this.props.edit) {
      this.setState({ ...this.state, user: this.props.user.user });
    } else {
      this.setState({
        ...this.state,
        user: {
          role: this.props.user.user.role,
          house: this.props.user.user.house
        }
      });
    }
  }
  handleChange(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      ...this.state,
      user: { ...this.state.user, [name]: value }
    });
  }
  handleHouseChange(event) {
    const value = event.target.value;
    this.setState({
      ...this.state,
      user: { ...this.state.user, house: value }
    });
  }
  handleRoleChange(event) {
    const value = event.target.value;
    this.setState({ ...this.state, user: { ...this.state.user, role: value } });
  }
  handlePasswordChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    if (name === 'password') {
      this.setState({ ...this.state, password: value });
    } else {
      this.setState({ ...this.state, cpassword: value });
    }
  }
  disableRole(role) {
    if (role <= this.props.user.user.role) {
      return true;
    }
    return false;
  }
  logout() {
    this.props.dispatch(logoutUser());
  }
  updateUser() {
    if (this.state.password === '') {
      this.setState({ ...this.state, submitted: true });
    } else if (this.state.password === this.state.cpassword) {
      this.setState({
        ...this.state,
        user: { ...this.state.user, password: this.state.password },
        submitted: true
      });
    }
  }
  viewToken() {
    localStorage.setItem('VIEW_TOKEN', true);
  }
  componentDidUpdate() {
    if (this.state.submitted) {
      if (this.props.edit) {
        this.props.dispatch(
          updateUser(
            this.props.user.user._id,
            this.state.user,
            this.props.user.user.house
          )
        );
      } else {
        this.props.dispatch(
          createUser(this.state.user, this.props.user.user.house)
        );
      }
    }
  }
  render() {
    const roleList = ['SuperAdmin', 'Admin', 'HM', 'Tutor'];
    const roleHTML = roleList.map((role, key) => {
      return (
        <option
          key={key}
          value={key}
          disabled={this.disableRole(key + 1)}
          selected={this.state.user.role == key}
        >
          {role}
        </option>
      );
    });
    const houseHTML = this.props.houses.houses.map((house, key) => {
      return (
        <option
          key={key}
          value={house._id}
          selected={house._id === this.props.user.user.house}
        >
          {house.name}
        </option>
      );
    });
    return (
      <div>
        <input
          required
          className="form-input"
          name="firstname"
          placeholder="Firstname"
          onChange={this.handleChange.bind(this)}
          value={this.state.user.firstname}
        />
        <input
          required
          className="form-input"
          name="surname"
          placeholder="Surname"
          onChange={this.handleChange.bind(this)}
          value={this.state.user.surname}
        />
        <input
          required
          className="form-input"
          name="username"
          placeholder="Username"
          onChange={this.handleChange.bind(this)}
          value={this.state.user.username}
        />
        <input
          required
          className="form-input"
          type="password"
          style={{
            borderColor:
              this.state.password !== this.state.cpassword ? 'red' : 'black'
          }}
          name="password"
          placeholder="Password"
          onChange={this.handlePasswordChange.bind(this)}
        />
        <input
          required
          className="form-input"
          type="password"
          style={{
            borderColor:
              this.state.password !== this.state.cpassword ? 'red' : 'black'
          }}
          name="cpassword"
          placeholder="Confirm Password"
          onChange={this.handlePasswordChange.bind(this)}
        />
        <select
          required
          className="form-input"
          name="role"
          disabled={this.disableRole(1)}
          onLoadStart={this.handleHouseChange.bind(this)}
          onChange={this.handleRoleChange.bind(this)}
          value={this.state.user.role}
        >
          {roleHTML}
        </select>
        <select
          required
          className="form-input"
          name="house"
          onChange={this.handleHouseChange.bind(this)}
          disabled={this.disableRole(1)}
        >
          {houseHTML}
        </select>
        <button className="btn-green" onClick={this.updateUser.bind(this)}>
          Update
        </button>
        {this.props.edit ? (
          <div>
            <button className="btn-red" onClick={this.logout.bind(this)}>
              Logout
            </button>
            <button className="btn-blue" onClick={this.viewToken.bind(this)}>
              Make View User
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
    houses: state.houses
  };
}
export default connect(mapStateToProps)(UserSettings);
