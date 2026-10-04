CREATE TABLE users (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email             varchar(254) NOT NULL,
    email_verified_at timestamptz,
    username          varchar(30)  NOT NULL,
    password_hash     text         NOT NULL,
    created_at        timestamptz  NOT NULL DEFAULT now(),

    CONSTRAINT users_username_min_length CHECK (char_length(username) >= 3)
);

CREATE UNIQUE INDEX users_username_lower_unique ON users (lower(username));
CREATE UNIQUE INDEX users_email_lower_unique ON users (lower(email));

CREATE TABLE email_verification_tokens (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    bigint      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text        NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at    timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE preferences (
    user_id    bigint      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    color      text        NOT NULL
);