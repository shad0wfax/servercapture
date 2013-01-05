/**
 * copyright VisualRendezvous
 */
package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._
import models.ImageCapture
import anorm._
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._
import scala.collection.immutable.Map
import scala.concurrent.duration._
import play.libs.Akka
import models.Capture
import models.Image
import akka.actor.Props

//

/**
 * @author Akshay Sharma
 * Dec 23, 2012
 */
object Application extends Controller {
  
  def index = Action {
//    Ok(views.html.index("Your new application is ready."))
	  Redirect("/assets/index.html")
    
  }
  
  
  // 10 MB size limit for now
  def captureImage = Action(parse.urlFormEncoded(maxLength = 1024 * 1024)) { request =>
	val body: Map[String, Seq[String]] = request.body
	val dataBody: Option[Seq[String]] = body.get("data") 

	// Expecting data body
	// println("Testing to see if data :: dataBody = " + dataBody)
	
	dataBody.map { datas =>
	  val captureActor = Akka.system.actorOf(Props(new Capture()))
	  val imageCapture = new Image(datas)
	  
	  // TODO: Improve Akka usage - follow webchat sample instead of scheduling mechanism (message sending)
	  // Schedule right away
	  Akka.system.scheduler.scheduleOnce(0 second, captureActor, imageCapture)
	  
	  Ok("200")
	}.getOrElse {
		println("data parameter not sent in the request body")
    	BadRequest("Expecting urlFormEncoded data request body")  
  	}
  }
  
}