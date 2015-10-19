import { Component, PropTypes } from 'react';
//import BlazeToReact from 'blaze-to-react';
import Header from '../layers/sections/header/header.jsx';
import Stage from '../layers/sections/stage/stage.jsx';


const MaevModal = BlazeToReact('modal');

export default class Grid extends Component {
  static propTypes = {
    children: function(){return "some val";}
  }

  someFunc() {

  }

  render() {

    return (
      <div id="maev" className="index">
        <div className="pusher">
          <div className="full height">
            <Header />
            <MaevModal />
            <Stage  content={ this.props.content } aside={ this.props.aside } />
          </div>
        </div>
      </div>
    );
  }
}
