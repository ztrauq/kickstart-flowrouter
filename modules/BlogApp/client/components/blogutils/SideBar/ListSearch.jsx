import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import ReactIntl from 'react-intl'
import { Blog } from 'BlogApp/collections/Blog';
import 'BlogApp/blog-methods.js';

@ReactMixin.decorate(ReactMeteorData)
export default class ListSearch extends Component {

  getMeteorData() {
    Meteor.subscribe('blog',Session.get('blogSubFilter'));
    let query = {quicklist: true};
    var blog = Blog.find(query).fetch();
    return {
      blog
    };
  }

  search() {
    const value = event.target.value;
    const filter = value.length > 0 ? {type: 'search', str: value} : null;
    Session.set('blogSubFilter', filter);
  }

  render () {
    const items = this.data.blog.map(function(item, i){
      return <QuickListItems data={item} key={i}/>
    });
    return (
      <div>
        <h4 className="ui top attached header">
          <i className="search icon" />
          <div className="content">
            Quick List
          </div>
        </h4>
        <div className="ui attached segment">
          <div className="ui fluid icon input">
            <input id="blogSearch" type="text" placeholder="Search..."
              onChange={this.search}/>
              <i className="search icon" />
          </div>
        </div>
      </div>
    )
  }
};

const QuickListItems = React.createClass({
  render: function () {
    const path = "/post/" + this.props.data.slug ;
    return (
      <a className="item" href={path}>
        <div className="header">{this.props.data.title}</div>
        <div className="description">{this.props.data.summary}</div>
      </a>
    )
  }
});