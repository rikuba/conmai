import { remote } from 'electron';
import React from 'react';

import './tab.css';

type Props = React.Props<any> & OwnProps;

type OwnProps = {
  id: string;
  url: string;
  icon: string;
  title: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onCloseOthers: (id: string) => void;
};

export default class TabComponent extends React.PureComponent<Props, {}> {
  private middleButtonPressed = false;

  private contextMenu = remote.Menu.buildFromTemplate([
    {
      label: 'タブを閉じる',
      click: (menuItem, browserWindow, event) => {
        this.props.onClose(this.props.id);
      },
    },
    {
      label: '他のタブをすべて閉じる',
      click: (menuItem, browserWindow, event) => {
        this.props.onCloseOthers(this.props.id);
      },
    },
  ]);

  handleTabClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { id } = this.props;

    if ((e.target as HTMLElement).matches('.tab-close-button, .tab-close-button *')) {
      this.props.onClose(id);
      return;
    }

    this.props.onSelect(id);
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
      this.props.onClose(this.props.id);
      this.middleButtonPressed = false;
    }
  };

  handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    this.contextMenu.popup(remote.getCurrentWindow());
  };

  render() {
    const iconNode = this.props.icon ? (
      <img className="tab-icon" src={this.props.icon} />
    ) : (
      <span className="tab-icon empty-icon" />
    );

    return (
      <div
        role="tab"
        className="tab"
        aria-selected={this.props.isSelected}
        title={this.props.title}
        onClick={this.handleTabClick}
        onMouseDown={this.handleMouseDown}
        onMouseOut={this.handleMouseOut}
        onMouseUp={this.handleMouseUp}
        onContextMenu={this.handleContextMenu}>
        {iconNode}
        <span className="tab-label">{this.props.title}</span>
        <span className="tab-close-button" aria-label="閉じる">
          ×
        </span>
      </div>
    );
  }
}
