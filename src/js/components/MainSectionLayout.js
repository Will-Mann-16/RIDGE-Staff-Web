import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, HashRouter } from 'react-router-dom';

import MainPage from './MainPage';
import HousesListPage from './HousesListPage';
import StudentListPage from './StudentListPage';
import StudentPage from './StudentPage';
import LocationListPage from './LocationListPage';
import LocationPage from './LocationPage';
import SettingsPage from './SettingsPage';
import HistoryListPage from './HistoryListPage';
import HousePage from './HousePage';
import CalloverPage from './CalloverPage';
import CalendarPage from './CalendarPage';

import Navbar from './Navbar';
import { activateListener } from '../socket';
import { readHouses } from '../actions/housesActions';
import { readLocations } from '../actions/locationsActions';
import { readStudentsMajor } from '../actions/studentsActions';
import { readCallovers } from '../actions/calloverActions';
import { readCalendar } from '../actions/calendarActions';

class MainSectionLayout extends React.Component {
  componentWillMount() {
    this.props.dispatch(readHouses(this.props.user.user.house));
    this.props.dispatch(readStudentsMajor(this.props.user.user.house));
    this.props.dispatch(readLocations(this.props.user.user.house));
    this.props.dispatch(readCallovers(this.props.user.user.house));
    this.props.dispatch(readCalendar(this.props.user.user.house));
    activateListener(this.props.dispatch, this.props.user.user.house);
  }

  render() {
    /*    if(this.props.user.fetching || this.props.houses.fetching || this.props.locations.fetching || this.props.students.fetching || this.props.callover.fetching){
        return (<div className="loader"></div>);
    }*/
    return (
      <HashRouter>
        <div>
          <Navbar />
          <Switch>
            <Route
              exact
              path="/"
              name="dashboard"
              component={({ props }) => <MainPage {...props} />}
            />
            <Route
              exact
              path="/houses"
              name="houses"
              component={({ props }) => <HousesListPage {...props} />}
            />
            <Route
              exact
              path="/houses/new"
              name="newhouse"
              component={({ props }) => <HousePage {...props} />}
            />
            <Route
              exact
              path="/houses/:house"
              name="house"
              component={({ props, match }) => (
                <HousePage edit houseID={match.params.house} {...props} />
              )}
            />
            <Route
              exact
              path="/students"
              name="studentlist"
              component={({ props }) => <StudentListPage {...props} />}
            />
            <Route
              path="/students/new"
              name="newstudent"
              component={({ props }) => <StudentPage {...props} />}
            />
            <Route
              path="/students/:student"
              name="student"
              component={({ props, match }) => (
                <StudentPage edit studentID={match.params.student} {...props} />
              )}
            />
            <Route
              exact
              path="/locations"
              name="locationlist"
              component={({ props }) => <LocationListPage {...props} />}
            />
            <Route
              path="/locations/new"
              name="newlocation"
              component={({ props }) => <LocationPage {...props} />}
            />
            <Route
              path="/history"
              name="history"
              component={({ props }) => <HistoryListPage {...props} />}
            />
            <Route
              path="/locations/:location"
              name="location"
              component={({ props, match }) => (
                <LocationPage
                  edit
                  locationID={match.params.location}
                  {...props}
                />
              )}
            />
            <Route
              path="/callover"
              name="callover"
              component={({ props }) => <CalloverPage {...props} />}
            />
            <Route
              path="/calendar"
              name="calendar"
              component={({ props }) => <CalendarPage {...props} />}
            />
            <Route
              path="/settings"
              name="settings"
              component={({ props }) => <SettingsPage {...props} />}
            />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    houses: state.houses,
    locations: state.locations,
    students: state.students,
    callover: state.callover
  };
}

export default connect(mapStateToProps)(MainSectionLayout);
