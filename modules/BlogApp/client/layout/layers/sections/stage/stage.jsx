import { Component, PropTypes } from 'react';
//import BlazeToReact from 'blaze-to-react';
//import BlogList from 'BlogApp/client/components/bloglist/BlogList';

//const MaevBlogColumn = BlazeToReact('blogColumn')
//const MaevBlog = BlazeToReact('BlogList');
export default class Stage extends Component {

  render() {

    return (
      <div className="ui grid">
        <div className="sixteen wide column">
          <div className="ui basic segment">
            <div id="context" className="ui grid">
              <div className="row">
                <div className="one wide column">
                </div>
                <div className="ten wide column">
                  <div className="ui segment">
                    {this.props.content}
                  </div>
                </div>
                <div className="four wide column">
                  <div className="ui sticky">
                    <h3>{this.props.aside}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
