
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ShieldAlert, MessageSquare, Database, Bell } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldAlert className="h-5 w-5 text-alert-high" />
          <span className="hidden sm:inline">Community Guardian</span>
          <span className="sm:hidden">CG</span>
        </div>

        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </Link>
          <Link to="/reports" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </Link>
          <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline">High Alert Mode</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
