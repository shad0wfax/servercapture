/**
 * copyright VisualRendezvous
 */
package models.email

import java.io.File
import java.io.FileInputStream

import org.apache.commons.io.IOUtils

import models.ImageCapture
import models.Speech2TextCapture
import play.Logger
import scalaj.http.Http
import scalaj.http.MultiPart


/**
 * @author Akshay Sharma
 * Jan 5, 2013
 */
object Emailer {
  private val key = "key-0qiaqkgo4ts6zczzwdt808e4-rk-31w3"
  private val url = "https://api.mailgun.net/v2/rendezvouswith.us.mailgun.org/messages"
	
//  def email(capture: Capture) = capture match {
//    case ImageCapture(imageCapture) => email(imageCapture)
//    
//  } 
//  
  def send(emailable: Emailable) = emailable.email match {
    case null => Logger.debug("Was passed null as email")
    case "" => Logger.debug("Was passed null as email")
    case _ => process(emailable)     
  }
  
  private def process(emailable: Emailable) = emailable match {
    case ic: ImageCapture => emailImageCapture(ic)
    case s2tc: Speech2TextCapture => emailS2TCapture(s2tc)
    case _ => Logger.debug("Unknown Capture type passed: " + emailable + " Will not email");
  }

  private def emailImageCapture(capture: ImageCapture) = {
    val file = new FileInputStream(new File(capture.url))
    val response = Http
      .multipart(url, MultiPart("attachment", "attachment.png", "image/png", IOUtils.toByteArray(file)))
      .auth("api", key)
      .params(sendParams(capture))
      .asString
      handle(response)
  }
  
  private def emailS2TCapture(capture: Speech2TextCapture) = {
    val response = Http
      .post(url)
      .auth("api", key)
      .params(sendParams(capture, "Speech to text data sent: \n" + capture.speech2Text))
      .asString
      handle(response)
  }
  
  private def sendParams(capture: models.Capture, additionalText: String = ""): List[(String, String)] = {
    List("from" -> "Visual Rendezvous <postmaster@rendezvouswith.us.mailgun.org>",
     "to" -> capture.email,
     "subject" -> "Regarding your issue/feedback",
     "text" -> ("We received your inputs and we will be following up with you shortly.\nHere is a reference of what you sent us:\nComments: " 
         + capture.comment + "\n" + additionalText))
  }

  private def handle(response: String) = {
    Logger.debug("Back from email service:- " + response)
    // TODO:
    // Store the response somewhere to have an audit?? 
  }
  
}