ALTER TABLE recurring_rules
  ADD COLUMN days_of_week JSON NULL AFTER day_of_week;
