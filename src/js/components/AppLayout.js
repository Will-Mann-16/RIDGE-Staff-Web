import React from 'react';
import { ProgressIndicator } from 'office-ui-fabric-react';
import LoginPage from './pages/LoginPage';
import AuthLayout from './AuthLayout';
import { connect } from 'react-redux';
import { readUser } from '../actions/usersActions';

class AppLayout extends React.Component {
  componentWillMount() {
    this.props.dispatch(readUser());
  }

  render() {
    if (this.props.user.fetching) {
      return <ProgressIndicator label="Loading" description="Realtime Integrated Data Gathering Environment"/>;
    } else if (this.props.user.authenticated) {
      return <AuthLayout />;
    } else if (this.props.user.fetched) {
      return <LoginPage />;
    }
    return null;
  }
}
function mapStateToProps(state) {
  return { user: state.user, houses: state.houses };
}

export default connect(mapStateToProps)(AppLayout);
