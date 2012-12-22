import scala.collection.JavaConversions._
object environment_vars {
  println("Welcome to the Scala worksheet")       //> Welcome to the Scala worksheet
  val envs = System.getProperties().entrySet()    //> envs  : java.util.Set[java.util.Map.Entry[java.lang.Object,java.lang.Object]
                                                  //| ] = [java.runtime.name=Java(TM) SE Runtime Environment, sun.boot.library.pat
                                                  //| h=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Libraries, jav
                                                  //| a.vm.version=20.12-b01-434, awt.nativeDoubleBuffering=true, gopherProxySet=f
                                                  //| alse, mrj.build=11M3909, java.vm.vendor=Apple Inc., java.vendor.url=http://w
                                                  //| ww.apple.com/, path.separator=:, java.vm.name=Java HotSpot(TM) 64-Bit Server
                                                  //|  VM, file.encoding.pkg=sun.io, sun.java.launcher=SUN_STANDARD, user.country=
                                                  //| US, sun.os.patch.level=unknown, java.vm.specification.name=Java Virtual Mach
                                                  //| ine Specification, user.dir=/Applications/Scala/Scala.app/Contents/MacOS, ja
                                                  //| va.runtime.version=1.6.0_37-b06-434-11M3909, java.awt.graphicsenv=apple.awt.
                                                  //| CGraphicsEnvironment, java.endorsed.dirs=/System/Library/Java/JavaVirtualMac
                                                  //| hines/1.6.0.jdk/Contents/Home/lib/endorsed, os.arch=x86_64, java.io.tmpdir=/
                                                  //| var/folders/9j/9ghj1zv95
                                                  //| Output exceeds cutoff limit.
  val envskey = System.getProperties().getProperty("user.home")
                                                  //> envskey  : java.lang.String = /Users/srivatsasharma
  
  //for (env <- envs) println env
  
  envs.foreach (print(_))                         //> java.runtime.name=Java(TM) SE Runtime Environmentsun.boot.library.path=/Syst
                                                  //| em/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Librariesjava.vm.vers
                                                  //| ion=20.12-b01-434awt.nativeDoubleBuffering=truegopherProxySet=falsemrj.build
                                                  //| =11M3909java.vm.vendor=Apple Inc.java.vendor.url=http://www.apple.com/path.s
                                                  //| eparator=:java.vm.name=Java HotSpot(TM) 64-Bit Server VMfile.encoding.pkg=su
                                                  //| n.iosun.java.launcher=SUN_STANDARDuser.country=USsun.os.patch.level=unknownj
                                                  //| ava.vm.specification.name=Java Virtual Machine Specificationuser.dir=/Applic
                                                  //| ations/Scala/Scala.app/Contents/MacOSjava.runtime.version=1.6.0_37-b06-434-1
                                                  //| 1M3909java.awt.graphicsenv=apple.awt.CGraphicsEnvironmentjava.endorsed.dirs=
                                                  //| /System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/endorse
                                                  //| dos.arch=x86_64java.io.tmpdir=/var/folders/9j/9ghj1zv95jqbq9zc2_yjyssc0000gp
                                                  //| /T/line.separator=
                                                  //| java.vm.specification.vendor=Sun Microsystems Inc.os.name=Mac OS Xsun.jnu.en
                                                  //| c
                                                  //| Output exceeds cutoff limit.
  
  
}