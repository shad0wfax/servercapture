/**
 * copyright VisualRendezvous
 */
package models

import akka.actor.Actor
import anorm.NotAssigned
import play.Logger
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import java.util.Date

/**
 * @author Akshay Sharma
 * Jan 5, 2013
 */
class Capture extends Actor {
  
  def receive = {
    case Image(jsonData) => {
      val jsonString: String = jsonData(0)
	  val json: JsValue = Json.parse(jsonString)
	  //Logger.debug("Testing to see if data :: json = \n" + json)
	  val email = element(json \\ "email")
	  val comment = element(json \\ "comments")
	  val image = element(json \\ "image")
		
	  Logger.debug(email + "\n\n")
	  Logger.debug(comment + "\n\n")
	  Logger.debug(image + "\n\n")
		
	  val imageData: String = image.substring("data:image/png;base64,".length())
	  val capture = ImageCapture.createFromBase64(ImageCapture(NotAssigned, email, comment, ""), imageData)
	
	  // Testing:
	  println(ImageCapture.all())
    }
  }
  
  private def element(jsonObj: Seq[JsValue]): String = jsonObj match {
    case Nil => ""
    case _ => jsonObj(0).asOpt[String].get
  }
}

// Add more capture types for future
case class Image(jsonData: Seq[String])
