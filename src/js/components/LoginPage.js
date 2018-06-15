import React from "react";
import { connect } from "react-redux";
import { authenticateUser } from "../actions/usersActions";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  submitLogin() {
    this.props.dispatch(
      authenticateUser(this.state.username, this.state.password)
    );
  }
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({ [name]: value });
  }
  render() {
    var loginButton = (
      <button className="btn-african-sapphire" onClick={this.submitLogin.bind(this)}>
        Login
      </button>
    );
    if(this.props.user.login.fetching){
      var loginButton = (
        <button className="btn-blue">
          <i className="fas fa-sync fa-spin"></i> Loading
        </button>
      );
    }
    else if(this.props.user.login.fetched){
      if(this.props.user.login.authenticated){
        <button className="btn-green">
          <i className="fas fa-check"></i> Success
        </button>
      }
      else{
        <button className="btn-red" onClick={this.submitLogin.bind(this)}>
          <i className="fas fa-times"></i> Incorrect Login
        </button>
      }
    }
    return (
      <div className="container">
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <h3>Login</h3>
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="form-input"
          onChange={this.handleChange.bind(this)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="form-input"
          onChange={this.handleChange.bind(this)}
        />
        {loginButton}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(LoginPage);
