import { Component, PropTypes } from 'react';
//import BlazeToReact from 'blaze-to-react';
import ReactMixin from 'react-mixin';
//import ReactMeteorData from 'react-meteor-data';
import ReactIntl from 'react-intl'
//import { Link } from 'react-router'
import { Tags } from 'BlogApp/collections/Blog.js';
import 'BlogApp/blog-methods.js';

@ReactMixin.decorate(ReactMeteorData)
export default class CardTags extends Component {

  getMeteorData() {
    Meteor.subscribe('tags', this.props._id);
    let query = {posts: this.props._id};
    let tags = Tags.find(query).fetch();
    return {
      tags
    };
  }

  render() {
    let tags = this.data.tags.map(function(tag, i){
      return <Tag data={tag} key={i}/>
    });
    return (
      <div className="ui mini yellow labels">
        {tags}
      </div>
    );
  }
}

const Tag = React.createClass({
  render: function(){
    return (
      <div className="ui label">
        {this.props.data.tag}
      </div>
      )
  }
});