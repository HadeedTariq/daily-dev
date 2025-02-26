import type React from "react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface GitHubLoginButtonProps {
  className?: string;
}

const GitHubLoginButton: React.FC<GitHubLoginButtonProps> = ({
  className = "",
}) => {
  return (
    <Button
      variant="outline"
      className={`w-full mt-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  border border-gray-300 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-700 
                  hover:border-gray-400 dark:hover:border-gray-600 
                  focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 
                  focus:ring-opacity-50 
                  transition-all duration-200 
                  ${className}`}
      onClick={() =>
        (window.location.href = `${
          import.meta.env.VITE_BACKEND_URL
        }/auth/github`)
      }
    >
      <div className="flex items-center justify-center">
        <Github className="w-5 h-5 mr-2" />
        <span>Sign in with GitHub</span>
      </div>
    </Button>
  );
};

export default GitHubLoginButton;
