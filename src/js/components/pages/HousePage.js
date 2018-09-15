import React from 'react';
import { connect } from 'react-redux';
import { SketchPicker } from 'react-color';
import { createHouse, updateHouse } from '../../actions/housesActions';
import { Redirect } from 'react-router-dom';
import { Toggle } from 'react-powerplug';

class HousePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      house: {
        name: '',
        personell: [],
        colours: []
      },
      newPersonText: '',
      newColour: '',
      submitted: false
    };
  }
  componentWillMount() {
    if (this.props.edit) {
      this.props.houses.houses.forEach(house => {
        if (this.props.houseID === house._id) {
          this.setState({ ...this.state, house: house });
        }
      });
    }
  }
  addHouse() {
    if (this.props.edit) {
      this.props.dispatch(updateHouse(this.state.house._id, this.state.house));
    } else {
      this.props.dispatch(createHouse(this.state.house));
    }
    this.setState({ ...this.state, submitted: true });
  }
  updatePerson(e) {
    var value = e.target.value;
    this.setState({ ...this.state, newPersonText: value });
  }

  addPersonToList() {
    var personell = this.state.house.personell;
    personell.push(this.state.newPersonText);
    this.setState({
      ...this.state,
      house: { ...this.state.house, personell: personell }
    });
  }
  addColourToList() {
    var colours = this.state.house.colours;
    colours.push(this.state.newColour.hex);
    this.setState({
      ...this.state,
      house: { ...this.state.house, colours: colours }
    });
  }
  removePerson(person) {
    var personell = this.state.house.personell;
    personell.splice(personell.indexOf(person), 1);
    this.setState({
      ...this.state,
      house: { ...this.state.house, personell: personell }
    });
  }
  removeColour(colour) {
    var colours = this.state.house.colours;
    colours.splice(colours.indexOf(colour), 1);
    this.setState({
      ...this.state,
      house: { ...this.state.house, colours: colours }
    });
  }

  handleNameChange(e) {
    var value = e.target.value;
    this.setState({
      ...this.state,
      house: { ...this.state.house, name: value }
    });
  }
  handleChangeColour(colour) {
    this.setState({ ...this.state, newColour: colour });
  }
  render() {
    if (this.state && this.state.submitted) {
      return <Redirect to="/houses" />;
    }
    return (
      <div className="container">
        <h3>{this.props.edit ? 'Update' : 'Create'} House</h3>
        <input
          className="form-input"
          value={this.state.house.name}
          onChange={this.handleNameChange.bind(this)}
          placeholder="Name"
        />
        <Toggle>
          {({ on, toggle }) => (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                {this.state.house.personell.map((person, key) => (
                  <p
                    className="btn-black-onyx"
                    onClick={this.removePerson.bind(this, person)}
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
                  {on ? 'Close' : 'Add Person'}
                </button>
              </div>
              {on ? (
                <div className="row" style={{ marginTop: 5 }}>
                  <input
                    style={{ float: 'left', width: '75%' }}
                    className="input"
                    type="text"
                    placeholder="New Person"
                    onChange={this.updatePerson.bind(this)}
                  />
                  <button
                    className="btn-green"
                    style={{ float: 'right', width: '25%' }}
                    onClick={this.addPersonToList.bind(this)}
                  >
                    Add
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </Toggle>
        <Toggle>
          {({ on, toggle }) => {
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 5
                }}
              >
                {this.state.house.colours.map((colour, key) => (
                  <p
                    onClick={this.removeColour.bind(this, colour)}
                    className="btn-black-onyx"
                    style={{
                      backgroundColor: colour,
                      flexGrow: 1,
                      flexBasis: '100%'
                    }}
                    key={key}
                  />
                ))}
                <button
                  className="btn-blue"
                  onClick={toggle}
                  style={{
                    flexGrow: 1,
                    flexBasis: '100%'
                  }}
                >
                  {on ? 'Close' : 'Add Colour'}
                </button>
              </div>
              {on ? (
                <div className="row" style={{ marginTop: 5 }}>
                  <div style={{ margin: 'auto', maxWidth: 300 }}>
                    <SketchPicker
                      width={300}
                      disableAlpha
                      color={this.state.newColour}
                      onChangeComplete={this.handleChangeColour.bind(this)}
                    />
                    <button
                      className="btn-green"
                      style={{ width: '100%' }}
                      onClick={this.addColourToList.bind(this)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : null}
            </div>;
          }}
        </Toggle>
        <button
          className="btn-green"
          style={{ marginTop: 5 }}
          onClick={this.addHouse.bind(this)}
        >
          {this.props.edit ? 'Update' : 'Create'}
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    houses: state.houses,
    user: state.user
  };
}

export default connect(mapStateToProps)(HousePage);
