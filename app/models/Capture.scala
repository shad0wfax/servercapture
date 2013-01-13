/**
 * copyright VisualRendezvous
 */
package models

import models.email.Emailable
import models.email.Emailable

/**
 * Any capture should be emailable and contain an optional comment field :)
 * @author Akshay Sharma
 * Jan 7, 2013
 */
trait Capture extends Emailable {
  def comment: String
  def ref: String
}