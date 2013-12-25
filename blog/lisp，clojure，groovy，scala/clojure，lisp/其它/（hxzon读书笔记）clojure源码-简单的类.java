//（hxzon读书笔记）clojure源码-简单的类.java

//==========
/* rich Nov 25, 2008 */

package clojure.lang;

public interface Fn{
}

//==========
/* rich Mar 27, 2006 8:40:19 PM */

package clojure.lang;

public class Box{

public Object val;

public Box(Object val){
        this.val = val;
}
}

//==========
package clojure.lang;

public class Binding<T>{
public T val;
public final Binding rest;

public Binding(T val){
        this.val = val;
        this.rest = null;
}

public Binding(T val, Binding rest){
        this.val = val;
        this.rest = rest;
}
}
