import "../App.css";

interface OrderStatusBadgeProps {
  status: string;
  showIcon?: boolean;
  className?: string;
}

export default function OrderStatusBadge({
  status,
  showIcon = true,
  className = "",
}: OrderStatusBadgeProps) {
  const getStatusConfig = (orderStatus: string) => {
    const normalizedStatus = orderStatus.toLowerCase();

    switch (normalizedStatus) {
      case "pending":
      case "received":
        return {
          className: "status-badge received",
          icon: "🔔",
          label: "Pending",
        };
      case "accepted":
        return {
          className: "status-badge accepted",
          icon: "✓",
          label: "Accepted",
        };
      case "preparing":
        return {
          className: "status-badge preparing",
          icon: "👨‍🍳",
          label: "Preparing",
        };
      case "ready":
        return {
          className: "status-badge ready",
          icon: "✅",
          label: "Ready",
        };
      case "completed":
      case "served":
        return {
          className: "status-badge completed",
          icon: "✔️",
          label: "Completed",
        };
      case "cancelled":
        return {
          className: "status-badge preparing warning",
          icon: "❌",
          label: "Cancelled",
        };
      default:
        return {
          className: "status-badge",
          icon: "ℹ️",
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`${config.className} ${className}`.trim()}>
      {showIcon && <>{config.icon} </>}
      {config.label}
    </span>
  );
}
