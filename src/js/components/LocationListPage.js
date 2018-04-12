import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Toggle } from 'react-powerplug';
import { deleteLocation, updateLocation } from '../actions/locationsActions';

class LocationListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        search: ''
      }
    };
  }
  promptDelete(id) {
    var deleted = this.state.deleted;
    deleted.push(id);
    this.setState({ ...this.state, deleted: deleted });
  }
  removeDelete(id) {
    var deleted = this.state.deleted.filter(i => {
      return i !== id;
    });
    this.setState({ ...this.state, deleted: deleted });
  }
  delete(id) {
    this.props.dispatch(deleteLocation(id, this.props.user.user.house));
    var deleted = this.state.deleted.filter(i => {
      return i !== id;
    });
    this.setState({ ...this.state, deleted: deleted });
  }
  changeOrderUp(location, list) {
    if (list.indexOf(location) > 0) {
      var index = list.indexOf(location);
      var aboveLoc = list[index - 1];
      var order = aboveLoc.order;
      aboveLoc.order = location.order;
      location.order = order;
      this.props.dispatch(
        updateLocation(aboveLoc._id, aboveLoc, this.props.user.user.house)
      );
      this.props.dispatch(
        updateLocation(location._id, location, this.props.user.user.house)
      );
    }
  }
  changeOrderDown(location, list) {
    if (list.indexOf(location) < list.length - 1) {
      var index = list.indexOf(location);
      var belowLoc = list[index + 1];
      var order = belowLoc.order;
      belowLoc.order = location.order;
      location.order = order;
      this.props.dispatch(
        updateLocation(belowLoc._id, belowLoc, this.props.user.user.house)
      );
      this.props.dispatch(
        updateLocation(location._id, location, this.props.user.user.house)
      );
    }
  }
  render() {
    const search = new RegExp(this.state.filters.search.toLowerCase(), 'i');
    const LocationRow = ({ location, list }) => {
      var locationStyle = {
        color: 'white',
        backgroundColor: location.colour
      };
      var link = '/locations/' + location._id;
      var headingHTML = () => {
        switch (location.heading) {
          case 0 + '':
            return 'No Heading';
            break;
          case 1 + '':
            return 'In College';
            break;
          case 2 + '':
            return 'Out of College';
            break;
        }
      };
      var display =
        search.test(location.name) ||
        search.test(location.colour) ||
        search.test(location.heading);
      return display ? (
        <tr>
          <td>{location.name}</td>
          <td>{headingHTML()}</td>
          <td style={locationStyle}>{location.colour}</td>
          <td style={{ textAlign: 'center' }}>
            <Link to={link} style={{ textDecoration: 'none', color: 'black' }}>
              <i className="fa fa-edit" />
            </Link>
          </td>
          <td
            style={{
              textAlign: 'center',
              height: '100%',
              position: 'relative'
            }}
          >
            <Toggle initial={false}>
              {({ on, toggle }) => {
                return on ? (
                  <div
                    className="btn-group"
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      right: 0,
                      left: 0
                    }}
                  >
                    <button
                      className="btn-green btn-icon-small"
                      style={{ width: '50%', height: '100%' }}
                      onClick={this.delete.bind(this, location._id)}
                    >
                      <i className="fa fa-trash" />
                    </button>
                    <button
                      className="btn-red btn-icon-small"
                      style={{ width: '50%', height: '100%' }}
                      onClick={toggle}
                    >
                      <i className="fa fa-times" />
                    </button>
                  </div>
                ) : (
                  <i className="fa fa-trash" onClick={toggle} />
                );
              }}
            </Toggle>
          </td>
          <td
            style={{
              textAlign: 'center',
              height: '100%',
              position: 'relative'
            }}
          >
            <div
              className="btn-group"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0
              }}
            >
              <button
                className="btn-african-sapphire btn-icon-small"
                onClick={this.changeOrderUp.bind(this, location, list)}
                style={{ width: '50%', height: '100%' }}
              >
                <i className="fa fa-arrow-circle-o-up" />
              </button>
              <button
                className="btn-african-sapphire btn-icon-small"
                onClick={this.changeOrderDown.bind(this, location, list)}
                style={{ width: '50%', height: '100%' }}
              >
                <i className="fa fa-arrow-circle-o-down" />
              </button>
            </div>
          </td>
        </tr>
      ) : null;
    };
    var locations = [];
    for (var i = 0; i < this.props.user.config.LOCATION_HEADINGS.length; i++) {
      locations.push([]);
    }
    this.props.locations.locations.map((location, key) => {
      locations[location.heading].push(location);
    });
    return (
      <div className="container">
        <Toggle initial={false}>
          {({ on, toggle }) => (
            <div>
              <div className="icon-bar">
                <Link
                  to="/locations/new"
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  Add <i className="fa fa-plus-square" />
                </Link>
                <a onClick={toggle}>
                  Filter <i className="fa fa-filter" />
                </a>
              </div>
              {on && (
                <div>
                  <input
                    className="form-input"
                    name="search"
                    placeholder="Search"
                    onChange={e =>
                      this.setState({
                        ...this.state,
                        filters: {
                          ...this.state.filters,
                          search: e.target.value
                        }
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </Toggle>
        <table className="table">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Heading</th>
              <th>Colour</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
              <th style={{ textAlign: 'center' }}>Reorder</th>
            </tr>
            {locations.map((locationList, key) => {
              /*return key == 0 ? (<tr><td colSpan={6}><h4>{this.props.user.config.LOCATION_HEADINGS[key]}</h4></td></tr>) +                      locationList.map((location, key2) => {
                            <LocationRow key={key2} location={location} list={locationList}/>
                        }): */
              return locationList.map((location, key2) => (
                <LocationRow
                  key={key2}
                  location={location}
                  list={locationList}
                />
              ));
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locations: state.locations,
    user: state.user
  };
}

export default connect(mapStateToProps)(LocationListPage);
