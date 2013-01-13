/**
 * copyright VisualRendezvous
 */
package models

import models.email.Emailable
import java.util.Date

/**
 * @author Akshay Sharma
 * Dec 25, 2012
 */
abstract class Asset extends Capture {
  def id: Long
  def content: String
  val assetType: String
  def created: Date
}

/**
 * Any capture should be emailable and contain an optional comment and ref fields :)
 * @author Akshay Sharma
 * Jan 7, 2013
 */
trait Capture extends Emailable {
  def comment: String
  def ref: String
}

trait FileAsset {
  def extension: String
  def assetId: String
  def url: String
}

case class Image(val email: String, val comment: String, val imageId: String, val extension: String, 
  val ref: String, val id: Long = -1, val created: Date = new Date()) extends Asset with FileAsset {
	def url: String = 	ImageResource(imageId + "." + extension).fileUrl
	def content: String = imageId
	def assetId: String = imageId
	val assetType: String = "image"
}

case class Audio(val email: String, val comment: String, val audioId: String, val extension: String, 
  val ref: String, val id: Long = -1,  val created: Date = new Date()) extends Asset with FileAsset {
	def url: String = 	AudioResource(audioId + "." + extension).fileUrl
	def content: String = audioId
	def assetId: String = audioId
	val assetType: String = "audio"
}

case class Speech2Text(val email: String, val comment: String, val speech2Text: String, val ref: String, 
    val id: Long = -1, val created: Date = new Date()) extends Asset {
    def content: String = speech2Text
    val assetType: String = "s2t"
}
