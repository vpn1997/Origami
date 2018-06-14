import React from "react";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getInputComponentById } from "../../inputcomponents";
import { getOutputComponentById } from "../../outputcomponents";
import { getDeployed } from "../../../api/Nongh/getDeployed";
import { modifyDeployed } from "../../../api/Nongh/modifyDeployed";
import { getComponentDeployed } from "../../../api/CommonLocal/getComponentDeployed";
import SampleInput from "../../sampleinput";
import SampleImage from "../../sampleinput/SampleImage";
import toastr from "toastr";
import { Layout, Icon, Button, Card, Row, Col, Input, Select } from "antd";
const { Header, Content, Footer } = Layout;
import request from "superagent";

toastr.options.closeButton = true;

class NGHDemoPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      demo_creator_id: 0,
      user_id: 0,
      outputData: [],
      showTerminal: false,
      terminalData: [],
      inputModel: {},
      outputModel: {},
      demoModel: {},
      isCreator: false,
      sampleinput: [],
      imageInputCount: 0,
      files: [],
      index: 0,
      resetBorder: false
    };

  }  

  render() {
    const mainClassName = this.state.showTerminal
      ? "ui twelve wide column grid"
      : "ui sixteen wide column grid";

    return (

        <div style={{backgroundColor:'#CDCDCD'}} >
        <p>sdfj skjdf</p>
        
        </div>


      );
  }
}

NGHDemoPage.propTypes = {
  login: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  nonghDemoModel: PropTypes.object.isRequired,
  outputComponentDemoModel: PropTypes.object.isRequired,
  inputComponentDemoModel: PropTypes.object.isRequired
};

NGHDemoPage.contextTypes = {
  socket: PropTypes.object.isRequired,
  socketId: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    login: state.login,
    user: state.user,
    nonghDemoModel: state.nonghDemoModel,
    inputComponentDemoModel: state.inputComponentDemoModel,
    outputComponentDemoModel: state.outputComponentDemoModel
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NGHDemoPage)
);
