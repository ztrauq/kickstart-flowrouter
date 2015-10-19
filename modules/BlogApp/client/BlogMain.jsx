import { Component } from 'react';
import ReactMixin from 'react-mixin';
//import ReactMeteorData from 'react-meteor-data';

import Grid from './layout/grid/grid.jsx';
//import BlogList from './components/BlogList';

//import Tasks from 'BlogApp/collections/Tasks';

@ReactMixin.decorate(ReactMeteorData)
export default class BlogMain extends Component {

  getMeteorData() {

    return {

    };
  }

  render() {
    /*if (!this.data.tasks) {
      // loading
      return null;
    }*/
    let preview = "0.7.1";
    return (
        <div className="container" data-preview={preview}>
          <Grid content={ this.props.content } aside={ this.props.aside }  />
        </div>
    );
  }
};
