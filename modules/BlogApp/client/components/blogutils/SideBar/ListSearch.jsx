import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import ReactIntl from 'react-intl'
import { Blog } from 'BlogApp/collections/Blog';
import 'BlogApp/blog-methods.js';

@ReactMixin.decorate(ReactMeteorData)
export default class ListSearch extends Component {

  constructor() {
    super();
    //this.state = {value: ''};
  }

  getMeteorData () {
    Meteor.subscribe('blog',Session.get('blogSubFilter'));
    let query = {quicklist: true};
    var blog = Blog.find(query).fetch();
    return {
      blog
    };
  }

  search () {
    const value = event.target.value;
    this.setState({value: value})
    const filter = value.length > 0 ? {type: 'search', str: value} : null;
    Session.set('blogSubFilter', filter);
  }

  clearSearch () {
    //this.setState({value: ''})
    Session.set('blogSubFilter', null);
  }

  render () {
    console.log(this.state.value)
    const filter = Session.get('blogSubFilter');
    const value = filter ? filter.str : '';
    const items = this.data.blog.map(function(item, i){
      return <QuickListItems data={item} key={i}/>
    });
    return (
      <div>
        <h4 className="ui top attached header">
          <i className="search icon" />
          <div className="content">
            Search
          </div>
        </h4>
        <div className="ui attached segment">
          <div className="ui fluid action input">
            <input value={value} id="blogSearch" type="text" placeholder="Search..."
              onChange={this.search}/>
            <button className="ui icon button" onClick={this.clearSearch}>
              <i className="remove icon" />
            </button>
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