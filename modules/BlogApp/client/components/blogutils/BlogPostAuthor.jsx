import { Component, PropTypes } from 'react';
//import BlazeToReact from 'blaze-to-react';
import ReactMixin from 'react-mixin';
//import ReactMeteorData from 'react-meteor-data';
import ReactIntl from 'react-intl'
//import { Link } from 'react-router'
import { Users } from 'BlogApp/collections/Blog.js';
import 'BlogApp/blog-methods.js';

@ReactMixin.decorate(ReactMeteorData)
export default class BlogPostAuthor extends Component {

  getMeteorData() {
    Meteor.subscribe('userProfiles');
    let query = {_id: this.props._id};
    //console.log('jk', this.props._id, query)
    var user = Users.findOne(query);
    return {
      user
    };
  }

  render() {
    //let username = this.data.user.username;
    //console.log(username, this.data.user.username)
    return (
      <Author author={this.data.user} />
    );
  }
}

const Author = React.createClass({
  render: function(){
    let profile = this.props.author ?
      this.props.author.profile :
      {fullname: null, avatar: null};

    return (
      <div className="right floated author">
        <span className="author">{profile.fullname} </span>
        <img className="ui avatar image" src={profile.avatar} />
    </div>
    )
  }
});