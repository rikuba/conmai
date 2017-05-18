import { remote } from 'electron';
import React from 'react';

import { Thread } from '../reducers';

import './tab.css';

export default class TabComponent extends React.PureComponent<{
  url: Thread['url'];
  icon: Thread['icon'];
  title: Thread['title'];
  isSelected: boolean;
  onTabSelect: (url: string) => void;
  onTabClose: (url: string) => void;
  onTabCloseOthers: (url: string) => void;
}, {}> {
  private middleButtonPressed = false;

  private contextMenu = remote.Menu.buildFromTemplate([
    {
      label: 'タブを閉じる',
      click: (menuItem, browserWindow, event) => {
        this.props.onTabClose(this.props.url);
      },
    },
    {
      label: '他のタブをすべて閉じる',
      click: (menuItem, browserWindow, event) => {
        this.props.onTabCloseOthers(this.props.url);
      },
    },
  ]);

  handleTabClick = (e: any) => {
    const { url } = this.props;

    if (e.target.matches('.tab-close-button, .tab-close-button *')) {
      this.props.onTabClose(url);
      return;
    }

    this.props.onTabSelect(url);
  };

  handleMouseDown = (e: any) => {
    if (e.button === 1) {
      this.middleButtonPressed = true;
    }
  };

  handleMouseOut = (e: any) => {
    this.middleButtonPressed = false;
  };

  handleMouseUp = (e: any) => {
    if (e.button === 1 && this.middleButtonPressed) {
      this.props.onTabClose(this.props.url);
      this.middleButtonPressed = false;
    }
  };

  handleContextMenu = (e: any) => {
    e.preventDefault();

    this.contextMenu.popup(remote.getCurrentWindow());
  };

  render() {
    const iconNode = this.props.icon ?
      <img className="tab-icon" src={this.props.icon} /> :
      <span className="tab-icon empty-icon"></span>;

    return (
      <div role="tab" className="tab"
        aria-selected={this.props.isSelected}
        title={this.props.title}
        onClick={this.handleTabClick}
        onMouseDown={this.handleMouseDown}
        onMouseOut={this.handleMouseOut}
        onMouseUp={this.handleMouseUp}
        onContextMenu={this.handleContextMenu}>
        {iconNode}
        <span className="tab-label">{this.props.title}</span>
        <span className="tab-close-button">×</span>
      </div>
    );
  }
}
