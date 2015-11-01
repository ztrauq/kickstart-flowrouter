/*
todo -
  add functionality to search
  - currently only single pattern so could add
  -- keyword
  -- phrase
  -- etc
 */

import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import ReactIntl from 'react-intl'
import { Tags } from 'BlogApp/collections/Blog';
import 'BlogApp/blog-methods.js';

@ReactMixin.decorate(ReactMeteorData)
export default class ListTags extends Component {

  constructor() {
    super();
    //this.state = {value: ''};
  }

  getMeteorData () {
    Meteor.subscribe('tags')
    const tags = Tags.find({},{sort: {count: -1, tag: 1}, limit: 20 }).fetch();
    return {
      tags
    };
  }


  render () {
    console.log(this.data.tags)
    const tags = this.data.tags.map(function(tag, i){
      return <TagItem data={tag} key={i} initialSelected={false}/>
    });
    return (
      <div>
        <h4 className="ui top attached white inverted header">
          <i className="tags icon" />
          <div className="content">
            Tags
          </div>
        </h4>
        <div className="ui attached basic segment">
          <p>A standard tagging feature to allow you to find posts with certain tags</p>
        </div>
        <div className="ui attached segment">
          <div className="ui  labels">
            {tags}
          </div>
        </div>
      </div>
    )
  }
};

const TagItem = React.createClass({
  getInitialState: function () {
    return {selected: this.props.initialSelected};
  },
  findTags: function () {
    if(!this.state.selected){
      //$('#blogSearch').val('');
      console.log('clicked', this.state.selected)
      this.setState({selected: !this.state.selected});
      let filter = Session.get('blogSubFilter');
      if(!filter || filter.type==='search') filter = {tags: [], type: 'tags'};
      filter.tags.push(this.props.data.posts);
      Session.set('blogSubFilter', filter);
    } else {
      console.log('clicked', this.state.selected)
      this.setState({selected: !this.state.selected});
      var filter = Session.get('blogSubFilter');
      var posts = this.props.data.posts;
      console.log('posts',this.props.data.posts)
      var testArr = _.map(filter.tags, function(d){
        return _.isEqual(d, posts)
      });
      var i = _.indexOf(testArr, true);
      if(i>=0) filter.tags.splice(i, 1);
      if(filter.tags.length === 0) filter = null;
      Session.set('blogSubFilter', filter);
    }
  },
  render: function () {
    console.log(this.state.selected)
    const className = !this.state.selected ? "ui yellow label" : "ui red label";
    //console.log(this.props.data);
    return (
      <a className={className}
         onClick={this.findTags}
      >
        {this.props.data.tag}
        <div className="detail">{this.props.data.count}</div>
      </a>
    )
  }
});