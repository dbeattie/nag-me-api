-- Users table seeds --
INSERT INTO users (name, email, password) VALUES ('Don Stevenson', 'Don@example.com', 'password');
INSERT INTO users (name, email, password) VALUES ('Daren Beattie', 'Daren@example.com', 'password');
INSERT INTO users (name, email, password) VALUES ('Kevin Zhu', 'Kevin@example.com', 'password');

-- Goals table seeds--
INSERT INTO goals (name, start_date, end_date, cron) VALUES ('Learn the guitar', '2020-01-01', '2020-08-1', 'everyday at 1000');
INSERT INTO goals (name, start_date, end_date, cron) VALUES ('Reading War and Peace', '2015-09-18', '2020-09-18', 'everyday at 1900');
INSERT INTO goals (name, start_date, end_date, cron) VALUES ('Codewars', '2019-10-14', '2020-10-14', 'everyday at 900');


-- Nags table seeds --
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you practice guitar for 45 mins today?', 'true', '2020-02-27', '1000');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you practice guitar for 45 mins today?', 'true', '2020-02-26', '1000');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you practice guitar for 45 mins today?', 'true', '2020-02-25', '1000');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you read War and Peace today?', 'true', '2020-02-27', '1900');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you read War and Peace today?', 'false', '2020-02-26', '1900');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you read War and Peace today?', 'true', '2020-02-25', '1900');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you do CodeWars today?', 'true', '2020-02-27', '900');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you do CodeWars today?', 'false', '2020-02-26', '900');
INSERT INTO nags (name, completion, date, time ) VALUES ('Did you do CodeWars today?', 'false', '2020-02-25', '900');