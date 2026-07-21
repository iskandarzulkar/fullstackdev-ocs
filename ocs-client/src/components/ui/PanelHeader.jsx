import React from "react";

export function PanelHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="panel-header">
      <div>
        <div className="panel-title">
          <Icon size={19} />
          <h2>{title}</h2>
        </div>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
