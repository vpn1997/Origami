import React from "react";
import { PropTypes } from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CircularProgress from "material-ui/CircularProgress";
import * as nonghDemoModelActions from "../../../actions/nonghDemoModelActions";
import rangeCheck from "range_check";
import { getDeployed } from "../../../api/Nongh/getDeployed";
import { getComponentDeployed } from "../../../api/CommonLocal/getComponentDeployed";
import {
  getSinglePermalink,
  getAllPermalink,
  addPermalink,
  modifyPermalink
} from "../../../api/Nongh/permalink";
import { getWebAppStatus } from "../../../api/Generic/getWebAppStatus";
import RaisedButton from "material-ui/RaisedButton";
import StopNow from "material-ui/svg-icons/action/pan-tool";
import Dropzone from "react-dropzone";
import Checkbox from "material-ui/Checkbox";
import GoAhead from "material-ui/svg-icons/action/check-circle";
import { red500, green500, grey900 } from "material-ui/styles/colors";
import TextField from "material-ui/TextField";
import request from "superagent";
import { Step, Stepper, StepLabel } from "material-ui/Stepper";
import toastr from "toastr";
import { Layout, Row, Col } from "antd";
import { ORIGAMI_READ_THE_DOCS } from "../../../constants";
import { Card, Icon, Image,Button,Dimmer,Header} from 'semantic-ui-react'



const { Content, Footer } = Layout;

toastr.options.closeButton = true;

class RegisterPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showOutput: "hidden",
      id: Math.floor(Math.random() * 10000000).toString(),
      user_id: parseInt(localStorage.getItem("user_id"), 10),
      currentProject: {},
      nonghDemoModel: {},
      name: "",
      description: "",
      nameErrorText: "",
      addressErrorText: "",
      portErrorText: "",
      address: "",
      port: "",
      currentPort: "",
      webappaddress: "",
      tempwebaddress: "",
      footer_message: "",
      cover_image: "",
      deploymentBoxSelectedStatus: false,
      status: "",
      webappUnreachableErrorText: "",
      webappLocalUnreachableErrorText: "",
      showLocalDeploymentCheckBox: true,
      showTerminal: false,
      returning: false,
      inputComponentStepperHighlight: false,
      outputComponentStepperHighlight: false,
      permalinkObject: {},
      active:0,
      btnactive:0,
      btnclicked:0
    };
    this.socket = this.context.socket;
    this.toggleShow = this.toggleShow.bind(this);
    this.updateDemoModelData = this.updateDemoModelData.bind(this);
    this.onLocalDeploymentCheckBoxCheck = this.onLocalDeploymentCheckBoxCheck.bind(
      this
    );
    this.updateDescription = this.updateDescription.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updatePort = this.updatePort.bind(this);
    this.updatefooter_message = this.updatefooter_message.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleTerminal = this.toggleTerminal.bind(this);
    this.validateTempwebaddress = this.validateTempwebaddress.bind(this);
    this.validateIP = this.validateIP.bind(this);
    this.validatePort = this.validatePort.bind(this);
    this.getStyles = this.getStyles.bind(this);
    this.hover=this.hover.bind(this);
    this.exit=this.exit.bind(this);
    this.btnEnter=this.btnEnter.bind(this);
  }

  componentWillMount() {
    getDeployed(this.state.user_id, this.props.match.params.repoId)
      .then(singleRepo => {
        if (this.props.match.params.repoId) {
          if (JSON.parse(singleRepo).length !== 0) {
            this.setState({ returning: true });
            this.setState({
              tempwebaddress: JSON.parse(singleRepo)[0].token.split(":")[1]
            });
            if (JSON.parse(singleRepo)[0].token.split(":")[1] === "0.0.0.0") {
              this.setState({ showLocalDeploymentCheckBox: true });
            }
            this.setState({ id: JSON.parse(singleRepo)[0].id });
            this.setState({ name: JSON.parse(singleRepo)[0].name });
            this.setState({ status: JSON.parse(singleRepo)[0].status });
            this.setState({
              address: JSON.parse(singleRepo)[0].token.split(":")[1]
            });
            this.setState({
              tempwebaddress: JSON.parse(singleRepo)[0].token.split(":")[5]
            });
            this.setState({
              port: JSON.parse(singleRepo)[0].token.split(":")[4]
            });
            this.setState({
              description: JSON.parse(singleRepo)[0].description
            });
            this.setState({
              footer_message: JSON.parse(singleRepo)[0].footer_message
            });
            this.setState({
              cover_image: JSON.parse(singleRepo)[0].cover_image
            });
            this.setState({ showTerminal: JSON.parse(singleRepo)[0].terminal });
            if (JSON.parse(singleRepo)[0].token.split(":")[5] === "0.0.0.0") {
              this.setState({ deploymentBoxSelectedStatus: true });
            }
          }
        }
      })
      .then(() => {
        if (this.props.match.params.repoId) {
          getComponentDeployed(
            this.state.user_id,
            this.props.match.params.repoId,
            "input"
          ).then(inputComponentSeedData => {
            if (JSON.parse(inputComponentSeedData).length !== 0) {
              this.setState({ inputComponentStepperHighlight: true });
            }
          });
        }
      })
      .then(() => {
        if (this.props.match.params.repoId) {
          getComponentDeployed(
            this.state.user_id,
            this.props.match.params.repoId,
            "output"
          ).then(outputComponentSeedData => {
            if (JSON.parse(outputComponentSeedData).length !== 0) {
              this.setState({ outputComponentStepperHighlight: true });
            }
          });
        }
      })
      .then(() => {
        if (this.props.match.params.repoId) {
          getSinglePermalink(
            this.state.user_id,
            this.props.match.params.repoId
          ).then(data => {
            if (JSON.parse(data).text !== "Not Found") {
              this.setState({ permalinkObject: JSON.parse(data) });
            }
          });
        }
        let socket = this.socket;
        socket.send(
          JSON.stringify({
            event: "fetchCurrentPort"
          })
        );
        socket.send(
          JSON.stringify({
            event: "getPublicIPaddress"
          })
        );
        socket.onmessage = function(response) {
          let data = JSON.parse(response.data);
          const event = data.event;
          data = data.data;
          if (event === "fetchedCurrentPort") {
            this.setState({ currentPort: data });
          } else if (event === "gotPublicIP") {
            this.setState({ webappaddress: data }, () => {
              if (this.state.tempwebaddress.length === 0) {
                this.setState({ tempwebaddress: this.state.webappaddress });
              }
            });
            getWebAppStatus(data)
              .then(() => {})
              .catch(err => {
                this.setState({
                  webappUnreachableErrorText:
                    "This WebApp cannot be reached on it's public IP"
                });
              });
            this.toggleShow();
          }
        }.bind(this);
        this.setState({ showLocalDeploymentCheckBox: true });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.nonghDemoModel !== nextProps.nonghDemoModel) {
      this.setState({ nonghDemoModel: nextProps.nonghDemoModel });
    }
  }

  onLocalDeploymentCheckBoxCheck(e) {
    if (!this.state.deploymentBoxSelectedStatus) {
      getWebAppStatus(window.location.hostname)
        .then(() => {})
        .catch(err => {
          this.setState({
            webappLocalUnreachableErrorText: `This WebApp cannot be reached on ${
              window.location.host
            }`
          });
        });
    }
    let selectionPool = [window.location.host, this.state.webappaddress];
    this.setState({
      tempwebaddress:
        selectionPool[this.state.deploymentBoxSelectedStatus ? 1 : 0]
    });
    this.setState({
      deploymentBoxSelectedStatus: !this.state.deploymentBoxSelectedStatus
    });
  }

  updateDemoModelData() {
    if (!this.validateIP()) {
      this.setState({ addressErrorText: "Invalid IP address" });
    } else {
      this.setState({ addressErrorText: "" });
    }
    if (!this.validatePort(this.state.port)) {
      this.setState({ portErrorText: "Invalid port number" });
    } else {
      this.setState({ portErrorText: "" });
    }
    if (
      this.state.name.length === 0 ||
      /*eslint-disable*/
      /[~`!#$%\^&*+=\-\[\]\\';,/{}|":<>\?]/g.test(this.state.name)
      /*eslint-enable*/
    ) {
      this.setState({ nameErrorText: "Invalid Project Name" });
    } else {
      this.setState({ nameErrorText: "" });
    }
    if (
      this.state.name.length > 0 &&
      /*eslint-disable*/
      !/[~`!#$%\^&*+=\-\[\]\\';,/{}|":<>\?]/g.test(this.state.name) &&
      /*eslint-enable*/
      this.validateIP() &&
      this.validatePort(this.state.port)
    ) {
      let dataToPut = {
        name: this.state.name,
        id: this.state.id,
        user_id: this.state.user_id,
        address: this.state.address,
        description: this.state.description,
        footer_message: this.state.footer_message,
        cover_image: this.state.cover_image,
        terminal: this.state.showTerminal,
        timestamp: Date.now(),
        token: `nongh:${this.state.address}:${this.state.id}:${
          this.state.currentPort
        }:${this.state.port}:${this.state.tempwebaddress}`,
        status: this.state.status || "input"
      };
      this.props.nonghModelActions.addToDBNonGHDemoModel(dataToPut).then(() => {
        this.props.nonghModelActions
          .updateNonGHDemoModel(dataToPut)
          .then(() => {
            if (Object.keys(this.state.permalinkObject).length > 0) {
              const permaLinkDataToPut = Object.assign(
                {},
                this.state.permalinkObject,
                {
                  full_relative_url: `/ngh/user/${dataToPut.user_id}/${
                    dataToPut.name
                  }/${dataToPut.id}/demo`
                }
              );

              modifyPermalink(permaLinkDataToPut)
                .then(() => {
                  if (this.props.match.params.type === "modify") {
                    this.props.history.push("/ngh/user");
                  } else {
                    this.props.history.push(
                      `/ngh/user/${this.state.name}/${
                        this.state.id
                      }/inputcomponent`
                    );
                  }
                })
                .catch(err => {
                  toastr.error(
                    `Error occured in creating shortened URL: ${permaLinkDataToPut}`
                  );
                });
            } else {
              const permaLinkDataToPut = {
                short_relative_url: `/p/${Math.random()
                  .toString(36)
                  .substring(2, 11)}`,
                full_relative_url: `/ngh/user/${dataToPut.user_id}/${
                  dataToPut.name
                }/${dataToPut.id}/demo`,
                user_id: dataToPut.user_id,
                project_id: dataToPut.id
              };

              addPermalink(permaLinkDataToPut)
                .then(() => {
                  if (this.props.match.params.type === "modify") {
                    this.props.history.push("/ngh/user");
                  } else {
                    this.props.history.push(
                      `/ngh/user/${this.state.name}/${
                        this.state.id
                      }/inputcomponent`
                    );
                  }
                })
                .catch(err => {
                  toastr.error(
                    `Error occured in creating shortened URL: ${permaLinkDataToPut}`
                  );
                });
            }
          });
      });
    }
  }


  updateDescription(e) {
    this.setState({ description: e.target.value });
  }

  updatefooter_message(e) {
    this.setState({ footer_message: e.target.value });
  }

  updateAddress(e) {
    this.setState({ address: e.target.value });
  }

  updatePort(e) {
    this.setState({ port: e.target.value });
  }

  updateName(e) {
    this.setState({ name: e.target.value });
  }

  onDrop(files) {
    if (files[0].size > 5242880) {
      alert("File size should be < 5MB");
    } else {
      document.getElementById(
        "input-image-preview"
      ).src = window.URL.createObjectURL(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        const dataURI = reader.result;
        this.setState({ cover_image: dataURI });
      };
      reader.readAsDataURL(files[0]);
    }
  }

  toggleTerminal() {
    this.setState({ showTerminal: !this.state.showTerminal });
  }

  validateTempwebaddress() {
    if (
      this.state.webappUnreachableErrorText.length > 0 &&
      this.state.tempwebaddress === this.state.webappaddress
    ) {
      return false;
    }
    if (
      this.state.webappLocalUnreachableErrorText.length > 0 &&
      this.state.tempwebaddress === "0.0.0.0"
    ) {
      return false;
    }

    return true;
  }

  validateIP() {
    if (this.state.address.split(".").length <= 2) {
      return false;
    } else {
      return rangeCheck.validIp(this.state.address);
    }
  }

  validatePort(port) {
    function isNumeric(value) {
      return /^\d+$/.test(value);
    }

    if (isNumeric(port)) {
      const portNumber = parseInt(port);
      return !!(portNumber >= 1024 && portNumber <= 65535);
    } else {
      return false;
    }
  }

  toggleShow() {
    this.setState({
      showOutput: this.state.showOutput === "visible" ? "hidden" : "visible"
    });
  }

  getStyles() {
    return {
      layout: {
        background: "#FFFFFF"
      },
      content: {
        margin: "24px 0 0",
        overflow: "initial"
      },
      contentDiv: {
        padding: "12px 0",
        background: "#FFFFFF"
      },
      footer: {
        backgroundColor: grey900,
        color: "white",
        textAlign: "center",
        marginTop: "4vh",
        height: "4rem",
        zIndex: "2"
      },
      tag:{
        color:'#938E8E',
        paddingTop:'5px',
        fontFamily:'"Open Sans", "Helvetica", sans-serif',
        fontSize:'1.5em'

      },
      config:{
        borderStyle:'Solid',
        borderColor:'#498fff',
        color:'#6C6666',width:'100%',
        backgroundColor:'White',
        borderWidth:'2px',borderRadius:'30px'
      },
      txt:{
        fontFamily:'"Open Sans", "Helvetica", sans-serif',
        fontSize:'1em'
      },
      req:{
        color:'#514C4B',
        paddingTop:'5px',
        fontFamily:'"Open Sans", "Helvetica", sans-serif',
        fontSize:'1.5em'

      },
      active:{
        borderStyle:'Solid',
        borderColor:'#eaeaea',
        borderWidth:'2px',
        transition: '.3s ease',
        backfaceVisibility: 'hidden',
        opacity: '0.8'
      },
      btnactive:{
        borderStyle:'Solid',
        width:'100%',
        borderWidth:'2px',
        borderRadius:'30px',
        backgroundColor:'#443E3E',
        color:'White'
      },

      box:{
       flexGrow: "5.75",
        minWidth: "300px",
        padding:'30px', 

        
      }

    };
  }

  hover(e){

    this.setState({active:e});
    }
     btnEnter(e){
    console.log("btn enter =",e)
    this.setState({btnactive:e});
    }

         btnclicked(e){

    this.setState({btnclicked:e});
    }

    exit(){
      
    this.setState({active:0,btnactive:0});
    
  }

  helpDirect() {
    window.location= ORIGAMI_READ_THE_DOCS ;
  }

  render() {

    const { active } = this.state
    let tokenClassName =
      this.validateTempwebaddress() &&
      this.validateIP() &&
      this.validatePort(this.state.port)
        ? "ui positive message"
        : "ui negative message";
    let styles = this.getStyles();
    const content = (
      <div>
        <Header className="ui small">
          Know More 
        </Header>

      </div>
    )



  

    return (
      <Layout style={styles.layout}>
        {this.state.showOutput === "hidden" && (
          <div className="centered row" style={{ marginTop: "30vh" }}>
            <CircularProgress size={89.25} />
          </div>
        )}
        <Content style={styles.content}>
          <div style={styles.contentDiv}>
            <Row>
              <div
                style={{
                  visibility: this.state.showOutput,
                  width: "100%",
                  maxWidth: 700,
                  margin: "auto"
                }}
              >
                <Stepper linear={false}>
                  <Step active>
                    <StepLabel>
                      <b style={{ fontSize: "large" }}>Register Application</b>
                    </StepLabel>
                  </Step>
                  <Step active={this.state.inputComponentStepperHighlight}>
                    <StepLabel>Configure bundled code </StepLabel>
                  </Step>

                </Stepper>
              </div>
            </Row>
              <div
                className="sixteen wide column stretched"
                style={{ visibility: this.state.showOutput }}
              >
                <h1
                  style={{
                    textAlign: "center",
                    margin: "25px 0 40px"
                  }}
                >
                  Register Application
                </h1>

                </div>
                                <div
                  className="ui grid container"
                  style={{ position: "relative" }}
                >
                <div className="ui grid container" >

                    <div
                      className="column aligned"
                      style={styles.box}
                    >

                <a class="ui tag label large hvr-float " >Step 1 : Basic Details</a>
                <br/>
                         <div class="ui grid">
                         <div class="two wide column">
                         </div>
                 <div class="four wide column">
                      <TextField
                        hintText="MyApp"
                        floatingLabelText="Appname"
                        value={this.state.name}
                        errorText={this.state.nameErrorText}
                        onChange={this.updateName}
                      />
                      </div>
                      <div class="two wide column">
                      </div>
                 <div class="four wide column">
                      <TextField
                        hintText="Description"
                        floatingLabelText="Description"
                        value={this.state.description}
                        onChange={this.updateDescription}

                      />
                      </div>

                    </div>

                  <a className="ui tag label large" style={{marginTop:'50px'}}>Step 2 : Choose your Task</a>
                  <br/>
                  <br/>

                  <div className="ui grid">
                  <div className="two wide column">
                  </div>
                  <div className="twelve wide column">
                  <Card.Group itemsPerRow={4} >
                      <Card  onMouseEnter={this.hover.bind(this,1)} onMouseLeave={this.exit} style={this.state.active==1?styles.active:{}}
                      header='VQA' raised image={require('../../assets/VQ.png')} />  
                      <div className="two wide column"/>  
                      <Card onMouseEnter={this.hover.bind(this,2)} onMouseLeave={this.exit} style={this.state.active==2?styles.active:{}}  
                      header='Grad Cam' raised image={require('../../assets/grad.png')} />
                      <Card onMouseEnter={this.hover.bind(this,3)} onMouseLeave={this.exit} style={this.state.active==3?styles.active:{}}
                       header='Style Transfer' raised image={require('../../assets/style.jpg')} />
                      <Card onMouseEnter={this.hover.bind(this,4)} onMouseLeave={this.exit} style={this.state.active==4?styles.active:{}} 
                      header='Classification' raised image={require('../../assets/class.jpg')} />
                      
                    </Card.Group>
                  </div>
                  </div>

                  <a class="ui tag label large" style={{marginTop:'50px'}}>Step 3 : Select System Configuration</a>
                  <br/>
                  <br/>
                  <div className="ui grid">
                  <div className="one wide column">
                  </div>
                  <div className="one wide column" >
                  <text style={styles.tag}>OS  </text>
                  </div>
                  <div className="three wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,1)} onClick={this.btnclicked.bind(this,1)} onMouseLeave={this.exit}
                     style={this.state.btnactive==1||this.state.btnclicked==1?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        Linux
                        </text>
                    </Button>
                  </div>
                  <div className="three wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,2)} onClick={this.btnclicked.bind(this,2)} onMouseLeave={this.exit}
                     style={this.state.btnactive==2||this.state.btnclicked==2?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        MacOS
                        </text>
                    </Button>
                  </div>                  
                  <div className="three wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,3)} onClick={this.btnclicked.bind(this,3)} onMouseLeave={this.exit}
                     style={this.state.btnactive==3||this.state.btnclicked==3?styles.btnactive:styles.config}>
                        <text style={styles.txt}>
                        Windows
                        </text>
                    </Button>
                  </div>
                  </div> 

                                    <div className="ui grid">

                  <div className="two wide column" style={{paddingLeft:'50px'}}>
                  <h2 style={styles.tag}> Python </h2>
                  </div>
                  <div className="three wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,4)} onClick={this.btnclicked.bind(this,4)} onMouseLeave={this.exit}
                     style={this.state.btnactive==4||this.state.btnclicked==4?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        2.7
                        </text>
                    </Button>
                  </div>
                  <div className="three wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,5)} onClick={this.btnclicked.bind(this,5)} onMouseLeave={this.exit}
                     style={this.state.btnactive==5||this.state.btnclicked==5?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        3.5
                        </text>
                    </Button>
                  </div>                  
                  <div className="three wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,6)} onClick={this.btnclicked.bind(this,6)} onMouseLeave={this.exit}
                     style={this.state.btnactive==6||this.state.btnclicked==6?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        3.6
                        </text>
                    </Button>
                  </div>
                  </div>


                    <div className="ui grid">

                  <div className="two wide column" style={{paddingLeft:'50px'}}>
                  <h2 style={styles.tag}>  CUDA </h2>
                  </div>
                  <div className="two wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,7)} onClick={this.btnclicked.bind(this,7)} onMouseLeave={this.exit}
                     style={this.state.btnactive==7||this.state.btnclicked==7?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        8
                        </text>
                    </Button>
                  </div>
                  <div className="two wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,8)} onClick={this.btnclicked.bind(this,8)} onMouseLeave={this.exit}
                     style={this.state.btnactive==8||this.state.btnclicked==8?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        9
                        </text>
                    </Button>
                  </div>                  
                  <div className="two wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,9)} onClick={this.btnclicked.bind(this,9)} onMouseLeave={this.exit}
                     style={this.state.btnactive==9||this.state.btnclicked==9?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        9.1
                        </text>
                    </Button>
                  </div>
                  <div className="two wide column" >
                    <Button onMouseEnter={this.btnEnter.bind(this,10)} onClick={this.btnclicked.bind(this,10)} onMouseLeave={this.exit}
                     style={this.state.btnactive==10||this.state.btnclicked==10?styles.btnactive:styles.config} >
                        <text style={styles.txt}>
                        None
                        </text>
                    </Button>
                  </div>
                  </div>
          

                  <a className="ui tag label large" style={{marginTop:'50px'}}>Step 4 (optional) : Upload cover Image </a>
                                            <br/>
                  <br/>
                  <div className="ui grid">
                  <div className="one wide column"/>
                  <div className="seven wide column">
                  <div
                        className=""
                        style={{ cursor: "pointer", maxWidth: "50%" }}
                      >
                        <Dropzone
                          onDrop={this.onDrop}
                          multiple={false}
                          style={{ height: "inherit" }}
                        >
                          <div className="ui card">
                            <div className="ui fluid image">
                              <img
                                className="ui fluid medium bordered image"
                                src={
                                  this.state.cover_image ||
                                  "/static/img/wireframe.png"
                                }
                                id={"input-image-preview"}
                              />
                            </div>
                            <div className="content">
                              Drag and Drop or Click to upload cover image
                            </div>
                          </div>
                        </Dropzone>
                      </div>
                  </div>
                  </div>

  
              <div className="ui grid">
               <div className="three wide column" />
               <div className="three wide column" >
                    <Button style={styles.config} >
                        <text style={styles.txt}>
                        Reset
                        </text>
                  </Button>
                </div>

              <div className="two wide column" />
              <div className="three wide column">
                  <Button primary style={styles.config}  >
                        <text style={styles.txt}>
                        Submit
                        </text>
                  </Button>
              </div>

              </div>


                             







                    </div>

                </div>
                </div>
              </div>
        </Content>
        
      </Layout>
    );
  }
}

RegisterPage.propTypes = {
  login: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  nonghDemoModel: PropTypes.object.isRequired,
  nonghModelActions: PropTypes.object.isRequired
};

RegisterPage.contextTypes = {
  socket: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    login: state.login,
    user: state.user,
    nonghDemoModel: state.nonghDemoModel
  };
}

function mapDispatchToProps(dispatch) {
  return {
    nonghModelActions: bindActionCreators(nonghDemoModelActions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
);
