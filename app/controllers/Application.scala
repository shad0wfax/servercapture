/**
 * copyright VisualRendezvous
 */
package controllers

import scala.concurrent.duration.DurationInt
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.Action
import play.api.mvc.Controller
import models.dao.AssetDao
import models.Asset

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
    val assets:Seq[Asset] = AssetDao.all.sortWith((s, t) => s.created.compareTo(t.created) > 0)
    Ok(views.html.dashboard("Dashboard - VisualRendezvous", assets))
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
  
  def features = Action {
    Ok(views.html.features("Features - VisualRendezvous"))
  }
  
}