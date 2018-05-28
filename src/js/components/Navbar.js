import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import logo from './../../assets/images/Logo Icon White.png';
class Navbar extends React.Component {
  render() {
    return (
      <nav className="main-topnav">
        <img
          src={logo}
          style={{ float: 'left', margin: 5, width: 36, height: 36 }}
        />
        <NavLink to="/">Home</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/locations">Locations</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/callover">Callover</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        {this.props.user.user.role <= 1 ? (
          <NavLink to="/houses">Houses</NavLink>
        ) : null}
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Navbar);
