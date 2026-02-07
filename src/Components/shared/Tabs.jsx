import { useState, createContext, useContext } from 'react';
import './Tabs.css';

// Create context to share tab state
const TabsContext = createContext();

export const Tabs = ({ children, defaultValue, value, onValueChange }) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    if (onValueChange) {
      onValueChange(tabValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
      <div className="tabs-root">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children }) => {
  return (
    <div className="tabs-list" role="tablist">
      {children}
    </div>
  );
};

export const TabsTrigger = ({ children, value, onClick, ...props }) => {
  const context = useContext(TabsContext);

  const handleClick = (e) => {
    e.preventDefault();
    if (context) {
      context.onTabChange(value);
    }
    onClick?.(e);
  };

  const isActive = context?.activeTab === value;

  return (
    <button
      className={`tabs-trigger ${isActive ? 'active' : ''}`}
      role="tab"
      data-value={value}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value }) => {
  const context = useContext(TabsContext);
  const isActive = context?.activeTab === value;

  return (
    <div 
      className={`tabs-content ${isActive ? 'active' : ''}`}
      data-value={value}
      data-state={isActive ? 'active' : 'inactive'}
      role="tabpanel"
      style={{ display: isActive ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
};

export default Tabs;


