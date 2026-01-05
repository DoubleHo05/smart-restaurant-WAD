import React from "react";
import QRCode from "react-qr-code";

// Dùng React.forwardRef để thư viện in ấn có thể tham chiếu tới
export const PrintableQrTemplate = React.forwardRef((props, ref) => {
  const { tableData } = props; // Dữ liệu bàn cần in

  if (!tableData) return null;

  return (
    <div
      ref={ref}
      style={{ padding: "40px", textAlign: "center", fontFamily: "Arial" }}
    >
      <div
        style={{
          border: "2px solid #000",
          padding: "20px",
          display: "inline-block",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0" }}>Smart Restaurant</h1>
        <h2 style={{ margin: "10px 0", fontSize: "24px" }}>
          Table: {tableData.table_number}
        </h2>

        <div
          style={{
            margin: "30px auto",
            width: "fit-content",
            background: "white",
            padding: "10px",
          }}
        >
          <QRCode
            value={`${import.meta.env.VITE_MENU_URL}?table=${tableData.id}&token=${tableData.qr_token}`}
            size={256}
            level="H"
          />
        </div>

        <p style={{ fontSize: "16px", marginTop: "30px", lineHeight: "1.6" }}>
          Scan to order
        </p>
      </div>
    </div>
  );
});
