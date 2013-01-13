# --- First database schema
 
# --- !Ups

CREATE SEQUENCE asset_id_seq;

CREATE TABLE asset_capture (
    id integer NOT NULL DEFAULT nextval('asset_id_seq') primary key,
    content varchar(max) not null,
    email varchar(500),
    comment varchar(2000),
    extension varchar(20),
    asset_type varchar(50),
    ref varchar(50),
    created timestamp
);
 
# --- !Downs
 
DROP TABLE asset_capture;
DROP SEQUENCE asset_id_seq;
