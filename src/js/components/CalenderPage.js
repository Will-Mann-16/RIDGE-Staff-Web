import React from "react"
import {connect} from "react-redux"
import {Toggle} from "react-powerplug"
import {createCalender, deleteCalender, updateCalender} from "../actions/calenderActions";
class CalenderPage extends React.Component{
    constructor(props){
        super(props);
        var date = new Date();
        this.state = {
            date: date,
            event: {
                title: "",
                description: "",
                startTime: date.getHours() + ":" + date.getMinutes(),
                endTime: (date.getHours() + 1) + ":" + date.getMinutes()
            },
            eventID: -1,
            openEdit: false
        }
    }
    componentWillReceiveProps(newProps){
        if(newProps.eventID !== -1){
            newProps.calender.events.forEach((event) => {
               if(event._id === newProps.eventID){
                   this.setState({...this.state, event: {...this.state.event, title: event.title, description: event.description, startTime: new Date(event.starttime).getHours() + ":" + new Date(event.starttime).getMinutes(), endTime: new Date(event.endtime).getHours() + ":" + new Date(event.endtime).getMinutes()}});
               }
            });
        }
    }
    updateEvent(){
        var start = this.state.event.startTime.split(":");
        var startTime = new Date(this.state.date);
        startTime.setHours(start[0], start[1]);
        var end = this.state.event.endTime.split(":");
        var endTime = new Date(this.state.date);
        endTime.setHours(end[0], end[1]);
        if(this.state.eventID === -1){
            var event = {
                title: this.state.event.title,
                description: this.state.event.description,
                starttime: startTime,
                endtime: endTime,
                _house: this.props.user.user.user.house
            };
            this.props.dispatch(createCalender(event, this.props.user.user.user.house));
        }
        else{
            var event = {
                _id: this.state.eventID,
                title: this.state.event.title,
                description: this.state.event.description,
                starttime: startTime,
                endtime: endTime,
                _house: this.props.user.user.user.house
            };
            this.props.dispatch(updateCalender(event._id, event, this.props.user.user.user.house));
        }
        this.setState({...this.state, openEdit: false});
    }
    delete(id){
        this.props.dispatch(deleteCalender(id, this.props.user.user.user.house));
    }
    editEvent(id){
        this.setState({...this.state, openEdit: true, eventID: id});
    }
    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({...this.state, event:{...this.state.event, [name]: value}});
    }
    updateDate(event){
        var value = event.target.value;
        var b = value.split(/\D/);
        value = new Date(b[0], --b[1], b[2]);
        this.setState({...this.state, date: value});
    }
    render() {
        var calenderHTML = this.props.calender.events.map((event, key) => {
            var startTime = new Date(event.starttime);
            var endTime = new Date(event.endtime);
            if(startTime.toDateString() === this.state.date.toDateString())
            {
                return (
                                <tr>
                                    <td>{event.title}</td>
                                    <td>{event.description}</td>
                                    <td>{new Date(event.starttime).toTimeString()}</td>
                                    <td>{new Date(event.endtime).toTimeString()}</td>
                                    <td style={{textAlign: 'center'}} onClick={this.editEvent.bind(this, event._id)}><i className="fa fa-edit"></i></td>
                                    <td style={{textAlign: 'center', height: "100%", position: "relative"}}>
                                        <Toggle initial={false}>
                                            {({on, toggle}) => {return on ? (
                                                <div className="btn-group" style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0}}>
                                                    <button className="btn-green btn-icon-small" style={{width: "50%", height: "100%"}} onClick={this.delete.bind(this, event._id)}><i className="fa fa-trash"></i></button>
                                                    <button className="btn-red btn-icon-small" style={{width: "50%", height: "100%"}} onClick={toggle}><i className="fa fa-times"></i></button>
                                                </div>
                                            ) : (
                                                <i className="fa fa-trash" onClick={toggle}></i>
                                            )}}
                                        </Toggle>
                                    </td>
                                </tr>
                            );
            }else{
                return null;
            }
        });
        return (
            <div className="container">
                <div className="icon-bar">
                    <a onClick={() => this.setState({...this.state, openEdit: !this.state.openEdit, eventID: -1})}>Add <i className="fa fa-plus-square"></i></a>
                    <input className="input" type="date" value={this.state.date.toISOString().split('T')[0]} onChange={this.updateDate.bind(this)} />
                </div>
                {this.state.openEdit && <div className="flex-row-full">
                    <input type="text" className="input" name="title" placeholder="Title" onChange={this.handleChange.bind(this)} value={this.state.event.title}/>
                    <input type="text" className="input" name="description" placeholder="Description" onChange={this.handleChange.bind(this)} value={this.state.event.description} />
                    <input type="time" className="input" name="startTime" onChange={this.handleChange.bind(this)} value={this.state.event.startTime} />
                    <input type="time" className="input" name="endTime" onChange={this.handleChange.bind(this)} value={this.state.event.endTime} />
                    <button className="btn-african-sapphire" onClick={this.updateEvent.bind(this)}>Submit</button>
                </div>}
                <table className="table">
                    <tbody>
                        <tr>
                            <th>
                                Title
                            </th>
                            <th>
                                Description
                            </th>
                            <th>
                                Start Time
                            </th>
                            <th>
                                End Time
                            </th>
                            <th style={{textAlign: 'center'}}>
                                Edit
                            </th>
                            <th style={{textAlign: 'center'}}>
                                Delete
                            </th>
                        </tr>
                    {calenderHTML}
                    </tbody>
                </table>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        calender: state.calender,
        user: state.user
    }
}

export default connect(mapStateToProps)(CalenderPage);