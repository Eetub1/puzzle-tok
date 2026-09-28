CREATE TABLE users (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username      varchar(30) NOT NULL,
    password_hash text        NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT users_username_min_length CHECK (char_length(username) >= 3)
);
CREATE UNIQUE INDEX users_username_lower_unique ON users (lower(username));