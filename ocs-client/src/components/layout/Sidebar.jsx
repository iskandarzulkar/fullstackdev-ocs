import React from "react";
import { BadgeCheck } from "lucide-react";

export function Sidebar({ tabs, activeTab, onTabChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <BadgeCheck size={28} />
        <div>
          <strong>PT XYZ</strong>
          <span>Workflow Approval</span>
        </div>
      </div>

      <nav>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
              type="button"
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
