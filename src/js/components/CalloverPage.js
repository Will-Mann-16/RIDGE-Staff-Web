import React from "react"
import { connect } from "react-redux"
import {updateStudentLocation} from "../actions/studentsActions";
import {createCallover} from "../actions/calloverActions";
class CalloverPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            calledOver: [],
            defaultLocation: null,
            newCallover: true,
            activeCallover: null,
        }
    }
    callOver(id){
        var calledOver = this.state.calledOver;
        calledOver.push(id);
        this.setState({...this.state, calledOver: calledOver});
    }
    removeCallOver(id){
        var calledOver = this.state.calledOver;
        calledOver.splice(calledOver.indexOf(id), 1);
        this.setState({...this.state, calledOver: calledOver});
    }
    submitCallover(){
        var students = [];
        this.props.students.students.forEach((student) =>{
           var present = this.state.calledOver.indexOf(student._id) !== -1
               students.push({_id: student._id, present: present});
        });
        this.props.dispatch(createCallover({time: Date.now(), students: students, _house: this.props.user.user.user.house}, this.props.user.user.user.house));
        if(this.state.defaultLocation !== null){
            this.props.dispatch(updateStudentLocation(this.state.calledOver, this.state.defaultLocation, this.props.user.user.user.house));
        }
        this.setState({...this.state, calledOver: []});
    }
    addCallover(){
        this.setState({...this.state, newCallover: true});
    }
    viewCallover(){
        this.setState({...this.state, newCallover: false});
    }
    changeActiveCallover(index){
        this.setState({...this.state, activeCallover: this.props.callover.callovers[index]});
    }

    componentWillMount(){
                var defaultLocation = null;
                this.props.locations.locations.forEach((location) => {
                    if(location._id === this.props.user.config.DEFAULT_LOCATION && defaultLocation !== null){
                        defaultLocation = location;
                    }
                })
                if(defaultLocation !== null){
                    this.setState({...this.state, defaultLocation: defaultLocation});
                }
    }
    render(){
        var studentHTML = this.props.students.students.map((student, key) => {
            return(
                <tr key={key}>
                    <td>{student.firstname}</td>
                    <td>{student.surname}</td>
                    <td style={{backgroundColor: student.location.colour, color: "white"}}>{student.location.name}</td>
                    <td style={{textAlign: 'center', height: "100%", position: "relative"}}><div className="btn-group" style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0}}>{this.state.calledOver.indexOf(student._id) === -1 ? <button className="btn-green btn-icon-small" style={{width: "100%", height: "100%"}} onClick={this.callOver.bind(this, student._id)}><i className="fa fa-check"></i></button> : <button className="btn-red btn-icon-small" style={{width: "100%", height: "100%"}} onClick={this.removeCallOver.bind(this, student._id)}><i className="fa fa-times"></i></button>}</div></td>
                </tr>
            );
        });
        var calloverHTML = this.props.callover.callovers.map((callover, key) => {
            var date = new Date(callover.time);
            return(
                <li key={key} onClick={this.changeActiveCallover.bind(this, this.props.callover.callovers.indexOf(callover))} className={this.state.activeCallover === callover ? "active" : null}>{date.toLocaleDateString()} {date.toLocaleTimeString()}</li>
            )
        });
        const renderHTML = (callover) => {
            if(callover) {
                var calloverStudentHTML = callover.students.map((student, key) => {
                    var student1 = {};
                    this.props.students.students.forEach((student2) => {
                       if(student2._id === student._id){
                           student1 = student2
                       }
                    });
                    return(
                        <tr key={key}>
                            <td>{student1.firstname}</td>
                            <td>{student1.surname}</td>
                            <td style={{textAlign: 'center', height: "100%", position: "relative"}}><div className="btn-group" style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0}}>{student.present ? <button className="btn-green btn-icon-small" style={{width: "100%", height: "100%"}}><i className="fa fa-check"></i></button> : <button className="btn-red btn-icon-small" style={{width: "100%", height: "100%"}}><i className="fa fa-times"></i></button>}</div></td>
                        </tr>
                    );
                });
                return (
                    <table className="table table-hover">
                        <tbody>
                        <tr>
                            <th>Firstname</th>
                            <th>Surname</th>
                            <th>Called Over</th>
                        </tr>
                        {calloverStudentHTML}
                        </tbody>
                    </table>
                );
            }
            else{
                return (<div>
                    <h3>Select a Callover</h3>
                </div>);
            }
        }
        return(
          <div className="container">
              <div className="icon-bar">
                  <a className={this.state.newCallover ? "active": ""} onClick={this.addCallover.bind(this)} style={{textDecoration: "none", color: "white"}}>Add <i className="fa fa-plus-square"></i></a>
                  <a className={!this.state.newCallover ? "active": ""} onClick={this.viewCallover.bind(this)} style={{textDecoration: "none", color: "white"}}>View <i className="fa fa-eye"></i></a>
              </div>
              {this.state.newCallover?
                  <div>
              <table className="table table-hover">
                  <tbody>
                      <tr>
                          <th>Firstname</th>
                          <th>Surname</th>
                          <th>Location</th>
                          <th>Called Over</th>
                      </tr>
                      {studentHTML}
                  </tbody>
              </table>
              <button className="btn-black-onyx" onClick={this.submitCallover.bind(this)}>Submit</button>
                  </div>:
              <div className="row">
                  <div className="col-3">
                      <ul className="list">
                      {calloverHTML}
                      </ul>
                  </div>
                  <div className="col-9">
                      {renderHTML(this.state.activeCallover)}
                  </div>
              </div>}
          </div>
        );
    }
}

function mapStateToProps(state){
    return {
        callover: state.callover,
        students: state.students,
        user: state.user,
        houses: state.houses,
        locations: state.locations
    }
}

export default connect(mapStateToProps)(CalloverPage);