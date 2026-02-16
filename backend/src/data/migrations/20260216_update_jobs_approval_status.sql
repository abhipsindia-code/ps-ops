ALTER TABLE jobs
  MODIFY approval_status ENUM('PENDING','APPROVED','REJECTED') NULL DEFAULT NULL;

UPDATE jobs
SET approval_status = NULL
WHERE approval_status = 'PENDING'
  AND status IN ('CREATED','NOT_STARTED','IN_PROGRESS','PAUSED')
  AND approved_at IS NULL;
