CREATE TABLE users (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email             varchar(254) NOT NULL,
    email_verified_at timestamptz,
    username          varchar(30)  NOT NULL,
    password_hash     text         NOT NULL,
    created_at        timestamptz  NOT NULL DEFAULT now(),
    lichess_username  varchar(30),
    chesscom_username varchar(30),

    CONSTRAINT users_username_min_length CHECK (char_length(username) >= 3)
);

CREATE UNIQUE INDEX users_username_lower_unique ON users (lower(username));
CREATE UNIQUE INDEX users_email_lower_unique ON users (lower(email));

/* connects two people as friends */
CREATE TABLE friend_relations (
    id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_1 bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    person_2 bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE friend_invitations (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    requester_id      bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id      bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitation_status varchar(8) /* pending, accepted or declined */
);

CREATE TABLE email_verification_tokens (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    bigint      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text        NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at    timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);


-- TODO: refactor to remove separate id, use user + puzzle as primary
CREATE TABLE failed_puzzles (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    bigint      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    puzzle_id  text        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    UNIQUE (user_id, puzzle_id)
);

-- TODO: refactor to remove separate id, use user + puzzle as primary
CREATE TABLE puzzle_attempts (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    bigint      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    puzzle_id  text        NOT NULL,
    puzzle_rating integer     NOT NULL,
    success    boolean     NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE preferences (
    user_id    bigint      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    color      text        NOT NULL,
    difficulty text        NOT NULL,
    failed     text       NOT NULL
);
