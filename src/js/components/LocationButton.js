import React from 'react';

export default class LocationButton extends React.Component {
  handleClick() {
    var thisLocation = this.props.location;
    this.props.updateLocation(thisLocation);
  }
  render() {
    var locationStyle = {
      backgroundColor: this.props.location.colour
    };
    const headingHTML = () => {
      return (
        <div>
          <h4 style={{ textAlign: 'center', marginTop: 10 }}>
            {this.props.headingName}
          </h4>
        </div>
      );
    };
    const breakHTML = this.props.break ? headingHTML() : null;
    return (
      <div>
        {breakHTML}
        <div
          className="location-button"
          style={locationStyle}
          onClick={this.handleClick.bind(this)}
        >
          <div className="location-button-body">{this.props.location.name}</div>
        </div>
      </div>
    );
  }
}
