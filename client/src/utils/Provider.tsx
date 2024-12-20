import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider as Redux } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "@/components/ui/toaster";

const client = new QueryClient();

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <Redux store={store}>
        <BrowserRouter>
          {children}
          <Toaster />
        </BrowserRouter>
      </Redux>
    </QueryClientProvider>
  );
};

export default Provider;
