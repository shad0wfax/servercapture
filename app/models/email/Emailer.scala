/**
 * copyright VisualRendezvous
 */
package models.email

import scala.collection.immutable.Map
import models.ImageCapture
import play.Logger
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.ws.Response
import play.api.libs.ws.WS
import scalaj.http.Http
import scalaj.http.MultiPart
import java.io.File
import org.apache.commons.io.IOUtils
import java.io.FileInputStream


/**
 * @author Akshay Sharma
 * Jan 5, 2013
 */
object Emailer {
	
  def email(imageCapture: ImageCapture) = {
    imageCapture.email match {
      case null => Logger.debug("Was passed null as email")
      case "" => Logger.debug("Was passed null as email")
      case _ => call(imageCapture)     
    } 
    
  }
  
  private def call(capture: ImageCapture) = {
//	WS
//	  .url("https://api.mailgun.net/v2/rendezvouswith.us.mailgun.org/messages")
//	  .withAuth("api", "key-0qiaqkgo4ts6zczzwdt808e4-rk-31w3", com.ning.http.client.Realm.AuthScheme.BASIC)
//	  .post(prepare(capture))
//	  .map(response => handle(response));
    
    
    val file = new FileInputStream(new File(capture.url))
    
    //case class MultiPart(val name: String, val filename: String, val mime: String, val data: Array[Byte])

    val response = Http
      .multipart("https://api.mailgun.net/v2/rendezvouswith.us.mailgun.org/messages", 
          MultiPart("attachment", "attachment.png", "image/png", IOUtils.toByteArray(file)))
      .auth("api", "key-0qiaqkgo4ts6zczzwdt808e4-rk-31w3")
      .params(
         "from" -> "Visual Rendezvous <postmaster@rendezvouswith.us.mailgun.org>",
         "to" -> capture.email,
         "subject" -> "Regarding your issue/feedback",
         "text" -> ("We received your inputs and we will be following up with you shortly. Here is a reference of what you sent us: " + capture.comment)
         //"html" -> ("<html><p>Visual data</p> <img src=\"cid:attachment.png\"></html>") 
      )
      .asString
      handle(response)
  }
  
  private def handle(response: String) = {
    Logger.debug("Back from email service:- " + response)
    // TODO:
    // Store the response somewhere to have an audit?? 
  }
  
}