/**
 * copyright VisualRendezvous
 */
package models

import play.api.Play
import java.io.File

/**
 * @author Akshay Sharma
 * Jan 10, 2013
 */
trait CaptureResource {
  private val imageDir = Play.current.configuration.getString("image.store.dir").get
  private val videoDir = Play.current.configuration.getString("video.store.dir").get
  private val audioDir = Play.current.configuration.getString("audio.store.dir").get

  def fileNameWithExtn: String
  
  def fileUrl() = this match {
    case ImageResource(fileNameWithExtn) => imageDir + fileNameWithExtn
    case VideoResource(fileNameWithExtn) => videoDir + fileNameWithExtn
    case AudioResource(fileNameWithExtn) => audioDir + fileNameWithExtn
  }

  def file() = this match {
    case ImageResource(fileNameWithExtn) => new File(imageDir + fileNameWithExtn)
    case VideoResource(fileNameWithExtn) => new File(videoDir + fileNameWithExtn)
    case AudioResource(fileNameWithExtn) => new File(audioDir + fileNameWithExtn)
  }
}

object CaptureResource {
  def from(assetCapture: Asset)(fn: String) = assetCapture match {
    case ic: Image => ImageResource(fn)
    case ac: Audio => AudioResource(fn)
  }
}

case class ImageResource(fileNameWithExtn: String) extends CaptureResource
case class VideoResource(fileNameWithExtn: String) extends CaptureResource
case class AudioResource(fileNameWithExtn: String) extends CaptureResource