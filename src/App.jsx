// src/App.jsx
import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import NavigationMenuBar from "./components/NavigationMenu";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavigationMenuBar />
        <Dashboard />
      </header>
    </div>
  );
}

export default App;
