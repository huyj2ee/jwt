INSERT INTO roles(`role`)
SELECT * FROM (SELECT 'admin') AS tmp
WHERE NOT EXISTS (SELECT * FROM roles WHERE `role` LIKE 'admin') LIMIT 1;

INSERT INTO users(username, password, account_non_locked)
SELECT * FROM (SELECT 'root', '$2a$10$YrXLj1YzOUKFrEH4AEi8iuKrOn8OW0BrROK/H8Zn3x0YH8qnFBIKa', true) AS tmp
WHERE NOT EXISTS (SELECT * FROM users WHERE username LIKE 'root') LIMIT 1;

INSERT INTO users_roles(username, `role`)
SELECT * FROM (SELECT 'root', 'admin') AS tmp
WHERE NOT EXISTS (SELECT * FROM users_roles WHERE username LIKE 'root' and `role` LIKE 'admin') LIMIT 1;
