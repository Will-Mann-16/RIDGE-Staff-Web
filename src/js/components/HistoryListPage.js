import React from 'react';
import { axiosToken } from '../constants';

import { connect } from 'react-redux';

class HistoryListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 50,
      filters: {
        search: '',
        yeargroup: [],
        whiteLocations: [],
        startTime: new Date(0),
        endTime: new Date(253402300740000)
      },
      history: []
    };
  }
  readMore() {
    var amount = this.state.amount + 50;
    this.setState({ ...this.state, amount: amount }, () => {
      this.pullData();
    });
  }
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({ ...this.state, [name]: value }, () => {
      this.pullData();
    });
  }
  pullData() {
    axiosToken
      .get('history/read', {
        params: {
          house: this.props.user.user.house,
          amount: this.state.amount,
          filter: this.state.filters
        }
      })
      .then(response => {
        if (response.data.success && response.status === 200) {
          this.setState({ ...this.state, history: response.data.records });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  toggleYeargroup(yeargroup) {
    var filter = this.state.filters.yeargroup;
    if (filter.indexOf(yeargroup) == -1) {
      filter.push(yeargroup);
    } else {
      filter.splice(yeargroup, 1);
    }
    this.setState({
      ...this.state,
      filters: { ...this.state.filters, yeargroup: filter }
    }, () => {
      this.pullData();
    });
  }
  whiteListLocation(location) {
    var filter = this.state.filters.whiteLocations;
    if (filter.indexOf(location) == -1) {
      filter.push(location);
    } else {
      filter.splice(location, 1);
    }
    this.setState({
      ...this.state,
      filters: { ...this.state.filters, whiteLocations: filter }
    }, () => {
      this.pullData();
    });
  }
  handleDateChange(e){
    var b = e.target.value.split(/\D+/);
    var date = new Date(b[0], --b[1], b[2], b[3], b[4], b[5]||0, b[6]||0);
    if(e.target.name === "startTime"){
        this.setState({...this.state, filters: {...this.state.filters, startTime: date}}, () => {
          this.pullData();
        });
    }
    else{
      this.setState({...this.state, filters: {...this.state.filters, endTime: date}}, () => {
        this.pullData();
      });
    }
  }
  componentWillMount() {
    var yeargroupFilterList = [];
    for (var i = 0; i < this.props.user.config.YEARGROUP_NAMES.length; i++) {
      yeargroupFilterList[i] = i;
    }
    var locationFilterList = this.props.locations.locations.map((location, key) => location._id);
    this.setState({
      ...this.state,
      filters: { ...this.state.filters, yeargroup: yeargroupFilterList, whiteLocations: locationFilterList }
    }, () => {
      this.pullData();
    });
  }
  render() {
    var historyHTML = this.state.history.map((history, key) => {
      var date = new Date(history.time);
      return (
        <tr key={key}>
          <td style={{backgroundColor: this.props.locations.locations.find((location) => location._id === history.location._id)[0], color: "white"}}>
            {history.student.firstname} {history.student.surname}
          </td>
          <td>
            {this.props.user.config.YEARGROUP_NAMES[history.student.yeargroup]}
          </td>
          <td>{history.location.name}</td>
          <td>
            {date.toLocaleTimeString()} {date.toLocaleDateString()}
          </td>
        </tr>
      );
    });
    return (
      <div className="container">
          <div className="row">
            <input
              className="col-3 input"
              name="search"
              placeholder="Search"
              value={this.state.filters.search}
              onChange={e =>
                this.setState({
                  ...this.state,
                  filters: {
                    ...this.state.filters,
                    search: e.target.value
                  }
                }, () => {
                  this.pullData();
                })
              }
            />
            <div className="col-3 row">
              <input className="col-6 input" name="startTime" type="datetime-local" value={this.state.filters.startTime.toISOString().substring(0,this.state.filters.startTime.toISOString().length-1)} onChange={this.handleDateChange.bind(this)} placeholder="Start Date"/>
              <input className="col-6 input" name="endTime" type="datetime-local" value={this.state.filters.endTime.toISOString().substring(0,this.state.filters.endTime.toISOString().length-1)} onChange={this.handleDateChange.bind(this)} placeholder="End Date"/>
            </div>
            <div className="col-3">
              {this.props.user.config.YEARGROUP_NAMES.map(
                (name, key) => (
                  <label className="checkbox">
                    {name}
                    <input
                      type="checkbox"
                      onChange={this.toggleYeargroup.bind(
                        this,
                        key
                      )}
                      checked={
                        this.state.filters.yeargroup.indexOf(key) != -1
                          ? 'checked'
                          : null
                      }
                    />
                    <span className="checkmark" />
                  </label>
                )
              )}
            </div>
            <div className="col-3">
              {this.props.locations.locations.map(
                (location, key) => {
                  return (
                    <label
                      className="checkbox"
                      key={key}
                      style={{ color: location.colour }}
                    >
                      {location.name}
                      <input
                        type="checkbox"
                        onChange={this.whiteListLocation.bind(
                          this,
                          location._id
                        )}
                        checked={
                          this.state.filters.whiteLocations.indexOf(
                            location._id
                          ) != -1
                            ? 'checked'
                            : null
                        }
                      />
                      <span className="checkmark" />
                    </label>
                  );
                }
              )}
            </div>
          </div>
        <table className="table">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Yeargroup</th>
              <th>Location</th>
              <th>Time</th>
            </tr>
            {historyHTML}
          </tbody>
        </table>
        <button
          onClick={this.readMore.bind(this)}
          className="btn-blue"
          style={{ width: '100%' }}
        >
          Read More
        </button>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { user: state.user, locations: state.locations, students: state.students };
}
export default connect(mapStateToProps)(HistoryListPage);
