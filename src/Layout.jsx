import React from "react";
import "./App.css";

export default function Layout({ title, children }) {
  return (
    <div className="k-line-chart-container">
      <h3 className="k-line-chart-title">{title}</h3>
      {children}
    </div>
  );
}
