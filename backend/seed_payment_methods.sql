-- Insert Payment Methods identified from frontend
INSERT INTO payment_methods (code, name, description, is_active, display_order) VALUES
('cash', 'Pay at Counter', 'Thanh toán trực tiếp tại quầy thu ngân', true, 1),
('vnpay', 'VNPay', 'Thanh toán qua ví điện tử VNPay', true, 2),
('momo', 'MoMo', 'Thanh toán qua ví MoMo', true, 3),
('zalopay', 'ZaloPay', 'Thanh toán qua ví ZaloPay', true, 4),
('stripe', 'Credit/Debit Card', 'Thanh toán thẻ Visa/Mastercard', true, 5)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;
