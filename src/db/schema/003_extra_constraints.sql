ALTER TABLE submissions ADD CONSTRAINT stage_check CHECK (stage BETWEEN 1 AND 5);
