/**
 * copyright VisualRendezvous
 */
package controllers.capture

import scala.collection.immutable.Map
import scala.concurrent.duration.DurationInt
import akka.actor.Props
import models.CaptureImage
import models.Record
import models.CaptureSpeech2Text
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.Action
import play.api.mvc.Controller
import play.api.mvc.Request
import play.libs.Akka
import java.io.File
import java.util.UUID
import models.AudioResource
import org.apache.commons.codec.binary.Base64
import org.apache.commons.io.IOUtils
import java.io.FileOutputStream
import models.CaptureFlashAudio
import play.Logger

/**
 * @author Akshay Sharma
 * Jan 10, 2013
 */
object Capture extends Controller {
  
  // 10 MB size limit for now
  def captureImage = Action(parse.urlFormEncoded(maxLength = 10 * 1024 * 1024)) { request =>
    capture(request, "image")
  }
  
  // 10 MB size limit for now
  def speechToText = Action(parse.urlFormEncoded(maxLength = 10 * 1024 * 1024)) { request =>
    capture(request, "speech2Text")
  }
  
    // 10 MB size limit for now
  def captureFlashAudio = Action(parse.urlFormEncoded(maxLength = 10 * 1024 * 1024)) { request =>
    capture(request, "audioFlash")
  }
  

  private def capture(request: Request[Map[String,Seq[String]]], capType: String) = {
	val body: Map[String, Seq[String]] = request.body
	val dataBody: Option[Seq[String]] = body.get("data") 

	// Expecting data body
	// println("Testing to see if data :: dataBody = " + dataBody)
	
	dataBody.map { datas =>
	  val captureActor = Akka.system.actorOf(Props(new Record()))
	  val capture = capType match {
	    case "image" => CaptureImage(datas)
	    case "speech2Text" => CaptureSpeech2Text(datas)
	    case "audioFlash" => CaptureFlashAudio(datas) 
	  }
	  
	  // TODO: Improve Akka usage - follow webchat sample instead of scheduling mechanism (message sending)
	  // Schedule right away
	  Akka.system.scheduler.scheduleOnce(0 second, captureActor, capture)
	  
	  Ok("200")
	}.getOrElse {
		Logger.debug("data parameter not sent in the request body")
    	BadRequest("Expecting urlFormEncoded data request body")  
  	}
    
  }
  
}