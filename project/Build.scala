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
    "commons-io" % "commons-io" % "2.4",
    //"org.apache.httpcomponents" % "httpclient" % "4.2.1"
    "org.scalaj" %% "scalaj-http" % "0.3.6"
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  )

}
