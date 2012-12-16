import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "servercapture"
    val appVersion      = "1.0-SNAPSHOT"

    val appDependencies = Seq(
      // Add your project dependencies here,
      "commons-codec" % "commons-codec" % "1.7",
      "commons-io" % "commons-io" % "2.4"
    )

    val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
      // Add your own project settings here      
    )

}
