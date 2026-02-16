CREATE TABLE IF NOT EXISTS recurring_rules (
  id CHAR(36) PRIMARY KEY,
  booking_id CHAR(36) NOT NULL,
  frequency ENUM('WEEKLY', 'MONTHLY', 'CUSTOM_DAYS') NOT NULL,
  interval_value INT NOT NULL DEFAULT 1,
  day_of_week INT NULL,
  days_of_week JSON NULL,
  day_of_month INT NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  last_generated_until DATE NULL,
  CONSTRAINT fk_recurring_rules_booking
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE
);
