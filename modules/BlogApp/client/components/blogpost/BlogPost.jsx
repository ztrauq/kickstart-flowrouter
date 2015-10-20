/* todo - this needs some work on the structure, it's quite messy */

import { Component, PropTypes } from 'react';
//import ReactMarkdown from 'react-markdown';
import Markdown from 'react-remarkable'
import ReactMixin from 'react-mixin';
import { Blog } from 'BlogApp/collections/Blog';

@ReactMixin.decorate(ReactMeteorData)
export default class BlogPost extends Component {

  componentWillMount() {
    require('BlogApp/client/css/github.min.css');
  }

  getMeteorData() {
    Meteor.subscribe('blog');
    const query = {slug: this.props.params.slug};
    const blog = Blog.findOne(query)
    return {
      blog
    };
  }

  render() {
    let blog = this.data.blog ?
      this.data.blog :
      {content: 'loading'};
    return (
      <PostLayout blog={blog} />
    );
  }
}

const Loading = React.createClass({
  render: function () {
    return (
      <div>
        ...
      </div>
    )
  }
});

const PostLayout = React.createClass({
  getInitialState: function () {
    return {view: 'preview'}
  },
  toggleButtonClass : function () {
    const view = this.state.view === 'preview' ? 'edit' : 'preview';
    this.setState({view: view});
  },
  render: function () {
    const contentEditable = this.state.view !== 'preview';
    const postControl = Meteor.user() && (Meteor.userId() === this.props.blog.author) ?
      <PostControl
        toggleButtonClass={this.toggleButtonClass}
        view={this.state.view}
      /> :
      <var value="null" className="empty space" />;
    return (
      <section className="blog-post">
        {postControl}
        <PostPreview blog={this.props.blog} contentEditable={contentEditable} />
      </section>
    )
  }
});

const PostControl = React.createClass({
  render : function () {
    const previewClassName = this.props.view === 'preview' ? 'ui orange button' : 'ui button';
    const editClassName = this.props.view === 'edit' ? 'ui orange button' : 'ui button';
    return (
      <div className="ui basic segment">
        <button className={previewClassName} onClick={this.props.toggleButtonClass}>
          Preview
        </button>
        <button className={editClassName} onClick={this.props.toggleButtonClass}>
          Edit
        </button>
      </div>
    )
  }
});

const PostPreview = React.createClass({
  getInitialState: function () {
    return null
  },
  highlightCodeBlocks: function() {

    var elements = document.querySelectorAll('pre code');
    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].classList.contains('hljs')) {
        hljs.highlightBlock(elements[i]);
      }
    }
  },

  componentDidMount: function() {
    this.highlightCodeBlocks();
  },

  componentDidUpdate: function() {
    this.highlightCodeBlocks();
  },
  render : function () {
    const contentEditable = this.props.contentEditable ? 'contenteditable' : false;
    const content = contentEditable ?
      <EditForm  blog={this.props.blog} change={this.updateContent}
          contentEditable={this.props.contentEditable}/> :
      <DisplayPost blog={this.props.blog} />

    return (
      <div>
        {content}
      </div>
    )
  }
});

const EditForm = React.createClass({
  updateBlog: function () {
    if(event.type==='blur' || (event.type==='keyup' && event.keyCode===13 ) ){
      check(event.target.innerText, String);
      this.props.blog[event.target.dataset.field] = event.target.innerText;
      Meteor.call('upsertBlog',this.props.blog);
      event.target.blur();
    }

  },
  updateBlogTitle: function () {
    if(event.type==='blur' || (event.type==='keyup' && event.keyCode===13 ) ){
      check(event.target.innerText, String);
      this.props.blog.title = event.target.innerText;

      Meteor.call('upsertBlog',this.props.blog, function(err,res){
        FlowRouter.redirect('/post/'+res.slug)
      });
      event.target.blur();
    }
  },
  updateContent: function () {
    this.props.blog.content = event.target.value;
    Meteor.call('upsertBlog',this.props.blog)
  },
  render : function () {
    const rows = (this.props.blog.content).split(/\r\n|\r|\n/).length
    return (
      <div>
        <header>
          <h1 className="ui header" data-field="title"
              contentEditable={true}
              onBlur={this.updateBlogTitle}
              onKeyUp={this.updateBlogTitle}>{this.props.blog.title}</h1>
          <h3 className="ui header" data-field="summary"
              contentEditable={true}
              onBlur={this.updateBlog}
              onKeyUp={this.updateBlog}>{this.props.blog.summary}</h3>
          <div className="info">posted by
            <span id="author" className="author" > inline author</span>
            <time id="date">{ this.props.blog.date}</time>
          </div>
          <div className="ui divider"></div>
        </header>
        <article>
          <div className="ui form">
            <div className="field">
              <textarea rows={rows} defaultValue={this.props.blog.content} onChange={this.updateContent} />
            </div>
          </div>
        </article>
      </div>

    )
  }
});

const DisplayPost = React.createClass({

  render : function () {
    return (
      <div>
        <header>
          <h1 className="ui header" id="title"
              onChange={this.updateBlog}
              onClick={this.thisClick}>{this.props.blog.title}</h1>
          <h3 className="ui header" id="title" >{this.props.blog.summary}</h3>
          <div className="info">posted by
            <span id="author" className="author" > inline author</span>
            <time id="date">{ this.props.blog.date}</time>
          </div>
          <div className="ui divider"></div>
        </header>
        <article className="content">
          <Markdown source={this.props.blog.content} />
        </article>
      </div>

    )
  }
});

