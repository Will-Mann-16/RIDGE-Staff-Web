import React from 'react';
import { connect } from 'react-redux';
import { Toggle } from 'react-powerplug';
import { DefaultButton } from 'office-ui-fabric-react';
import { house } from '../../socket';
import {
  selectStudent,
  deselectStudent,
  updateStudentLocation,
  deselectAll
} from '../../actions/studentsActions';
import styled from 'styled-components';
import StudentCard from './StudentCard';
import LocationButton from './LocationButton';

const ViewWrapper = styled.div`
  display: flex;
  margin: 1rem;
  align-items: stretch;
  justify-content: space-between;
`;

const StudentGrid = styled.div`
  display: grid;  
  grid-template-columns: repeat(auto-fill, 15vmin);
  grid-auto-rows: auto;  
  width: 100%;
`;

const LocationsList = styled.div`
  display: flex;
  flex-basis: 30vmin;
  flex-direction: column;
`;

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
      <ViewWrapper
        id="view-grid"
      >
        <StudentGrid>{studentHTML}</StudentGrid>
        <LocationsList>
          <Toggle initial={false}>
            {({ on, toggle }) => {
              return (
                <div>
                  <DefaultButton primary style={{width: '100%'}} onClick={toggle}>
                    Select
                  </DefaultButton>
                  {on && (
                    <div>
                      <DefaultButton
                          style={{width: '100%'}}
                        onClick={() => this.props.dispatch(deselectAll())}
                      >
                        Deselect All
                      </DefaultButton>
                      {this.props.user.config.YEARGROUP_NAMES.map(
                        (yeargroup, key) => (
                          <DefaultButton
                              style={{width: '100%'}}
                            onClick={this.selectYear.bind(this, key)}
                          >
                            {yeargroup}
                          </DefaultButton>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            }}
          </Toggle>
          {locationHTML}
        </LocationsList>
        </ViewWrapper>
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
