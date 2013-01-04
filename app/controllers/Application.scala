/**
 * copyright VisualRendezvous
 */
package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._
import models.ImageCapture

import anorm._

//

/**
 * @author Akshay Sharma
 * Dec 23, 2012
 */
object Application extends Controller {
  
  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }
  
  
  // 10 MB size limit for now
  def captureImage = Action(parse.urlFormEncoded(maxLength = 1024 * 1024)) { request =>
	val body: Map[String, Seq[String]] = request.body
	val dataBody: Option[Seq[String]] = body.get("data") 

	// Expecting data body
	// println("Testing to see if data :: dataBody = " + dataBody)
	
	dataBody.map { datas =>
		val jsonString: String = datas(0)

		val json: JsValue = Json.parse(jsonString)

		//Logger.debug("Testing to see if data :: json = \n" + json)

		val email = element(json \\ "email")
		val comment = element(json \\ "comments")
		val image = element(json \\ "image")
		
		Logger.debug(email + "\n\n")
		Logger.debug(comment + "\n\n")
		Logger.debug(image + "\n\n")
		
		val imageData: String = image.substring("data:image/png;base64,".length())
		val capture = ImageCapture.createFromBase64(ImageCapture(NotAssigned, comment, ""), imageData)

		// Testing:
		println(ImageCapture.all())
		
		Ok("200")
	}.getOrElse {
		println("data parameter not sent in the request body")
    	BadRequest("Expecting urlFormEncoded data request body")  
  	}
  }
  
  private def element(jsonObj: Seq[JsValue]): String = jsonObj match {
    case Nil => ""
    case _ => jsonObj(0).asOpt[String].get
  }
  
  
  
  
  
  
  
}