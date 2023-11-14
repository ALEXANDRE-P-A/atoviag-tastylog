INSERT INTO
  t_user (`name`, `email`, `password`, `description`, `created`, `updated`, `origin_password`, `activation`)
VALUES
  (?, ?, ?, ?, now(), now(), ?, '1');