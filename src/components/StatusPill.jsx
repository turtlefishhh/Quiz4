import React from "react";

const STATUS_CLASS_MAP = {
  created: "status-created",
  "in progress": "status-progress",
  overdue: "status-overdue",
  completed: "status-complete",
  "on track": "status-on-track",
  "not started": "status-idle",
  delayed: "status-delayed",
  "at risk": "status-risk",
};

function StatusPill({ value }) {
  const key = String(value || "").toLowerCase();
  const className = STATUS_CLASS_MAP[key] || "status-neutral";

  return <span className={`status-pill ${className}`}>{value || "--"}</span>;
}

export default StatusPill;
