import React from 'react';
import { axiosToken } from '../constants';

import { connect } from 'react-redux';

class HistoryListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 50,
      search: '',
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
          filter: this.state.search
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
  componentWillMount() {
    this.pullData();
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
        <div className="icon-bar">
          <input
            className="form-input"
            placeholder="Search..."
            style={{ width: '100%', margin: 5 }}
            onChange={this.handleChange.bind(this)}
            name="search"
          />
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
  return { user: state.user };
}
export default connect(mapStateToProps)(HistoryListPage);
