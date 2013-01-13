/**
 * copyright VisualRendezvous
 */
package models

import anorm.Pk

/**
 * @author Akshay Sharma
 * Dec 25, 2012
 */

trait Asset extends Capture {
  def id: Pk[Long]
  def extension: String
  def content: String
  val assetType: String
}

case class Image(val id: Pk[Long], val email: String, val comment: String, val imageId: String,  
    val extension: String, val ref: String) extends Asset {
	def url: String = 	ImageResource(imageId + "." + extension).fileUrl
	def content: String = imageId
	val assetType: String = "image"
}

case class Audio(val id: Pk[Long], val email: String, val comment: String, val audioId: String,  
    val extension: String, val ref: String) extends Asset {
	def url: String = 	AudioResource(audioId + "." + extension).fileUrl
	def content: String = audioId
	val assetType: String = "audio"
}

case class Speech2Text(val id: Pk[Long], val email: String, val comment: String, val speech2Text: String,
  val ref: String) extends Asset {
  def extension: String = ""
  def content: String = speech2Text
  val assetType: String = "s2t"
}
