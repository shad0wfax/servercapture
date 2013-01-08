/**
 * copyright VisualRendezvous
 */
package models

import play.api._
import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._


/**
 * @author Akshay Sharma
 * Jan 7, 2013
 */
case class Speech2TextCapture(val id: Pk[Long], val email: String, val comment: String, val speech2Text: String,
    val ref: String) extends Capture
    
object Speech2TextCapture {
  /**
   * Parse a Speech2TextCapture from a ResultSet
   */
  val simple = {
    get[Pk[Long]]("speech2text_capture.id") ~
    get[String]("speech2text_capture.email") ~
    get[String]("speech2text_capture.comment") ~
    get[String]("speech2text_capture.speech2text") ~
    get[String]("speech2text_capture.ref") map {
      case id~email~comment~speech2text~ref => Speech2TextCapture(id, email, comment, speech2text, ref)
    }
  }

  def create(s2t: Speech2TextCapture): Speech2TextCapture = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into speech2text_capture(email, comment, speech2text, ref) values (
            {email}, {comment}, {speech2text}, {ref}
          )
        """
      ).on(
        'email -> s2t.email,
        'comment -> s2t.comment,
        'speech2text-> s2t.speech2Text,
        'ref -> s2t.ref
      ).executeUpdate()
    }
    
    // TODO: get the inserted id updated.
    s2t
  }
  
  def all(): Seq[Speech2TextCapture] = {
    DB.withConnection { implicit connection =>
      SQL("select * from speech2text_capture").as(Speech2TextCapture.simple *)
    }
  }

}