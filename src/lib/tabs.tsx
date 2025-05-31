"use client";
import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, className = "", tabClassName = "", contentClassName = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`flex flex-col w-full text-sm xl:text-base 2xl:text-lg ${className}`}>
      <div className="flex border-b border-grey-c200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-primary-c900 border-b-2 border-primary-c900"
                : "text-grey-c500 hover:text-grey-c700"
            } ${tabClassName}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`mt-4 ${contentClassName}`}>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );
};

export default Tabs;
