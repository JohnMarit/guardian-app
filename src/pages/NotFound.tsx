
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="text-center space-y-5 max-w-md p-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-alert-high" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        
        <p className="text-gray-600">
          The alert or resource you're looking for doesn't exist or has been moved.
          Please return to the dashboard for the latest security information.
        </p>
        
        <div className="pt-4">
          <Button asChild>
            <a href="/">Return to Command Center</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
