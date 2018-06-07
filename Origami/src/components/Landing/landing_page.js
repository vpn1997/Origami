import React from "react";
import { PropTypes } from "prop-types";
import { Link, withRouter } from "react-router-dom";
import {
  Layout,
  Menu,
  Icon,
  Button,
  Card,
  Row,
  Col,
  Input,
  Select,
  Modal
} from "antd"
const { Header, Content, Footer } = Layout;

class LandingPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    }

      render() {
    return (
      <Layout style={{ background: "#FEFEFE" }}>
  <Header style={{ background: "Black" }}>
  </Header>
  </Layout>
  );
}
}
export default LandingPage;
