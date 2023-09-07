import React, { ReactNode } from 'react';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='h-screen flex items-center justify-center'>{children}</div>
  );
}

export default Layout;
