-- Users table seeds --
INSERT INTO users
    (name, email, password, phone_number)
VALUES
    ('Don Stevenson', 'Don@example.com', 'password', '+14169090083');
INSERT INTO users
    (name, email, password, phone_number)
VALUES
    ('Darren Beattie', 'Darren@example.com', 'password', '+17788480760');
INSERT INTO users
    (name, email, password, phone_number)
VALUES
    ('Kevin Zhu', 'Kevin@example.com', 'password', '+14166487618');

-- Goals table seeds-- 
INSERT INTO goals
    (name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number)
VALUES
    ('Learn the guitar', 1, '2020-01-01', '2020-08-1', 'everyday at 1000', '+17788480760', '+14166487618');
INSERT INTO goals
    (name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number)
VALUES
    ('Reading War and Peace', 2, '2015-09-18', '2020-09-18', 'everyday at 1900', '+14166487618', '+14169090083');
INSERT INTO goals
    (name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number)
VALUES
    ('Codewars', 3, '2019-10-14', '2020-10-14', 'everyday at 900', '+17788480760', '+14169090083');

-- Nags table seeds --
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (1, 'Did you practice guitar for 45 mins today?', 'true', '2020-02-27', '1000');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (1, 'Did you practice guitar for 45 mins today?', 'true', '2020-02-26', '1000');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (1, 'Did you practice guitar for 45 mins today?', 'true', '2020-02-25', '1000');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (2, 'Did you read War and Peace today?', 'true', '2020-02-27', '1900');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (2, 'Did you read War and Peace today?', 'false', '2020-02-26', '1900');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (2, 'Did you read War and Peace today?', 'true', '2020-02-25', '1900');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (3, 'Did you do CodeWars today?', 'true', '2020-02-27', '1100');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (3, 'Did you do CodeWars today?', 'false', '2020-02-26', '1100');
INSERT INTO nags
    (goal_id, name, completion, date, time )
VALUES
    (3, 'Did you do CodeWars today?', 'false', '2020-02-25', '1100');
