import React, { Component } from 'react';
import logo from './../images/logo.svg';
import './Nav.css';

class Nav extends Component {
  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/"><img src="logo.png" alt="Thumb 70ef2cf9 77b2 4965 b7ab d1b6e5a71eb5 2x" /></a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><a href="/manager">Dashboard</a></li>
              <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Events <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="/manager/events">Event overview</a></li>
                <li><a href="/manager/wizards/rally?step=1">Event wizard</a></li>
                <li><a href="/manager/event_locations">Event locations</a></li>
              </ul>
            </li>
            <li><a href="/manager/donations">Donations</a></li>
            <li><a href="/manager/users">Users</a></li>
            <li><a href="/manager/designs/own">Design settings</a></li>
            <form className="navbar-form navbar-left" role="search" id="search">
              <div className="form-group">
                  <input id="searchQuery" type="text" className="form-control" placeholder="Search by name or state"/>
              </div>
              <button id="sendSearch" type="button" className="btn btn-default"><span className="glyphicon glyphicon-search"></span></button>
            </form>
            </ul>
            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav pull-right">
                <li className="dropdown user user-menu">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <img src="/uploads/user_profile/avatar/57ecd53e39e00104eaf0d594/small_thumb_tiger-woods-300.jpg" className="user-image" alt="User Image"/>
                    <span className="hidden-xs">manager</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="user-header">
                      <img src="/uploads/user_profile/avatar/57ecd53e39e00104eaf0d594/thumb_tiger-woods-300.jpg" className="img-circle" alt="User Image" id="user_profile"/>
                      <p>
                        manager - <span className="translation_missing" title="translation missing: en.application.view.manager">Manager</span>
                      </p>
                    </li>
                    <li className="user-footer">
                      <div className="pull-left">
                      </div>
                      <div className="pull-right">
                        <a className="btn btn-default btn-flat" href="/logout"><span className="translation_missing" title="translation missing: en.application.view.logout">Logout</span></a>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

    );
  }
}

export default Nav;
