import React, { Component } from 'react';
import PropTypes from 'prop-types';
import userApi from "../../api/Github/userApi";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

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
      this.setState({ username:username,name:name,email:email,bio:bio,company:company,avatar:avatar });
})

  }




render(){
return(

<div className="container">
			<div className="profile-sidebar">
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
				<div className="profile-userbuttons">
					<button type="button" className="btn btn-success btn-sm">Follow</button>
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

					</ul>
				</div>

			</div>
		</div>



);
}

}

export default Profile;