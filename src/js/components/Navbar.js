import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import logo from './../../assets/images/Logo Icon White.png';
class Navbar extends React.Component {
  render() {
      const houseID = this.props.user.user.house;
      const houseName = this.props.houses.houses.filter((house) => {
          return house._id === houseID;
      }).length > 0 ? " - " + this.props.houses.houses.filter((house) => {
          return house._id === houseID;
      })[0].name: "";
    return (
      <nav className="main-topnav">
        <img
          src={logo}
          style={{ float: 'left', margin: 5, width: 36, height: 36 }}
          alt="RIDGE"
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
        <a style={{float: 'right'}}>{this.props.user.user.firstname + " " + this.props.user.user.surname + houseName}</a>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user, houses: state.houses };
}

export default connect(mapStateToProps)(Navbar);
