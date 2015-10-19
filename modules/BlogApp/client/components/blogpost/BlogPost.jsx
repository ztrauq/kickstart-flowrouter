import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { Blog } from 'BlogApp/collections/Blog';

@ReactMixin.decorate(ReactMeteorData)
export default class BlogPost extends Component {

  getMeteorData() {
    Meteor.subscribe('blog');
    const query = {slug: this.props.params.slug};
    const blog = Blog.findOne(query)
    return {
      blog
    };
  }

  render() {
    const contenteditable = ''
    return (
      <section class="blog-post">
        <header>
          <h1 class="ui header" id="title" >{this.data.blog.title}</h1>
          <h3 id="summary">{this.data.blog.summary}</h3>
          <div class="info">posted by
            <span id="author" class="author" > inline author</span>
            <time id="date">{ this.data.blog.date}</time>
          </div>

          <div class="ui divider"></div>
        </header>
        <article id="content"  data-markdown="true">
          {this.data.blog.content}
        </article>

      </section>
    );
  }
}