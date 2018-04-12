import React from 'react';
import { connect } from 'react-redux';
import { Toggle } from 'react-powerplug';
import { house } from '../socket';
import {
  selectStudent,
  deselectStudent,
  updateStudentLocation
} from '../actions/studentsActions';

import StudentCard from './StudentCard';
import LocationButton from './LocationButton';

class ViewGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDropped: false
    };
  }
  addSelected(id) {
    var selectedIDs = this.props.students.selected;
    var index = selectedIDs.indexOf(id);
    if (index != -1) {
      this.props.dispatch(deselectStudent(id));
    } else {
      this.props.dispatch(selectStudent(id));
    }
  }
  selectYear(id) {
    this.props.students.students.forEach(student => {
      if (student.yeargroup == id) {
        this.addSelected(student._id);
      }
    });
  }
  deselectAll() {
    var selectedIDs = this.props.students.selected;
    selectedIDs.forEach(id => {
      this.addSelected(id);
    });
  }
  toggleDropped() {
    this.setState({
      ...this.state,
      selectedDropped: !this.state.selectedDropped
    });
  }
  updateLocation(buttonID) {
    var selectedIDs = this.props.students.selected;
    this.props.dispatch(
      updateStudentLocation(
        selectedIDs,
        buttonID,
        this.props.user.user.house
      )
    );
  }
  render() {
    var studentHTML = null;
    var locationHTML = null;
    studentHTML = this.props.students.students.map((student, key) => {
      return (
        <StudentCard
          selected={this.props.students.selected.indexOf(student._id) != -1}
          view={this.props.view}
          student={student}
          key={key}
          addSelected={this.addSelected.bind(this)}
        />
      );
    });
    var locations = [];
    this.props.user.config.LOCATION_HEADINGS.forEach(heading => {
      locations.push([]);
    });
    this.props.locations.locations.map((location, key) => {
      locations[location.heading].push(location);
    });
    locationHTML = locations.map((locationsList, key) => {
      return locationsList.map((location, key2) => {
        return (
          <LocationButton
            location={location}
            break={key2 == 0}
            headingName={
              this.props.user.config.LOCATION_HEADINGS[location.heading]
            }
            key={key2}
            updateLocation={this.updateLocation.bind(this)}
          />
        );
      });
    });
    return (
      <div
        id="view-grid"
        className="row"
        style={{ marginTop: this.props.view ? 0 : 50 }}
      >
        <div className="col-10">{studentHTML}</div>
        <div className="col-2">
          <Toggle initial={false}>
            {({ on, toggle }) => {
              return (
                <div>
                  <div className="accordian location-button" onClick={toggle}>
                    <div className="location-button-body">Select</div>
                  </div>
                  {on && (
                    <div className="panel">
                      <button
                        className="select-button"
                        onClick={this.deselectAll.bind(this)}
                      >
                        Deselect All
                      </button>
                      {this.props.user.config.YEARGROUP_NAMES.map(
                        (yeargroup, key) => (
                          <button
                            className="select-button"
                            onClick={this.selectYear.bind(this, key)}
                          >
                            {yeargroup}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            }}
          </Toggle>
          {locationHTML}
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

export default connect(mapStateToProps)(ViewGrid);
