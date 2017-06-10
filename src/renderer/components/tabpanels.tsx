import React from 'react';

import './tabpanels.css';


export default function TabPanelsComponent(props: React.Props<any>) {
  return (
    <div className="tabpanels">
      {props.children}
    </div>
  );
}
