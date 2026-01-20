-- Check bill request amounts to debug discount issue
-- Run this in Supabase SQL Editor

-- Find the recent bill request with discount
SELECT 
    id,
    table_id,
    status,
    subtotal,
    tips_amount,
    total_amount,
    discount_type,
    discount_value,
    discount_amount,
    tax_rate,
    tax_amount,
    final_amount,
    payment_method_code,
    created_at,
    accepted_at
FROM bill_requests 
WHERE discount_amount IS NOT NULL 
  AND discount_amount > 0
ORDER BY created_at DESC 
LIMIT 5;

-- Check if payment was created with correct amount
SELECT 
    p.id as payment_id,
    p.amount as payment_amount,
    p.status as payment_status,
    br.total_amount,
    br.final_amount,
    br.discount_amount,
    CASE 
        WHEN p.amount = br.final_amount THEN '✅ Correct (using final_amount)'
        WHEN p.amount = br.total_amount THEN '❌ Wrong (using total_amount)'
        ELSE '⚠️ Unknown'
    END as amount_check
FROM payments p
JOIN bill_requests br ON p.bill_request_id = br.id
WHERE br.discount_amount > 0
ORDER BY p.created_at DESC
LIMIT 5;
