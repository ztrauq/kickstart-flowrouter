import React, { Component, PropTypes } from 'react';
//import BlazeToReact from 'blaze-to-react';

require('./header.scss');

const MaevLogin = BlazeToReact('maevLogin');

const BrandLogo = React.createClass({
  render : function (){
    return (
      <div id="brandLogo" className="ui image">
        <a href="/">
          <span className="ui header orange">hyper</span>
          <img src={require('BlogApp/client/images/lab-128.png')}
               alt="reactive beaker"
               className="ui middle aligned tiny image"
          />
          <span className="ui header red">Reactivity</span>
        </a>
      </div>
    )
  }
})

const PageMenu = React.createClass({
  getInitialState: function () {
    return {
      data: [
        {active: true, icon: ".", name: "FAQ", target: "faq"},
        {active: false, icon: ".", name: "About", target: "about"}
      ]
    }
  },
    render: function (){
      let buttons = this.state.data.map(function(button, i){
        return <PageButton data={button} key={i}/>
      })
      return  <nav className="ui menu">{buttons}</nav>
    }
});

const PageButton = React.createClass({
  render: function(){
    return (
      <a className="nav item" data-action={this.props.data.target}>{this.props.data.name}</a>

    )
  }
})

export default class Header extends Component {
  render() {
    return (
      <div className="ui grid">
        <div className="sixteen wide column">
          <div className="ui basic segment">
            <header id="header" className="ui grid">

              <div className="row">
                <div className="one wide column">
                </div>
                <div className="six wide column">
                    <BrandLogo />

                </div>
                <div className="four wide column">
                  <div className="ui right floated pages menu">
                    <PageMenu/>

                  </div>
                </div>
                <div className="four wide column">
                      <MaevLogin />
                </div>
              </div>
            </header>
          </div>
        </div>
      </div>
    );
  }
}
