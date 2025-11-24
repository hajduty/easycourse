import { Outlet } from 'react-router';
import { Navbar } from './home/components/Navbar';

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
