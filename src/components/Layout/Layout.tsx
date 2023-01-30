import React from 'react';
import Navbar from '../Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
export default Layout;
