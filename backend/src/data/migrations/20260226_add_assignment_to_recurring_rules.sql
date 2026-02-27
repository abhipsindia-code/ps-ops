ALTER TABLE recurring_rules
  ADD COLUMN supervisor_id INT NULL AFTER booking_id,
  ADD COLUMN team JSON NULL AFTER supervisor_id;
