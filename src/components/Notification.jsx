function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: notification.flagged ? "#dc2626" : "#2563eb",
        padding: "16px 18px",
        borderRadius: "12px",
        color: "white",
        zIndex: 9999,
        minWidth: "260px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <p style={{ margin: 0, fontWeight: 500 }}>
        {notification.message}
      </p>

      {notification.amount && (
        <p style={{ margin: "6px 0 0", fontSize: "14px", opacity: 0.9 }}>
          Amount: ₦{notification.amount}
        </p>
      )}

      {notification.reference && (
        <p style={{ margin: "6px 0 0", fontSize: "12px", opacity: 0.8 }}>
          Ref: {notification.reference}
        </p>
      )}
    </div>
  );
}

export default Notification;