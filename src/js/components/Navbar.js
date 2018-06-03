import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import logo from './../../assets/images/Logo Icon White.png';
const getRGB = function(b){
    var a;
    if(b&&b.constructor==Array&&b.length==3)return b;
    if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))return[parseInt(a[1]),parseInt(a[2]),parseInt(a[3])];
    if(a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b))return[parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];
    if(a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b))return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],
16)];
    if(a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b))return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];
    return null;
};

const calculateLuminance = function(color) {
    var rgb = getRGB(color);
    if (!rgb) return null;
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

class Navbar extends React.Component {
  render() {
      var headerColour = "#23265C";
      var textColour = "#FFFFFF";
      const houseID = this.props.user.user.house;
      const houseName = this.props.houses.houses.filter((house) => {
          return house._id === houseID;
      }).length > 0 ? " - " + this.props.houses.houses.filter((house) => {
          return house._id === houseID;
      })[0].name: "";
      const colours = this.props.houses.houses.filter((house) => {
          return house._id === houseID;
      }).length > 0 ? this.props.houses.houses.filter((house) => {
          return house._id === houseID;
      })[0].colours: [];
      colours.sort((a, b) => {
        return calculateLuminance(a) - calculateLuminance(b);
      });
      if(colours.length > 1){
          headerColour = colours[0];
      }
      if(calculateLuminance(headerColour) > 180){
        textColour = "#000000";
      }
    return (
      <nav className="main-topnav" style={{backgroundColor: headerColour, color: textColour}}>
        <img
          src={logo}
          style={{ float: 'left', margin: 5, width: 36, height: 36 }}
          alt=""
        />
        <NavLink exact to="/">Home</NavLink>
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
