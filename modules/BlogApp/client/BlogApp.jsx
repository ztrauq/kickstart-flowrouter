import { Component, PropTypes } from 'react';
import BlogMain from './BlogMain'

export default class BlogApp extends Component {
  /*static propTypes = {
    children: PropTypes.any.isRequired
  }*/
/*  setAppState (key, value) {
    //this should give
    let App = this.state.App
    App[key] = value;
    this.setState({App: App})
  }*/

  componentWillMount() {
    require('./css/main.scss');
    require('./css/blog.scss');
    require('./css/github.min.css');

    //this.setState({App: {set: setAppState}});
  }

  render() {
    return (
      <div>
        <BlogMain content={ this.props.content } aside={ this.props.aside } />
      </div>
    );
  }
}
