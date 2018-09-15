import React from 'react';
import { DefaultButton } from 'office-ui-fabric-react';
const getRGB = function(b){
    var a;
    if(b&&b.constructor==Array&&b.length==3)return b;
    if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))return[parseInt(a[1]),parseInt(a[2]),parseInt(a[3])];
    if(a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b))return[parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];
    if(a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b))return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],
        16)];
    if(a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b))return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];
    return null;
};

const calculateLuminance = function(color) {
    var rgb = getRGB(color);
    if (!rgb) return null;
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export default class LocationButton extends React.Component {
  handleClick() {
    var thisLocation = this.props.location;
    this.props.updateLocation(thisLocation);
  }
  render() {
    var locationStyle = {
        color: calculateLuminance(this.props.location.color) < 180 ? '#fff' : '#000',
      backgroundColor: this.props.location.colour,
        width: '100%',
        padding: '1.5rem'
    };
    const headingHTML = () => {
      return (
          <h4 className="ms-font-xl" style={{ textAlign: 'center', margin: '1rem' }}>
            {this.props.headingName}
          </h4>
      );
    };
    const breakHTML = this.props.break ? headingHTML() : null;
    return (
      <div>
        {breakHTML}
        <DefaultButton
          style={locationStyle}
          onClick={this.handleClick.bind(this)}
        >
            <span className="ms-font-l">{this.props.location.name}</span>
        </DefaultButton>
      </div>
    );
  }
}
