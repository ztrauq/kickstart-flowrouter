import { Component, PropTypes } from 'react';
//import BlazeToReact from 'blaze-to-react';
//import ReactMixin from 'react-mixin';
//import ReactMeteorData from 'react-meteor-data';
//import ReactIntl from 'react-intl'
//import { Link } from 'react-router'
import { Blog } from 'BlogApp/collections/Blog';
import 'BlogApp/blog-methods.js';

export default class PostControls extends Component {
//const PostControls = React.createClass({
  render () {
     return (
       <CardManager data={this.props.data} />
     )
  }
};

const CardManager = React.createClass({
  render : function () {
    const isBlogAuthor = Meteor.userId() === this.props.data.author;
    let cardController = isBlogAuthor ?
      <CardControl data={this.props.data} /> :
      <NullComponent />;
    return (
      <div>
        {cardController}
      </div>

    )
  }
})

const NullComponent = React.createClass({
  render : function () {
    return (
      <span> </span>
    )
  }
});

const CardControl = React.createClass({
  render: function () {
    let isPublished = this.props.data.published ? 'green' : 'blue';
    let className = "ui " + isPublished + " top attached button";
    return (
      <div className={className}>
        <section className="blog-controls">
          <div className="ui compact icon menu">
            <PostPublished data={this.props.data} />
            <PostArchived data={this.props.data} />
            <PostDelete data={this.props.data} />
          </div>
        </section>
      </div>
    )
  }
});

const PostModified = React.createClass({
  render : function () {
    return (
      <a className="item" data-content="Save changes to this post" onClick={this.update}>
        <i id="mdblog-save" className="right floated large save icon" />
      </a>
    )
  }
});

const PostPublished = React.createClass({
  getInitialState : function () {
    return {published: this.props.data.published}
  },
  publish : function () {
    this.props.data.published = this.state.published;
    if (this.state.published) this.props.data.archived = false;
    Meteor.call('upsertBlog', this.props.data);
  },
  toggle : function () {
    let action = this.state.published ? 'unpublish' : 'publish';
    let userIsSure = confirm("Are you sure you want to " + action);
    if(userIsSure) {
      this.setState({published: !this.state.published}, this.publish);
    }
  },
  render : function () {
    let props =  this.state.published ?
    {
      className: "right floated large stop icon",
      tip: "Stop publishing this post"
    } :
    {
      className: "right floated large play icon",
      tip: "Start publishing this post"
    };
    return (
      <a className="item" data-content={props.tip} onClick={this.toggle}>
        <i className={props.className} />
      </a>
    )
  }
});

const PostArchived = React.createClass({
  getInitialState : function () {
    return {archived: this.props.data.archived}
  },
  archive : function () {
    this.props.data.archived = this.state.archived;
    if (this.state.archived) this.props.data.published = false;
    Meteor.call('upsertBlog', this.props.data);
  },
  toggle : function () {
    let action = this.state.archived ? 'restore' : 'archive';
    let userIsSure = confirm("Are you sure you want to " + action);
    if(userIsSure) {
      this.setState({archived: !this.state.archived}, this.archive);
    }
  },
  render : function () {
    let props =  this.props.data.archived ?
    {
      className: "right floated large hide icon",
      tip: "Move this post to the archive"
    } :
    {
      className: "right floated large unhide icon",
      tip: "Unarchive this post"
    }
    return (
      <a className="item" data-content={props.tip} onClick={this.toggle} >
        <i className={props.className} />
      </a>
    )
  }
});

const PostDelete = React.createClass({
  getInitialState : function () {
    return {archived: this.props.data.archived}
  },
  delete : function () {
    let confirmed = prompt("Are you sure you want to delete this post?\n\n type YES to confirm");
    if(confirmed === 'YES') {
      Meteor.call('deleteBlog', this.props.data);
    }
  },
  render : function () {
    return (
      <a className="item" data-content="Delete this post" onClick={this.delete}>
        <i className="right floated large trash icon" />
      </a>
    )
  }
});

