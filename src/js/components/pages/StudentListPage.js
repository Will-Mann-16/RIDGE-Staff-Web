import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteStudent, uploadStudents } from '../../actions/studentsActions';
import FileSaver from 'file-saver';
import { Toggle } from 'react-powerplug';
import XLSX from 'xlsx';

class StudentListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        search: '',
        yeargroup: [],
        blackLocations: []
      }
    };
  }

  componentWillMount() {
    var yeargroupFilterList = [];
    for (var i = 0; i < this.props.user.config.YEARGROUP_NAMES.length; i++) {
      yeargroupFilterList[i] = true;
    }
    var locations = [];
    this.props.locations.locations.forEach(location => {
      locations.push({});
    });
    this.setState({
      ...this.state,
      filters: { ...this.state.filters, yeargroup: yeargroupFilterList }
    });
  }

  delete(id) {
    this.props.dispatch(deleteStudent(id, this.props.user.user.house));
    var deleted = this.state.deleted.filter(i => {
      return i !== id;
    });
    this.setState({ ...this.state, deleted: deleted });
  }

  downloadExcel() {
    var jsonArr = [];
    this.props.students.students.forEach(student => {
      jsonArr.push({
        Firstname: student.firstname,
        Surname: student.surname,
        Yeargroup: student.yeargroup,
        Code: student.code.toUpperCase()
      });
    });
    var ws = XLSX.utils.json_to_sheet(jsonArr, {
      header: ['Firstname', 'Surname', 'Yeargroup', 'Code', 'Password']
    });
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push('Students');
    wb.Sheets['Students'] = ws;
    const s2ab = function(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
    var wbout = XLSX.write(wb, wopts);
    FileSaver.saveAs(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
      'student_download.xlsx'
    );
  }

  handleFileChange(e) {
    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var reader = new FileReader();
      var name = f.name;
      var dispatch = this.props.dispatch;
      var house = this.props.user.user.house;
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: 'binary' });
        var sheetName = workbook.SheetNames[0];
        var json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        dispatch(uploadStudents(json, house));
      };
      reader.readAsBinaryString(f);
    }
  }

  toggleYeargroup(yeargroup) {
    var filter = this.state.filters.yeargroup;
    filter[yeargroup] = !filter[yeargroup];
    this.setState({
      ...this.state,
      filters: { ...this.state.filters, yeargroup: filter }
    });
  }
  blackListLocation(location) {
    var filter = this.state.filters.blackLocations;
    if (filter.indexOf(location) == -1) {
      filter.push(location);
    } else {
      filter.splice(location, 1);
    }
    this.setState({
      ...this.state,
      filters: { ...this.state.filters, blackLocations: filter }
    });
  }

  render() {
    const search = new RegExp(this.state.filters.search.toLowerCase(), 'i');
    const studentHTML = this.props.students.students.map((student, key) => {
      var locationStyle = {
        color: 'white',
        backgroundColor: student.location.colour
      };
      var date = new Date(student.timelastout);
      var timeString =
        date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
      var link = '/students/' + student.code;
      var display =
        (search.test(student.firstname) ||
          search.test(student.surname) ||
          search.test(student.code) ||
          search.test(
            this.props.user.config.YEARGROUP_NAMES[student.yeargroup]
          ) ||
          search.test(student.location) ||
          search.test(timeString)) &&
        this.state.filters.yeargroup[student.yeargroup] &&
        this.state.filters.blackLocations.indexOf(student.location.id) == -1;
      return display ? (
        <tr key={key}>
          <td>{student.firstname}</td>
          <td>{student.surname}</td>
          <td>{this.props.user.config.YEARGROUP_NAMES[student.yeargroup]}</td>
          <td>{student.code.toUpperCase()}</td>
          <td style={locationStyle}>{student.location.name}</td>
          <td>{timeString}</td>
          <td style={{ textAlign: 'center' }}>
            <Link to={link} style={{ textDecoration: 'none', color: 'black' }}>
              <i className="fa fa-edit" />
            </Link>
          </td>
          <td
            style={{
              textAlign: 'center',
              height: '100%',
              position: 'relative'
            }}
          >
            <Toggle initial={false}>
              {({ on, toggle }) => {
                return on ? (
                  <div
                    className="btn-group"
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      right: 0,
                      left: 0
                    }}
                  >
                    <button
                      className="btn-green btn-icon-small"
                      style={{ width: '50%', height: '100%' }}
                      onClick={this.delete.bind(this, student._id)}
                    >
                      <i className="fa fa-trash" />
                    </button>
                    <button
                      className="btn-red btn-icon-small"
                      style={{ width: '50%', height: '100%' }}
                      onClick={toggle}
                    >
                      <i className="fa fa-times" />
                    </button>
                  </div>
                ) : (
                  <i className="fa fa-trash" onClick={toggle} />
                );
              }}
            </Toggle>
          </td>
        </tr>
      ) : null;
    });
    return (
      <div className="container">
        <Toggle initial={false}>
          {({ on: filterOn, toggle: filterToggle }) => {
            return (
              <Toggle initial={false}>
                {({ on: uploadOn, toggle: uploadToggle }) => {
                  return (
                    <div>
                      <div className="icon-bar">
                        <Link
                          to="/students/new"
                          style={{ textDecoration: 'none', color: 'white' }}
                        >
                          Add <i className="fa fa-plus-square" />
                        </Link>
                        <a onClick={this.downloadExcel.bind(this)}>
                          Download <i className="fa fa-cloud-download" />
                        </a>
                        <a onClick={uploadToggle}>
                          Upload <i className="fa fa-cloud-upload" />
                        </a>
                        <a onClick={filterToggle}>
                          Filter <i className="fa fa-filter" />
                        </a>
                      </div>
                      {uploadOn && (
                        <div style={{ width: '100%', margin: 5 }}>
                          <input
                            type="file"
                            style={{
                              padding: 10,
                              transitionDuration: 2,
                              textAlign: 'center'
                            }}
                            onChange={this.handleFileChange.bind(this)}
                          />
                        </div>
                      )}
                      {filterOn && (
                        <div className="row">
                          <input
                            className="col-4 input"
                            name="search"
                            placeholder="Search"
                            onChange={e =>
                              this.setState({
                                ...this.state,
                                filters: {
                                  ...this.state.filters,
                                  search: e.target.value
                                }
                              })
                            }
                          />
                          <div className="col-4">
                            {this.props.user.config.YEARGROUP_NAMES.map(
                              (name, key) => (
                                <label className="checkbox">
                                  {name}
                                  <input
                                    type="checkbox"
                                    onChange={this.toggleYeargroup.bind(
                                      this,
                                      key
                                    )}
                                    checked={
                                      this.state.filters.yeargroup[key]
                                        ? 'checked'
                                        : null
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              )
                            )}
                          </div>
                          <div className="col-4">
                            {this.props.locations.locations.map(
                              (location, key) => {
                                return (
                                  <label
                                    className="checkbox"
                                    key={key}
                                    style={{ color: location.colour }}
                                  >
                                    {location.name}
                                    <input
                                      type="checkbox"
                                      onChange={this.blackListLocation.bind(
                                        this,
                                        location._id
                                      )}
                                      checked={
                                        this.state.filters.blackLocations.indexOf(
                                          location._id
                                        ) == -1
                                          ? 'checked'
                                          : null
                                      }
                                    />
                                    <span className="checkmark" />
                                  </label>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              </Toggle>
            );
          }}
        </Toggle>
        <table className="table">
          <tbody>
            <tr>
              <th>Firstname</th>
              <th>Surname</th>
              <th>Yeargroup</th>
              <th>Code</th>
              <th>Location</th>
              <th>Last Signed Out</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
            </tr>
            {studentHTML}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    students: state.students,
    user: state.user,
    locations: state.locations,
    houses: state.houses
  };
}

export default connect(mapStateToProps)(StudentListPage);
