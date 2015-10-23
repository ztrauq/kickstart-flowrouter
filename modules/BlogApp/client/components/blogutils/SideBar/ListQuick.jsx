import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import ReactIntl from 'react-intl'
import { Blog } from 'BlogApp/collections/Blog';
import 'BlogApp/blog-methods.js';

@ReactMixin.decorate(ReactMeteorData)
export default class ListQuick extends Component {

  constructor(props) {
    super(props);
    this.state = {blog: []};
  }

  componentWillMount () {
    const self = this;
    Meteor.call('quicklist', function (err, res) {
      if (err) return console.log(err) // handle this error

      self.state.blog = res;
    })
  }


  getMeteorData() {
    /*Meteor.subscribe('blog',Session.get('blogSubFilter'));
    let query = {quicklist: true};
    var blog = Blog.find(query).fetch();*/
    return {
      //blog
    };
  }

  render () {

    const items = this.state.blog.map(function(item, i){
      return <QuickListItems data={item} key={i}/>
    });
    return (
      <div className="ui">
        <h4 className="ui top attached header">
          <i className="bookmark icon" />
          <div className="content">
            Quick List
          </div>
        </h4>

        <div className="ui attached basic segment">
          <p>A list of posts we've bookmarked as we think they're useful reading.</p>
        </div>
        <div className="ui attached segment">
          <div className="ui list">
            {items}
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
})