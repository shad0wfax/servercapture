# --- First database schema
 
# --- !Ups

CREATE SEQUENCE image_id_seq;

CREATE TABLE image_capture (
    id integer NOT NULL DEFAULT nextval('image_id_seq') primary key,
    image_id varchar(64)  not null,
    feedback varchar(2000)
);
 
# --- !Downs
 
DROP TABLE image_capture;
DROP SEQUENCE image_id_seq;