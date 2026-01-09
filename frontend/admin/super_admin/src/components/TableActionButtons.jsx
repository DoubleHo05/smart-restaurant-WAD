import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, Printer } from "lucide-react"; // Icon
import { PrintableQrTemplate } from "./PrintableQrTemplate";

const TableActionButtons = ({ table }) => {
  const printRef = useRef();

  // 1. Cấu hình in ấn
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Table-${table.table_number}`,
  });

  // 2. Xử lý Download PDF từ API Backend
  const handleDownloadPdf = async () => {
    try {
      // Gọi API NestJS (đường dẫn mà TV3 đã viết ở trên)
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${apiUrl}/tables/qr/${table.id}/download-pdf`
      );

      if (!response.ok) throw new Error("Download failed");

      // Chuyển response thành Blob để tải về
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Table-${table.table_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert("Lỗi tải file: " + error.message);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Nút In Trực Tiếp */}
      <button onClick={handlePrint} className="btn-icon" title="In QR Code">
        <Printer size={18} />
      </button>

      {/* Nút Tải PDF */}
      <button onClick={handleDownloadPdf} className="btn-icon" title="Tải PDF">
        <Download size={18} />
      </button>

      {/* Component In Ẩn (Luôn render nhưng user không thấy, chỉ máy in thấy) */}
      <div style={{ display: "none" }}>
        <PrintableQrTemplate ref={printRef} tableData={table} />
      </div>
    </div>
  );
};

export default TableActionButtons;
