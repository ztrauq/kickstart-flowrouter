import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import ReactIntl from 'react-intl'
import { Blog } from 'BlogApp/collections/Blog';
import 'BlogApp/blog-methods.js';
import PostControls from '../BlogControls.jsx';
import ListQuick from './ListQuick.jsx';
import ListSearch from './ListSearch.jsx';
import ListTags from './ListTags.jsx';

@ReactMixin.decorate(ReactMeteorData)
export default class SideBar extends Component {

  getMeteorData() {
    Meteor.subscribe('blog', Session.get('blogSubFilter'));
    let query = this.props.pathname === '/' ? {archived: false} : {archived: true}
    var blog = Blog.find(query).fetch()
    return {
      blog
    };
  }


  render() {
    const sidebar = this.props.isPost ? <Post /> : <List />;
    return (
    <div className="four wide column garry">
      {sidebar}
    </div>

    );
  }
}

const List = React.createClass({
  render: function () {
    return (
      <div className="ui sticky">
        <ListQuick />
        <div className="ui hidden divider"></div>
        <ListSearch />
        <div className="ui hidden divider"></div>
        <ListTags />
      </div>


    )
  }
});



const Post = React.createClass({
  render: function () {
    return (
      <h3>POST</h3>
    )
  }
});