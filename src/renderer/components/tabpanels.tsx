import React from 'react';

import './tabpanels.css';

type Props = React.Props<any>;

export default function TabPanelsComponent(props: Props) {
  return (
    <div className="tabpanels">
      {props.children}
    </div>
  );
}
