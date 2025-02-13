import React from "react";
import Header from "@/components/layout/header";

import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>My App</h1>
      </header>
      <main>
      < Header />

        <div className="p-4 sm:ml-64 bg-gray-100">
          <div className="mt-14">{children}</div>
        </div>
      </main>
      <footer>
        <p>&copy; 2023 My App</p>
      </footer>
    </div>
  );
};

export default AppLayout;
