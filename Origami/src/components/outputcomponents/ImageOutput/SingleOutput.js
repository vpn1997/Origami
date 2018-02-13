/*eslint-disable react/forbid-prop-types */
import React from "react";
import { PropTypes } from "prop-types";
import LinearProgress from "material-ui/LinearProgress";
import Dialog from "material-ui/Dialog";

class singleOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.showImageFull = this.showImageFull.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  showImageFull() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    console.log("props aayega singel image pr");
    console.log(this.props);
    if(this.props.data)
      console.log("true");

    const height=(this.props.calling_context=="demo2")?("50%"):("100%");
    const width=(this.props.calling_context=="demo2")?("35%"):("75%");
    return (
      <div
        className="ui card centered origami-demo-output-image-component"
        style={{ height: height, width: width }}
        id={`output-text-${this.props.index}`}
      >
        <div className="content">
          <div className="header">
            {typeof this.props.header == "object"
              ? this.props.header["label"]
              : this.props.header}
          </div>
        </div>
        <div className="content">
          <div className="ui small feed">
            <div className="event">
              <div className="content">
                <div className="center aligned summary">
                  {this.props.data.length ? (
                    <img
                      className="ui centered center aligned fluid large image origami-demo-output-image"
                      style={{ cursor: "pointer" }}
                      src={this.props.data}
                      onClick={this.showImageFull}
                    />
                  ) : (
                    <LinearProgress mode="indeterminate" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          title={
            typeof this.props.header == "object"
              ? this.props.header["label"]
              : this.props.header
          }
          modal={false}
          open={this.state.open}
          autoScrollBodyContent
          onRequestClose={this.handleClose}
        >
          <div className="ui blue segment row">
            <img
              className="ui centered center aligned fluid large image"
              src={this.props.data}
              style={{ width: "100%" }}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

singleOutput.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.any,
};

export default singleOutput;
