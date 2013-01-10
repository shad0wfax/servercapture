/**
 * copyright VisualRendezvous
 */
package controllers

import scala.collection.immutable.Map
import scala.concurrent.duration.DurationInt

import akka.actor.Props
import models.Image
import models.Record
import models.Speech2Text
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.Action
import play.api.mvc.Controller
import play.api.mvc.Request
import play.libs.Akka

//

/**
 * @author Akshay Sharma
 * Dec 23, 2012
 */
object Application extends Controller {
  
  def index = Action {
    Ok(views.html.demo("Demo - VisualRendezvous"))
  }
  
  def dashboard = Action {
    Ok(views.html.dashboard("Dashboard - VisualRendezvous"))
  }
  
  def how = Action {
    Ok(views.html.how("How it works - VisualRendezvous"))
  }
  
  def about = Action {
    Ok(views.html.about("About - VisualRendezvous"))
  }
  
  def usecase = Action {
    Ok(views.html.usecase("Usecases - VisualRendezvous"))
  }
  
}