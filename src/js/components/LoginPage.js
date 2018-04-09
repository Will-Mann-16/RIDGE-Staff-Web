import React from "react";
import {connect} from "react-redux";
import {authenticateUser} from "../actions/usersActions";

class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }
  submitLogin() {
    this.props.dispatch(authenticateUser(this.state.username,this.state.password));
  }
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({[name]: value});
  }
  render() {
    return (
      <div className="container">
        <h1 style={{textAlign: "center"}}>Welcome to RIDGE</h1>
        <h3>Login</h3>
        <input name="username" type="text" placeholder="Username" className="form-input" onChange={this.handleChange.bind(this)}></input>
        <input name="password" type="password" placeholder="Password" className="form-input" onChange={this.handleChange.bind(this)}></input>
        <button className="btn-green" onClick={this.submitLogin.bind(this)}>Login</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {user: state.user}
}

export default connect(mapStateToProps)(LoginPage);
