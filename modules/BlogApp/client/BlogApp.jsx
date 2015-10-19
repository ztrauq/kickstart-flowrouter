import { Component, PropTypes } from 'react';
import BlogMain from './BlogMain'

export default class BlogApp extends Component {
  /*static propTypes = {
    children: PropTypes.any.isRequired
  }*/

  componentWillMount() {
    require('./css/main.scss');
    require('./css/blog.scss');
  }

  render() {
    return (
      <div>
        <BlogMain content={ this.props.content } aside={ this.props.aside } />
      </div>
    );
  }
}
