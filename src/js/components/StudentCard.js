import React from 'react';
import {connect} from 'react-redux'

class StudentCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selected: this.props.selected
    };
  }

  select(){
    this.props.addSelected(this.props.student._id);
  }

  render(){
    const selectedColour = "#99B3FF";
    //const selectedColour = "#ECB3FF"
    const locationStyle = {
      borderColor: this.props.student.location.colour,
      backgroundColor: this.props.selected ? selectedColour : "white"
    }
    var date = new Date(this.props.student.timelastout);
    return(
      <div className="student-card" onClick={this.select.bind(this)}>
        <div className="student-card-body" style={locationStyle}>
          {!this.props.view ? <p className="student-card-body-date">{date.toLocaleTimeString()}<br/>{date.toLocaleDateString()}</p> : null}
          <p className="student-card-body-name">{this.props.student.firstname} {this.props.student.surname}</p>
          <div className="student-card-body-bottom"><p>{this.props.user.config.YEARGROUP_NAMES[this.props.student.yeargroup]}</p><br/>
          <p className="student-card-body-bottom">{this.props.student.location.name}</p></div>
        </div>
      </div>
    );
    // style={this.state.selected ? selectedStyle : null}
  }
}
function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(StudentCard)