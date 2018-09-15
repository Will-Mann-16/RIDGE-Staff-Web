import React from 'react';
import { connect } from 'react-redux';

import UserSettings from '../settings/UserSettings';
import ConfigSettings from '../settings/ConfigSettings';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 0
    };
  }

  changeActivePage(pageID) {
    this.setState({ activePage: pageID });
  }
  disableRole(role) {
    if (role <= this.props.user.user.role) {
      return true;
    }
    return false;
  }

  renderCurrentPage() {
    switch (this.state.activePage) {
      case 0:
        return (
          <div className="col-10">
            <UserSettings key="edit" edit />
          </div>
        );
      case 1:
        return (
          <div className="col-10">
            <UserSettings key="new" />
          </div>
        );
      case 2:
        return (
          <div className="col-10">
            <ConfigSettings />
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="container row">
        <div className="col-2">
          <ul className="list">
            <li
              onClick={this.changeActivePage.bind(this, 0)}
              className={this.state.activePage === 0 ? 'active' : null}
            >
              User Settings
            </li>
            <li
              onClick={this.changeActivePage.bind(this, 1)}
              className={this.state.activePage === 1 ? 'active' : null}
            >
              New User
            </li>
            {this.props.user.user.role <= 2 ? (
              <li
                onClick={this.changeActivePage.bind(this, 2)}
                className={this.state.activePage === 2 ? 'active' : null}
              >
                Options
              </li>
            ) : null}
          </ul>
        </div>
        {this.renderCurrentPage()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(SettingsPage);
