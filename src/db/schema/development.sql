-- Users table seeds --
INSERT INTO users
    (user_name, email, password, phone_number)
VALUES
    ('Don Stevenson', 'don@example.com', '$2b$10$6tuTDox7dVe3rrTZqmsGKONQ8ZvcWCokjFmYtmIKdsNoWS5bXp1Oy', '+14169090083');
INSERT INTO users
    (user_name, email, password, phone_number)
VALUES
    ('Darren Beattie', 'darren@example.com', '$2b$10$6tuTDox7dVe3rrTZqmsGKONQ8ZvcWCokjFmYtmIKdsNoWS5bXp1Oy', '+17788480760');
INSERT INTO users
    (user_name, email, password, phone_number)
VALUES
    ('Kevin Zhu', 'kevin@example.com', '$2b$10$6tuTDox7dVe3rrTZqmsGKONQ8ZvcWCokjFmYtmIKdsNoWS5bXp1Oy', '+14166487618');

-- Goals table seeds-- 
INSERT INTO goals
    (goal_name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number)
VALUES
    ('Learn the guitar', 1, '2020-01-01', '2020-08-1', 'everyday at 1000', '+17788480760', '+14166487618');
INSERT INTO goals
    (goal_name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number)
VALUES
    ('Reading War and Peace', 2, '2015-09-18', '2020-09-18', 'everyday at 1900', '+14166487618', '+14169090083');
INSERT INTO goals
    (goal_name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number)
VALUES
    ('Codewars', 3, '2019-10-14', '2020-10-14', 'everyday at 900', '+17788480760', '+14169090083');
INSERT INTO goals
    (goal_name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number)
VALUES
    ('Whiteboard', 3, '2019-10-14', '2020-10-14', 'everyday at 900', '+17788480760', '+14169090083');

-- Nags table seeds --
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (1, 'Did you practice guitar for 45 mins today?', null, '2020-02-19', '1000');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (1, 'Did you practice guitar for 45 mins today?', null, '2020-02-20', '1000');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (1, 'Did you practice guitar for 45 mins today?', null, '2020-02-21', '1000');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (2, 'Did you read War and Peace today?', null, '2020-02-19', '1900');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (2, 'Did you read War and Peace today?', null, '2020-02-20', '1900');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (2, 'Did you read War and Peace today?', null, '2020-02-21', '1900');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (3, 'Did you do CodeWars today?', null, '2020-02-19', '1100');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (3, 'Did you do CodeWars today?', null, '2020-02-20', '1100');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (3, 'Did you do CodeWars today?', null, '2020-02-21', '1100');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (4, 'Did you practice white boarding today?', null, '2020-02-19', '1100');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (4, 'Did you practice white boarding today?', null, '2020-02-20', '1900');
INSERT INTO nags
    (goal_id, nag_name, completion, date, time )
VALUES
    (4, 'Did you practice white boarding today?', null, '2020-02-21', '2200');
