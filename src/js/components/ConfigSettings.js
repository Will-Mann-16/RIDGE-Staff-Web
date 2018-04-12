import React from 'react';
import { connect } from 'react-redux';
import { modifyHouseConfig } from '../actions/housesActions';
import { Toggle } from 'react-powerplug';

class ConfigSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: [],
      submittable: false,
      defaultLocation: {
        location: {},
        id: ''
      },
      yeargroups: [],
      newYeargroupText: '',
      locationHeadings: [],
      newLocationHeadingText: ''
    };
  }
  componentWillMount() {
    var location = this.props.locations.locations.map((location, key) => {
      if (location._id === this.props.user.config.DEFAULT_LOCATION) {
        this.setState({ ...this.state, submittable: true });
        return location;
      }
      return null;
    });
    var yeargroups = this.props.user.config.YEARGROUP_NAMES;
    this.setState({
      ...this.state,
      defaultLocation: {
        id: this.props.user.config.DEFAULT_LOCATION,
        location: location
      },
      yeargroups: yeargroups,
      locationHeadings: this.props.user.config.LOCATION_HEADINGS
    });
  }

  handleDefaultLocationChange(e) {
    var val = e.target.value;
    var location = {};
    location = this.props.locations.locations.map((location, key) => {
      if (location._id === val) {
        return location;
      }
      return null;
    });
    this.setState({
      ...this.state,
      submittable: true,
      defaultLocation: { id: val, location: location }
    });
  }

  removeYeargroup(yeargroup) {
    var { yeargroups } = this.state;
    yeargroups.splice(yeargroups.indexOf(yeargroup), 1);
    this.setState({ ...this.state, submittable: true, yeargroups: yeargroups });
  }
  updateYeargroup(e) {
    var value = e.target.value;
    this.setState({ ...this.state, newYeargroupText: value });
  }

  addYeargroupToList() {
    var { yeargroups, newYeargroupText } = this.state;
    yeargroups.push(newYeargroupText);
    this.setState({ ...this.state, submittable: true, yeargroups: yeargroups });
  }

  removeLocationHeading(locationHeading) {
    var { locationHeadings } = this.state;
    locationHeadings.splice(locationHeadings.indexOf(locationHeading), 1);
    this.setState({
      ...this.state,
      submittable: true,
      locationHeadings: locationHeadings
    });
  }
  updateLocationHeading(e) {
    var value = e.target.value;
    this.setState({ ...this.state, newLocationHeadingText: value });
  }

  saveConfig() {
    var defaultLocation = this.state.defaultLocation.id;
    var { yeargroups, locationHeadings } = this.state;
    var result = {
      DEFAULT_LOCATION: defaultLocation,
      YEARGROUP_NAMES: yeargroups,
      LOCATION_HEADINGS: locationHeadings
    };
    if (this.state.submittable) {
      this.props.dispatch(
        modifyHouseConfig(this.props.user.user.house, result)
      );
    }
  }

  render() {
    var locationHTML = this.props.locations.locations.map((location, key) => {
      return (
        <option
          key={key}
          value={location._id}
          selected={this.state.defaultLocation.id === location._id}
          style={{ backgroundColor: location.colour, color: 'white' }}
        >
          {location.name}
        </option>
      );
    });
    return (
      <div className="container">
        <div className="config-option">
          <h5>Default Location:</h5>
          <select
            required
            className="form-input"
            name="conf-default-location"
            style={{
              backgroundColor: this.state.defaultLocation.location.colour,
              borderColor: this.state.submittable ? 'black' : 'red'
            }}
            onChange={this.handleDefaultLocationChange.bind(this)}
          >
            {locationHTML}
          </select>
        </div>
        <Toggle>
          {({ on, toggle }) => (
            <div className="config-option">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                {this.state.yeargroups.map((person, key) => (
                  <p
                    className="btn-black-onyx"
                    onClick={this.removeYeargroup.bind(this, person)}
                    style={{ flexGrow: 1, flexBasis: '100%' }}
                    key={key}
                  >
                    {person}
                  </p>
                ))}
                <button
                  className="btn-blue"
                  onClick={toggle}
                  style={{
                    flexGrow: 1,
                    flexBasis: '100%'
                  }}
                >
                  {on ? 'Close' : 'Add Yeargroup'}
                </button>
              </div>
              {on ? (
                <div className="row" style={{ marginTop: 5 }}>
                  <input
                    style={{ float: 'left', width: '75%' }}
                    className="input"
                    type="text"
                    placeholder="New Yeargroup"
                    onChange={this.updateYeargroup.bind(this)}
                  />
                  <button
                    className="btn-green"
                    style={{ float: 'right', width: '25%' }}
                    onClick={this.addYeargroupToList.bind(this)}
                  >
                    Add
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </Toggle>
        <Toggle>
          {({ on, toggle }) => (
            <div className="config-option">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                {this.state.locationHeadings.map((locationHeading, key) => (
                  <p
                    className="btn-black-onyx"
                    onClick={this.removeLocationHeading.bind(
                      this,
                      locationHeading
                    )}
                    style={{ flexGrow: 1, flexBasis: '100%' }}
                    key={key}
                  >
                    {locationHeading}
                  </p>
                ))}
                <button
                  className="btn-blue"
                  onClick={toggle}
                  style={{
                    flexGrow: 1,
                    flexBasis: '100%'
                  }}
                >
                  {on ? 'Close' : 'Add Location Heading'}
                </button>
              </div>
              {on ? (
                <div className="row" style={{ marginTop: 5 }}>
                  <input
                    style={{ float: 'left', width: '75%' }}
                    className="input"
                    type="text"
                    placeholder="New Location Heading"
                    onChange={this.updateLocationHeading.bind(this)}
                  />
                  <button
                    className="btn-green"
                    style={{ float: 'right', width: '25%' }}
                    onClick={this.addLocationHeadingToList.bind(this)}
                  >
                    Add
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </Toggle>
        <button className="btn-green" onClick={this.saveConfig.bind(this)}>
          Save
        </button>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
    houses: state.houses,
    locations: state.locations
  };
}

export default connect(mapStateToProps)(ConfigSettings);
