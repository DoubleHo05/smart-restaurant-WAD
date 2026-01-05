-- Create tables table with all required fields and constraints
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0 AND capacity <= 20),
    location VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    qr_token VARCHAR(500),
    qr_token_created_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tables_status ON tables(status);
CREATE INDEX IF NOT EXISTS idx_tables_location ON tables(location);

-- Insert some sample data for testing
INSERT INTO tables (table_number, capacity, location, description, status) VALUES
('T01', 4, 'Indoor', 'Window seat table', 'active'),
('T02', 2, 'Indoor', 'Cozy corner table', 'active'),
('T03', 6, 'Outdoor', 'Patio table with garden view', 'active'),
('T04', 8, 'VIP Room', 'Private dining room', 'active'),
('T05', 4, 'Indoor', 'Center table', 'inactive')
ON CONFLICT (table_number) DO NOTHING;
