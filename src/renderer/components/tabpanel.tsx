import React from 'react';

import './tabpanel.css';

type Props = React.Props<any> & OwnProps;

type OwnProps = {
  isSelected: boolean;
};

export default function TabPanelComponent(props: Props) {
  return (
    <div role="tablanel" className="tabpanel" aria-hidden={String(!props.isSelected)}>
      {props.children}
    </div>
  );
}
