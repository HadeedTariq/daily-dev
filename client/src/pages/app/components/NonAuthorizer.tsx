import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Authenticate = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative Radial Glow */}
      <div
        className="absolute w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      {/* Main Authentication Card */}
      <Card className="relative w-full max-w-md border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl md:shadow-2xl transition-all duration-300 hover:shadow-indigo-500/5">
        {/* Top Floating Key Icon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 shadow-md">
          <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        </div>

        <CardHeader className="pt-10 text-center pb-2">
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Authentication Required
          </CardTitle>
          <CardDescription className="text-sm md:text-base text-slate-500 dark:text-slate-400 pt-2 max-w-sm mx-auto balance">
            To access this page, please log in to your account. Your security
            and privacy remain our highest priority.
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          {/* Visual separator or placeholder anchor if needed later, kept clean for now */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        </CardContent>

        <CardFooter className="flex justify-center pb-8 pt-2">
          <Button
            size="lg"
            className="w-full sm:w-auto px-8 py-6 font-medium text-sm shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => navigate("/auth/login")}
          >
            <Lock className="w-4 h-4 mr-2" aria-hidden="true" />
            Authenticate
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Authenticate;
