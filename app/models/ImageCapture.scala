/**
 * copyright VisualRendezvous
 */
package models

import play.api._
import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

import org.apache.commons.codec.binary.Base64
import org.apache.commons.io.IOUtils
import java.io.FileOutputStream
import java.io.File
import java.util.UUID


/**
 * @author Akshay Sharma
 * Dec 25, 2012
 */
case class ImageCapture(val id: Pk[Long], val email: String, val comment: String, val imageId: String,  val extension: String) {
	val url: String = ImageCapture.imageDir + imageId + "." + extension
}

object ImageCapture {
	val imageDir = Play.current.configuration.getString("image.store.dir").get

	/**
   * Parse a User from a ResultSet
   */
  val simple = {
    get[Pk[Long]]("image_capture.id") ~
    get[String]("image_capture.email") ~
    get[String]("image_capture.comment") ~
    get[String]("image_capture.image_id") ~
    get[String]("image_capture.extension") map {
      case id~email~comment~imageId~extension => ImageCapture(id, email, comment, imageId, extension)
    }
  }

  
  def createFromBase64(capture: ImageCapture, base64Image: String): ImageCapture = {
    val captureWithImageId = createImageOnFile(capture, base64Image)
    
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into image_capture(image_id, email, comment) values (
            {image_id}, {email}, {comment}, {extension}
          )
        """
      ).on(
        'email -> captureWithImageId.email,
        'comment -> captureWithImageId.comment,
        'image_id -> captureWithImageId.imageId,
        'extension -> captureWithImageId.extension
      ).executeUpdate()
    }
    
    // TODO: Copy over the auto generated id fieled (might need a select)
    capture
  }
  
  private def createImageOnFile(capture: ImageCapture, base64Image: String): ImageCapture = {
	val base64: Base64 = new Base64
	val fileName = UUID.randomUUID().toString()
	val file = new FileOutputStream(new File(imageDir + fileName + "." + capture.extension));
	val decoded = base64 decode(base64Image)
	
	//println("decoded image data = \n\n" + decoded)

	// TODO: Rewrite this using the Loan pattern? https://wiki.scala-lang.org/display/SYGN/Loan
	try {
		IOUtils.write(decoded, file);
	} finally {
	  if (file != null) file.close();
	}
	
    capture.copy(imageId = fileName)
  } 
  
  def all(): Seq[ImageCapture] = {
    DB.withConnection { implicit connection =>
      SQL("select * from image_capture").as(ImageCapture.simple *)
    }
  }
}