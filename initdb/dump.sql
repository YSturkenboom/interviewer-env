-- initdb/dump.sql
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
);

INSERT INTO candidates (name, email)
VALUES ('Alice Test', 'alice@example.com');
