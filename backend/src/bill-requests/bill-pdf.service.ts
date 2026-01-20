import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

export interface BillData {
  id: string;
  restaurant: {
    name: string;
    address?: string;
    phone?: string;
  };
  table: {
    table_number: string;
  };
  orders: Array<{
    order_number: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      subtotal: number;
      modifiers?: string[];
    }>;
  }>;
  subtotal: number;
  tips_amount: number;
  discount_type?: string;
  discount_value?: number;
  discount_amount?: number;
  tax_rate?: number;
  tax_amount?: number;
  final_amount: number;
  payment_method: string;
  created_at: Date;
  accepted_at?: Date;
}

@Injectable()
export class BillPdfService {
  async generateBillPdf(billData: BillData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: [226.77, 600], // 80mm width receipt paper (1mm = 2.83465 points)
          margin: 10,
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        this.drawHeader(doc, billData);

        // Order Items
        this.drawOrderItems(doc, billData);

        // Totals
        this.drawTotals(doc, billData);

        // Footer
        this.drawFooter(doc, billData);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private drawHeader(doc: any, billData: BillData) {
    // Center of 80mm paper

    // Restaurant Name
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text(billData.restaurant.name, 10, 20, {
      width: 206,
      align: 'center',
    });

    // Restaurant Info
    if (billData.restaurant.address) {
      doc.fontSize(8).font('Helvetica');
      doc.text(billData.restaurant.address, 10, doc.y + 5, {
        width: 206,
        align: 'center',
      });
    }

    if (billData.restaurant.phone) {
      doc.text(`Tel: ${billData.restaurant.phone}`, 10, doc.y + 2, {
        width: 206,
        align: 'center',
      });
    }

    // Separator
    doc.moveDown(0.5);
    doc.strokeColor('#000').lineWidth(0.5);
    doc.moveTo(10, doc.y).lineTo(216, doc.y).stroke();

    // Bill Info
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('BILL', 10, doc.y, { width: 206, align: 'center' });

    doc.fontSize(9).font('Helvetica');
    doc.moveDown(0.3);
    doc.text(`Table: ${billData.table.table_number}`, 10, doc.y);
    doc.text(
      `Date: ${new Date(billData.accepted_at || billData.created_at).toLocaleDateString('vi-VN')}`,
      10,
      doc.y + 2,
    );
    doc.text(
      `Time: ${new Date(billData.accepted_at || billData.created_at).toLocaleTimeString('vi-VN')}`,
      10,
      doc.y + 2,
    );
    doc.text(`Bill #: ${billData.id.slice(-8).toUpperCase()}`, 10, doc.y + 2);

    // Separator
    doc.moveDown(0.5);
    doc.moveTo(10, doc.y).lineTo(216, doc.y).stroke();
    doc.moveDown(0.5);
  }

  private drawOrderItems(doc: any, billData: BillData) {
    doc.fontSize(8).font('Helvetica-Bold');

    // Header row
    doc.text('Item', 10, doc.y, { width: 120, continued: false });
    doc.text('Qty', 130, doc.y - 10, { width: 30, align: 'center' });
    doc.text('Amount', 160, doc.y - 10, { width: 50, align: 'right' });

    doc.moveDown(0.3);
    doc
      .strokeColor('#ccc')
      .lineWidth(0.3)
      .moveTo(10, doc.y)
      .lineTo(216, doc.y)
      .stroke();
    doc.moveDown(0.3);

    doc.font('Helvetica').fontSize(8);

    // Items
    billData.orders.forEach((order) => {
      order.items.forEach((item) => {
        const itemY = doc.y;

        // Item name (may wrap)
        doc.text(item.name, 10, itemY, { width: 115 });

        // Quantity
        doc.text(item.quantity.toString(), 130, itemY, {
          width: 30,
          align: 'center',
        });

        // Amount
        doc.text(this.formatCurrency(item.subtotal), 160, itemY, {
          width: 50,
          align: 'right',
        });

        // Modifiers
        if (item.modifiers && item.modifiers.length > 0) {
          doc.fontSize(7).fillColor('#666');
          doc.text(`  + ${item.modifiers.join(', ')}`, 10, doc.y + 2, {
            width: 200,
          });
          doc.fillColor('#000').fontSize(8);
        }

        doc.moveDown(0.2);
      });
    });

    // Separator
    doc.moveDown(0.3);
    doc
      .strokeColor('#000')
      .lineWidth(0.5)
      .moveTo(10, doc.y)
      .lineTo(216, doc.y)
      .stroke();
    doc.moveDown(0.5);
  }

  private drawTotals(doc: any, billData: BillData) {
    const rightCol = 160;
    const labelWidth = 100;
    const valueWidth = 50;

    doc.fontSize(9).font('Helvetica');

    // Subtotal
    let y = doc.y;
    doc.text('Subtotal:', 60, y, { width: labelWidth, align: 'right' });
    doc.text(this.formatCurrency(billData.subtotal), rightCol, y, {
      width: valueWidth,
      align: 'right',
    });

    // Tips
    if (billData.tips_amount > 0) {
      y = doc.y + 3;
      doc.text('Tips:', 60, y, { width: labelWidth, align: 'right' });
      doc.text(`+${this.formatCurrency(billData.tips_amount)}`, rightCol, y, {
        width: valueWidth,
        align: 'right',
      });
    }

    // Discount
    if (billData.discount_amount && billData.discount_amount > 0) {
      y = doc.y + 3;
      const discountLabel =
        billData.discount_type === 'percentage'
          ? `Discount (${billData.discount_value}%):`
          : 'Discount:';
      doc.fillColor('#16a34a');
      doc.text(discountLabel, 60, y, { width: labelWidth, align: 'right' });
      doc.text(
        `-${this.formatCurrency(billData.discount_amount)}`,
        rightCol,
        y,
        {
          width: valueWidth,
          align: 'right',
        },
      );
      doc.fillColor('#000');
    }

    // Tax
    if (billData.tax_amount && billData.tax_amount > 0) {
      y = doc.y + 3;
      doc.text(`Tax (${billData.tax_rate}%):`, 60, y, {
        width: labelWidth,
        align: 'right',
      });
      doc.text(`+${this.formatCurrency(billData.tax_amount)}`, rightCol, y, {
        width: valueWidth,
        align: 'right',
      });
    }

    // Separator
    doc.moveDown(0.5);
    doc
      .strokeColor('#000')
      .lineWidth(1)
      .moveTo(60, doc.y)
      .lineTo(216, doc.y)
      .stroke();
    doc.moveDown(0.5);

    // Total
    doc.fontSize(12).font('Helvetica-Bold');
    y = doc.y;
    doc.text('TOTAL:', 60, y, { width: labelWidth, align: 'right' });
    doc.text(this.formatCurrency(billData.final_amount), rightCol, y, {
      width: valueWidth,
      align: 'right',
    });

    // Payment Method
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica');
    doc.text(
      `Payment: ${this.getPaymentMethodName(billData.payment_method)}`,
      10,
      doc.y,
      {
        width: 206,
        align: 'center',
      },
    );
  }

  private drawFooter(doc: any, billData: BillData) {
    doc.moveDown(1);
    doc
      .strokeColor('#ccc')
      .lineWidth(0.3)
      .moveTo(10, doc.y)
      .lineTo(216, doc.y)
      .stroke();
    doc.moveDown(0.5);

    doc.fontSize(8).font('Helvetica');
    doc.text('Thank you for dining with us!', 10, doc.y, {
      width: 206,
      align: 'center',
    });
    doc.text('Please come again!', 10, doc.y + 3, {
      width: 206,
      align: 'center',
    });

    doc.moveDown(1);
    doc.fontSize(7).fillColor('#999');
    doc.text(`Generated: ${new Date().toLocaleString('vi-VN')}`, 10, doc.y, {
      width: 206,
      align: 'center',
    });
  }

  private formatCurrency(amount: number): string {
    return Math.round(amount).toLocaleString('vi-VN') + '₫';
  }

  private getPaymentMethodName(code: string): string {
    const methods: Record<string, string> = {
      vnpay: 'VNPay',
      VNPAY: 'VNPay',
      cash: 'Cash',
      CASH: 'Cash',
      momo: 'MoMo',
      zalopay: 'ZaloPay',
    };
    return methods[code] || code;
  }
}
