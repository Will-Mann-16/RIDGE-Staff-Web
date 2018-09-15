import React from 'react';
import { connect } from 'react-redux';
import {gray} from '../styles/colours';
import styled from 'styled-components';

const StudentCardWrapper = styled.div`
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    margin: 0.25rem;
    &:hover{
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    border: 5px solid ${gray}
`;

class StudentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected
    };
  }

  select() {
    this.props.addSelected(this.props.student._id);
  }

  render() {
    const selectedColour = '#99B3FF';
    //const selectedColour = "#ECB3FF"
    const locationStyle = {
      borderColor: this.props.student.location.colour,
      backgroundColor: this.props.selected ? selectedColour : 'white'
    };
    var date = new Date(this.props.student.timelastout);
    return (
      <StudentCardWrapper onClick={this.select.bind(this)} style={locationStyle}>
            {!this.props.view ? (
            <p className="ms-font-s">
              {date.toLocaleTimeString()}
              <br />
              {date.toLocaleDateString()}
            </p>
          ) : null}
          <p className="ms-font-xl">
            {this.props.student.firstname} {this.props.student.surname}
          </p>
          <div>
            <p className="ms-font-m">
              {
                this.props.user.config.YEARGROUP_NAMES[
                  this.props.student.yeargroup
                ]
              }
            </p>
            <p className="ms-font-m">
              {this.props.student.location.name}
            </p>
          </div>
      </StudentCardWrapper>
    );
    // style={this.state.selected ? selectedStyle : null}
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(StudentCard);
