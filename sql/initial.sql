create extension "uuid-ossp";

CREATE TABLE IF NOT EXISTS users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying(255) NOT NULL,
    password text NOT NULL,
    name character varying(255) NOT NULL,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS tokens (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tokens PRIMARY KEY (id),
    CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) MATCH SIMPLE
     ON DELETE CASCADE
     ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS roles
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    role_name character varying(255) NOT NULL,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uq_roles_role_name UNIQUE (role_name)
);

CREATE TABLE IF NOT EXISTS users_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    CONSTRAINT pk_users_roles PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_users_roles_user FOREIGN KEY (user_id) REFERENCES users (id) MATCH SIMPLE
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
    CONSTRAINT fk_users_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) MATCH SIMPLE
      ON DELETE CASCADE
      ON UPDATE NO ACTION
)
