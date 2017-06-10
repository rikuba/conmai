import React from 'react';

import './tabpanel.css';


export default function TabPanelComponent(props: React.Props<any> & {
  isSelected: boolean;
}) {
  return (
    <div role="tablanel" className="tabpanel" aria-hidden={String(!props.isSelected)}>
      {props.children}
    </div>
  );
}
