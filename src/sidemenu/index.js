import React, { useState, useContext, createContext } from 'react';

import SideMenu from './SideMenu';

const SideMenuContext = createContext();
const useSideMenu = () => useContext(SideMenuContext);

const SideMenuProvider = (props) => {
  const [sideMenuIsOpen, setSideMenuIsOpen] = useState(false);
  const toggleSideMenu = () => {
    setSideMenuIsOpen(!sideMenuIsOpen);
  };

  return (
    <SideMenuContext.Provider
      value={{
        sideMenuIsOpen,
        setSideMenuIsOpen,
        toggleSideMenu,
        openSideMenu: () => setSideMenuIsOpen(true),
        closeSideMenu: () => setSideMenuIsOpen(false),
      }}
    >
      <SideMenu>{props.children}</SideMenu>
    </SideMenuContext.Provider>
  );
};

export { SideMenuContext, SideMenuProvider, useSideMenu, SideMenu };
