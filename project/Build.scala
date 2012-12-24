import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "servercapture"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    anorm,
    "commons-codec" % "commons-codec" % "1.7",
    "commons-io" % "commons-io" % "2.4"
    
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  )

}
