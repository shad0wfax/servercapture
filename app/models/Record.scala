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
import models.email.Emailer

/**
 * @author Akshay Sharma
 * Jan 5, 2013
 */
class Record extends Actor {
  
  def receive = {
    case Image(jsonData) => saveImage(jsonData)
    case Speech2Text(jsonData) => saveS2T(jsonData)
    
  }
  
  private def saveImage(jsonData: Seq[String]) = {
    val jsonString: String = jsonData(0)
    val json: JsValue = Json.parse(jsonString)
    
    //Logger.debug("Testing to see if data :: json = \n" + json)
    val email = element(json \\ "email")
    val comment = element(json \\ "comments")
    val image = element(json \\ "image")
    val ref = element(json \\ "ref")
		
    Logger.debug("email = [" + email + "]\t comment = [" + comment + "]\t ref = [" + ref + "]\t")
    // Too big an output, so skipping for now
    //Logger.debug({image} + "\n\n")
		
    val imageData: String = image.substring("data:image/png;base64,".length())
    val capture = ImageCapture.createFromBase64(ImageCapture(NotAssigned, email, comment, "", "png", ref), imageData)
	
    // Send email if provided
    Emailer.send(capture)
    
    // Testing:
    println(ImageCapture.all())
  }

  private def saveS2T(jsonData: Seq[String]) = {
    val jsonString: String = jsonData(0)
    val json: JsValue = Json.parse(jsonString)
    
    Logger.debug("Testing to see if data :: json = \n" + json)
    val email = element(json \\ "email")
    val comment = element(json \\ "comments")
    val speech2text = element(json \\ "speech2text")
    val ref = element(json \\ "ref")
		
    Logger.debug("email = [" + email + "]\t comment = [" + comment + "]\t ref = [" + ref + "]\t speech2text = ["
        + speech2text + "]\t")
        
    val capture = Speech2TextCapture.create(Speech2TextCapture(NotAssigned, email, comment, speech2text, ref))    
		
    // Send email if provided
    Emailer.send(capture)
    
    // Testing:
    println(Speech2TextCapture.all())
  }

  private def element(jsonObj: Seq[JsValue]): String = jsonObj match {
    case Nil => ""
    case _ => jsonObj(0).asOpt[String].get
  }
  
}

// Add more capture types for future
case class Image(jsonData: Seq[String])
case class Speech2Text(jsonData: Seq[String])