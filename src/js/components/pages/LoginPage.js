import React from "react";
import { connect } from "react-redux";
import { authenticateUser } from "../../actions/usersActions";
import { TextField, DefaultButton, Label, ProgressIndicator, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import styled, { injectGlobal } from 'styled-components';
const LoginContainer = styled.div`
  background-color: white;
  height: 100vh;
  max-width: 500px;
  padding: 5em;
  z-index: 10;
`;
const BackgroundContainer = styled.div`
  background-color: #f1f1f1;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;
injectGlobal`
  *{
    box-sizing: border-box;
  }
  body{
    margin: 0;
    padding: 0;
  }
`
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }
  submitLogin = (e) => {
    e.preventDefault();
    this.props.dispatch(
      authenticateUser(this.username.value, this.password.value)
    );
  }
  render() {
    const {login} = this.props.user;
    return (
        <BackgroundContainer>
      <LoginContainer>
          <h1 className="ms-font-su">RIDGE</h1>
          <h2 className="ms-font-xxl">Wellington College</h2>
        <form onSubmit={this.submitLogin} style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', margin: '1em 0'}}>
        <TextField
          name="username"
          type="text"
          placeholder="Enter Username...  "
          label={<Label className="ms-font-l">Username</Label>}
          componentRef={ref => this.username = ref}
        />
        <TextField
          name="password"
          type="password"
          placeholder="Enter Password..."
          label={<Label className="ms-font-l">Password</Label>}
          componentRef={ref => this.password = ref}
        />
            {(login.fetched && !login.authenticated) &&
            (<div style={{marginTop: '1.25em'}}>
            <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                onDismiss={null}
            >
                <b>Invalid Login Credentials</b><br/>
                Please enter correct login credentials and try again.
            </MessageBar></div>)}
          <DefaultButton style={{marginTop: '1.5em'}} type="submit">Login</DefaultButton>
            {login.fetching && <ProgressIndicator label={<Label className="ms-font-m">Loading</Label>} description={<Label className="ms-font-s">Please Wait</Label>}/>}
        </form>
      </LoginContainer>
        </BackgroundContainer>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(LoginPage);
