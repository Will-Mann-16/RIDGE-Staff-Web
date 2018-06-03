import React from 'react';
import {axiosOpen} from '../constants';
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import {connect} from 'react-redux';
const moment = extendMoment(originalMoment);

class HistoryListPage extends React.Component {
    constructor(props) {
        super(props);
        const today = moment();
        this.state = {
            amount: 50,
            filters: {
              search: '',
              yeargroup: [],
              whiteLocations: []
            },
            history: [],
            range: moment.range(today.clone().subtract(7, "days"), today.clone())
        };
    }

    readMore() {
        var amount = this.state.amount + 50;
        this.setState({...this.state, amount: amount}, () => {
            this.pullData();
        });
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({...this.state, [name]: value}, () => {
            this.pullData();
        });
    }
    onSelect = (range, states) => {
      this.setState({ range, states }, () => {this.pullData()});
    };
    pullData() {
      var yeargroups = [];
      this.state.filters.yeargroup.forEach((yeargroup, index) => {
        if(yeargroup){
          yeargroups.push(index);
        }
      });
      var filter = {
        whiteLocations: this.state.filters.whiteLocations,
        search: this.state.filters.search,
        yeargroup: yeargroups,
        startTime: this.state.range.start.format(),
        endTime: this.state.range.end.format()
      };
        axiosOpen
            .get('history/read', {
                params: {
                    house: this.props.user.user.house,
                    amount: this.state.amount,
                    filter: filter
                },
                headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}
            })
            .then(response => {
                if (response.data.success && response.status === 200) {
                    this.setState({...this.state, history: response.data.records});
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentWillMount() {
      var yeargroupFilterList = [];
      for (var i = 0; i < this.props.user.config.YEARGROUP_NAMES.length; i++) {
        yeargroupFilterList[i] = true;
      }
      var locations = [];
      this.props.locations.locations.forEach(location => {
        locations.push(location._id);
      });
      this.setState({
        ...this.state,
        filters: { ...this.state.filters, whiteLocations: locations, yeargroup: yeargroupFilterList }
      }, () => {this.pullData()});

    }
    toggleYeargroup(yeargroup) {
      var filter = this.state.filters.yeargroup;
      filter[yeargroup] = !filter[yeargroup];
      this.setState({
        ...this.state,
        filters: { ...this.state.filters, yeargroup: filter }
      }, () => {this.pullData()});
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
      }, () => {this.pullData()});
    }
    render() {
        var historyHTML = this.state.history.map((history, key) => {
            var date = new Date(history.time);
            return (
                <tr key={key}>
                    <td>
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
                    className="col-4 input"
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
                  <div className="col-4">
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
                              this.state.filters.yeargroup[key]
                                ? 'checked'
                                : null
                            }
                          />
                          <span className="checkmark" />
                        </label>
                      )
                    )}
                  </div>
                  <div className="col-4">
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
                  <DateRangePicker value={this.state.range} onSelect={this.onSelect} singleDateRange={true}/>
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
                    style={{width: '100%'}}
                >
                    Read More
                </button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {user: state.user, students: state.students, locations: state.locations, houses: state.houses};
}

export default connect(mapStateToProps)(HistoryListPage);
