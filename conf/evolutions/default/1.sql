# --- First database schema
 
# --- !Ups

CREATE SEQUENCE image_id_seq;
CREATE SEQUENCE s2t_id_seq;

CREATE TABLE image_capture (
    id integer NOT NULL DEFAULT nextval('image_id_seq') primary key,
    image_id varchar(64)  not null,
    email varchar(500),
    comment varchar(2000),
    extension varchar(20),
    ref varchar(50)
);
 
CREATE TABLE speech2text_capture (
    id integer NOT NULL DEFAULT nextval('s2t_id_seq') primary key,
    email varchar(500),
    comment varchar(2000),
    speech2text varchar(max),
    ref varchar(50)
);
 
# --- !Downs
 
DROP TABLE image_capture;
DROP TABLE speech2text_capture;
DROP SEQUENCE image_id_seq;
DROP SEQUENCE s2t_id_seq;
