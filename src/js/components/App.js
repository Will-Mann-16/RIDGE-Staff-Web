import React from 'react';
import LoginPage from './LoginPage';
import MainSectionLayout from './MainSectionLayout';
import { connect } from 'react-redux';
import ViewPage from './ViewPage';
import { readUser } from '../actions/usersActions';
import { readHouses } from '../actions/housesActions';

class App extends React.Component {
  componentWillMount() {
    this.props.dispatch(readUser());
  }

  render() {
    if (this.props.user.fetching) {
      return <div className="loader" />;
    } else if (this.props.user.authenticated) {
      return <MainSectionLayout />;
    } else if (this.props.user.fetched) {
      return <LoginPage />;
    }
    return null;
  }
}
function mapStateToProps(state) {
  return { user: state.user, houses: state.houses };
}

export default connect(mapStateToProps)(App);
