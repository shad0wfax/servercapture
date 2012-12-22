import scala.collection.JavaConversions._
object environment_vars {;import org.scalaide.worksheet.runtime.library.WorksheetSupport._; def main(args: Array[String])=$execute{;$skip(111); 
  println("Welcome to the Scala worksheet");$skip(47); 
  val envs = System.getProperties().entrySet();System.out.println("""envs  : java.util.Set[java.util.Map.Entry[java.lang.Object,java.lang.Object]] = """ + $show(envs ));$skip(64); 
  val envskey = System.getProperties().getProperty("user.home");System.out.println("""envskey  : java.lang.String = """ + $show(envskey ));$skip(66); 
  
  //for (env <- envs) println env
  
  envs.foreach (print(_))}
  
  
}