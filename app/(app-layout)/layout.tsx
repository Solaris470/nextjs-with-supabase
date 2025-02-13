import React from "react";
import Header from "@/components/layout/header";

const AppLayout: React.FC = ({ children }) => {
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
