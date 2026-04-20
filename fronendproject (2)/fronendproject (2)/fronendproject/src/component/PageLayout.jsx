import React from "react";

export default function PageLayout({ title, children }) {
  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="fw-bold text-primary border-bottom pb-2">{title}</h3>
      </div>

      {/* Card Wrapper */}
      <div className="card shadow-sm border-0">
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}
