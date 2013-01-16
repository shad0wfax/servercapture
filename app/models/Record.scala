/**
 * copyright VisualRendezvous
 */
package models

import akka.actor.Actor
import play.Logger
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import java.util.Date
import models.email.Emailer
import models.dao.AssetDao

/**
 * @author Akshay Sharma
 * Jan 5, 2013
 */
class Record extends Actor {
  
  def receive = {
    case CaptureImage(jsonData) => saveImage(asJson(jsonData))
    case CaptureSpeech2Text(jsonData) => saveS2T(asJson(jsonData))
    case CaptureFlashAudio(jsonData) => saveFlashAudio(asJson(jsonData))   
  }
  
  private def saveImage(json: JsValue) = {
    //Logger.debug("Testing to see if data :: json = \n" + json)
    val email = element(json \\ "email")
    val comment = element(json \\ "comments")
    val imageB64 = element(json \\ "image")
    val ref = element(json \\ "ref")
		
    Logger.debug("email = [" + email + "]\t comment = [" + comment + "]\t ref = [" + ref + "]\t")
    // Too big an output, so skipping for now
    //Logger.debug({image} + "\n\n")
		
    val imageData: String = imageB64.substring("data:image/png;base64,".length())
    val image = AssetDao.createAssetFromBase64(Image(email, comment, "", "png", ref), imageData)
	
    // Send email if provided
    Emailer.send(image)
    
    // Testing:
    Logger.debug("" + AssetDao.all(image))
  }

  private def saveS2T(json: JsValue) = {
//    Logger.debug("Testing to see if data :: json = \n" + json)
    val email = element(json \\ "email")
    val comment = element(json \\ "comments")
    val speech2text = element(json \\ "speech2text")
    val ref = element(json \\ "ref")
		
    Logger.debug("email = [" + email + "]\t comment = [" + comment + "]\t ref = [" + ref + "]\t speech2text = ["
        + speech2text + "]\t")
        
    val s2t = AssetDao.create(Speech2Text(email, comment, speech2text, ref))    
		
    // Send email if provided
    Emailer.send(s2t)
    
    // Testing:
    Logger.debug("" + AssetDao.all(s2t))
  }

  private def saveFlashAudio(json: JsValue) = {
//    Logger.debug("Testing to see if data :: json = \n" + json)
    val email = element(json \\ "email")
    val comment = element(json \\ "comments")
    val audioBase64 = element(json \\ "audiob64")
    val ref = element(json \\ "ref")
		
    Logger.debug("email = [" + email + "]\t comment = [" + comment + "]\t ref = [" + ref + "]\t")
    // Too big an output, so skipping for now
    //Logger.debug({image} + "\n\n")
		
    val audioData: String = audioBase64.substring("data:audio/wav;base64,".length())
    val audio = AssetDao.createAssetFromBase64(Audio(email, comment, "", "wav", ref), audioData)
	
    // Send email if provided
    Emailer.send(audio)
    
    // Testing:
    Logger.debug("" + AssetDao.all(audio))
  }

  private def element(jsonObj: Seq[JsValue]): String = jsonObj match {
    case Nil => ""
    case _ => jsonObj(0).asOpt[String].get
  }
  
  private def asJson(jsonData: Seq[String]): play.api.libs.json.JsValue = {
    val jsonString: String = jsonData(0)
    Json.parse(jsonString)
  }
  
}

// Add more capture types for future
case class CaptureImage(jsonData: Seq[String])
case class CaptureSpeech2Text(jsonData: Seq[String])
case class CaptureFlashAudio(jsonData: Seq[String])