-- Chạy một lần trên PostgreSQL trước khi bỏ cột email.
-- Sao lưu cơ sở dữ liệu trước khi áp dụng ở môi trường production.
ALTER TABLE tbl_profiles ADD COLUMN IF NOT EXISTS username VARCHAR(255);
UPDATE tbl_profiles SET username = LOWER(TRIM(email)) WHERE username IS NULL AND email IS NOT NULL;
ALTER TABLE tbl_profiles ALTER COLUMN username SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_tbl_profiles_username_lower ON tbl_profiles (LOWER(username));
ALTER TABLE tbl_profiles DROP COLUMN IF EXISTS email;
