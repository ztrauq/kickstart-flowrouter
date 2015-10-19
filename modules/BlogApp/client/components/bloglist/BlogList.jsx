import { Component, PropTypes } from 'react';
//import BlazeToReact from 'blaze-to-react';
import ReactMixin from 'react-mixin';
//import ReactMeteorData from 'react-meteor-data';
import ReactIntl from 'react-intl'
//import { Link } from 'react-router'
import { Blog } from 'BlogApp/collections/Blog';
import 'BlogApp/blog-methods.js';
import PostControls from '../blogutils/BlogControls.jsx';
import CardTags from './CardTags.jsx';
import BlogPostAuthor from '../blogutils/BlogPostAuthor.jsx';

@ReactMixin.decorate(ReactMeteorData)
export default class BlogList extends Component {

  constructor () {
    super();
    this.state = { path: FlowRouter.current().path };
  }

  componentWillReceiveProps () {
    this.setState({ path: FlowRouter.current().path });
  }

  getMeteorData() {
    Meteor.subscribe('blog');
    const path = this.state.path;
    const query = path ==='/' ? {archived: false} : {archived: true};
    const options = {sort: Meteor.settings.public.blog.sortBy};
    const blog = Blog.find(query,options).fetch();
    return {
      query, blog
    };
  }

  render() {
    const archived = this.data.query.archived;
    const route = {
      url: !archived ? 'archive' : '',
      text: !archived ? 'List' : 'Archive',
      next: archived ? 'List' : 'Archive'
    };
    const blogcontrol = Meteor.user() ? <BlogListControl route = {route} /> : <br/>;
    return (
      <section>
        <BlogListHeader  route = {route} />
        {blogcontrol}
        <PostsList posts={this.data.blog}/>
      </section>
    );
  }
}

const BlogListHeader = React.createClass({
  render: function(){
    return (
      <div>
        <h2 className="ui header">
          <i className="newspaper icon" />
          <div className="content">
            Blog {this.props.route.text}
          </div>
        </h2>

      </div>

    )
  }
})

const BlogListControl = React.createClass({
  changeRoute: function () {
    FlowRouter.go('/' + this.props.route.url)
  },
  render: function(){
    return (
      <div className="ui basic segment">
        <div id="mdblog-new" className="ui labeled icon button">
          <i className="red edit icon" /> New Post
        </div>
        <div id="mdblog-toggleArchive"
             className="ui right labeled icon button"
              onClick={this.changeRoute} >
          <i className="red right arrow icon" />
          Go to {this.props.route.next}
        </div>
      </div>
      )
  }
})

const PostsList = React.createClass({
  render: function(){
    const posts = this.props.posts.map(function(post, i){
      return <Post data={post} key={i}/>
    });
    return (
      <div className="ui three cards">{posts}</div>
    )
  }
})

const Post = React.createClass({
  getInitialState : function () {
    return {data: this.props.data};
  },
  componentWillReceiveProps : function (nextProps) {
    this.setState(nextProps);
  },
  render: function(){

    const FormattedRelative = ReactIntl.FormattedRelative;
    const path = "post/" + this.props.data.slug ;//+ "?slug=" + this.props.data.slug;
    const postControl = Meteor.user() ?
      <PostControls data={this.props.data} /> :
      <var className="empty space" value="null"/>
    return (
      <div className="ui card enter">
        {postControl}
        <div className="content">
          {/*<a href={path} className="header">{this.props.data.title}</a>*/}
          <a href={path} className="header">{this.props.data.title}</a>
          <div className="meta">
              <span className="category">
                  <span className="info">
                      <time>
                        <FormattedRelative value={this.props.data.date} />
                        </time>
                  </span>
              </span>
          </div>
          <div className="description">
            <p>{this.props.data.summary} </p>
          </div>
        </div>
        <div className="content">
          <CardTags _id={this.props.data.shortId} />
        </div>
        <div className="extra content">
          <BlogPostAuthor _id={this.props.data.author} />
        </div>
        <a  href={path}>
          <div className="ui red bottom attached button">
            <i className="chevron circle right icon" /> read more
          </div>
          </a>
      </div>
    )
  }
});


