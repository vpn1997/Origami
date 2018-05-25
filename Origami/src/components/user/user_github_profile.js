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
  	console.log("user aya =");
  	user = JSON.parse(user);
  	console.log(user.login);
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
console.log("name =");
console.log(this.state.name)
console.log(this.state.avatar)
return(
	<div>
<img className="img-avatar" src={this.state.avatar} alt="admin@bootstrapmaster.com"></img>
<List>
<ListItem>Name :  {this.state.name}</ListItem>
<ListItem>username :  {this.state.username}</ListItem>
<ListItem>email :  {this.state.email}</ListItem>
<ListItem>bio :  {this.state.bio}</ListItem>

</List>
</div>
);
}

}

export default Profile;