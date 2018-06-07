import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import userApi from "../../api/Github/userApi";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { BounceLoader } from "react-spinners";
import { Link, withRouter } from "react-router-dom";

class Profile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username:"",
      name:"",
      email:"",
      bio:"",
      company:"",
      avatar:"",
      github:"",
      demoLoading: true
    };
}


  componentWillMount() {
  	userApi.userProfile().then(user => {
  	user = JSON.parse(user);
      let username=user["login"]
      let name=user["name"]
      let email=user["email"]
      let bio=user["bio"]
      let company=user["company"]
      let avatar=user["avatar_url"]
      let github=user["html_url"]
      this.setState({ username:username,name:name,email:email,bio:bio,company:company,avatar:avatar,github:github,demoLoading:false });
})
}
  	

   componentWillReceiveProps(nextProps) {
   	this.setState({demoLoading:true});
  	let uname=nextProps.user;
  	userApi.userProfileFromName(uname).then(user => {
  	user = JSON.parse(user);
      let username=user["login"]
      let name=user["name"]
      let email=user["email"]
      let bio=user["bio"]
      let company=user["company"]
      let avatar=user["avatar_url"]
      let github=user["html_url"]
      this.setState({ username:username,name:name,email:email,bio:bio,company:company,avatar:avatar,github:github,demoLoading:false });

  })
  }


  




render(){
const demoSpinnerStyle = {
  position: "fixed",
  top: "50%",
  left: "100%"
};

return(

<div className="container">
			<div className="profile-sidebar">
			           {this.state.demoLoading ? (
              <div className="demoSpinner" style={demoSpinnerStyle}>
                <BounceLoader color={"#33aadd"} size={80} />
              </div>
            ) : (
            <div>
				<div className="profile-userpic">
					<img src={this.state.avatar} class="img-responsive" alt=""/>
				</div>
				<div className="profile-usertitle">
					<div className="profile-usertitle-name">
						{this.state.name} 
					</div>
					<div className="profile-usertitle-job">
						{this.state.username} 
					</div>
				</div>

				<div className="btn-group" style={{marginLeft:30}}>
				  <a href="#" className="btn btn-primary">Demo Count</a>
				  <a href="#" className="btn btn-success">42</a>
				</div>



								<div className="profile-usermenu">
					<ul className="nav">
						<li >
						<a href="#">
							<i className="glyphicon glyphicon-envelope"></i>
							<span style={{float:'right'}}>{this.state.email}</span></a>
						</li>
						<li>
							<a href="#">
							<i className="glyphicon glyphicon-user"></i>
							{this.state.company} </a>
						</li>
						<li>
							<a href={this.state.github}>
							<i class="fab fa-github"></i>
							Github Profile </a>
						</li>

					</ul>
				</div>
			</div>
				)};
			</div>
		</div>



);
}

}


function mapStateToProps(state) {
  return {
    user:state.activeUser
  };
}

export default withRouter(
  connect(mapStateToProps)(Profile)
);

