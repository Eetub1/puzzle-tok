/* fully AI generated file that creates a bunch of random accounts */

INSERT INTO users (username, email, password_hash, email_verified_at)
SELECT
    name || n,
    name || n || '@example.com',
    '$2b$12$svprBniaSFJqUeYMQ3ePI.0eQugZPt6WGpUx91QA46DqE79wZL1Ty', /* hash of "password123" which is the password for every fake account */
    now()
FROM unnest(ARRAY['magnus', 'magnolia', 'mag_fan', 'hikaru', 'chessfan']) AS name,
     generate_series(1, 5) AS n;