-- Fix payment amount for already accepted bill with discount
-- Run this in Supabase SQL Editor

-- Find the bill with wrong payment amount
WITH bill_info AS (
    SELECT 
        br.id as bill_request_id,
        br.final_amount,
        br.discount_amount,
        p.id as payment_id,
        p.amount as current_payment_amount
    FROM bill_requests br
    LEFT JOIN payments p ON p.bill_request_id = br.id
    WHERE br.status = 'accepted'
      AND br.discount_amount > 0
      AND p.amount != br.final_amount
    ORDER BY br.accepted_at DESC
    LIMIT 1
)
-- Update payment to use final_amount
UPDATE payments
SET amount = (SELECT final_amount FROM bill_info WHERE payment_id = payments.id)
WHERE id IN (SELECT payment_id FROM bill_info)
RETURNING id, amount, status;

-- Verify the update
SELECT 
    p.id as payment_id,
    p.amount as payment_amount,
    p.status,
    br.total_amount,
    br.final_amount,
    br.discount_amount
FROM payments p
JOIN bill_requests br ON p.bill_request_id = br.id
WHERE br.discount_amount > 0
ORDER BY p.created_at DESC
LIMIT 1;
