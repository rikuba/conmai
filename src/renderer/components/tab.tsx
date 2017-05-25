import { remote } from 'electron';
import React from 'react';

import { Thread } from '../../store/reducers';

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

  handleTabClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { url } = this.props;

    if ((e.target as HTMLElement).matches('.tab-close-button, .tab-close-button *')) {
      this.props.onTabClose(url);
      return;
    }

    this.props.onTabSelect(url);
  };

  handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === 1) {
      this.middleButtonPressed = true;
    }
  };

  handleMouseOut: React.MouseEventHandler<HTMLDivElement> = (e) => {
    this.middleButtonPressed = false;
  };

  handleMouseUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === 1 && this.middleButtonPressed) {
      this.props.onTabClose(this.props.url);
      this.middleButtonPressed = false;
    }
  };

  handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
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
        <span className="tab-close-button" aria-label="閉じる">×</span>
      </div>
    );
  }
}
