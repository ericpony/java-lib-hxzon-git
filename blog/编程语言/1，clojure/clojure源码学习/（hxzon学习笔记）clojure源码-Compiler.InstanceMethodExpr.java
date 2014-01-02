//（hxzon学习笔记）clojure源码-Compiler.InstanceMethodExpr.java
//https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/Compiler.java

//表达式：实例方法
static class InstanceMethodExpr extends MethodExpr {
    public final Expr target;
    public final String methodName;
    public final IPersistentVector args;
    public final String source;
    public final int line;
    public final int column;
    public final Symbol tag;
    public final java.lang.reflect.Method method;

    final static Method invokeInstanceMethodMethod = Method.getMethod("Object invokeInstanceMethod(Object,String,Object[])");

    public InstanceMethodExpr(String source, int line, int column, //
            Symbol tag, Expr target, String methodName, IPersistentVector args) {
        this.source = source;
        this.line = line;
        this.column = column;
        this.args = args;
        this.methodName = methodName;
        this.target = target;
        this.tag = tag;//类型提示
        if (target.hasJavaClass() && target.getJavaClass() != null) {
            //查找方法名、参数个数、类型一致的方法
            List methods = Reflector.getMethods(target.getJavaClass(), args.count(), methodName, false);
            if (methods.isEmpty()) {
                method = null;
                //throw new IllegalArgumentException("No matching method found");
            } else {
                int methodidx = 0;
                if (methods.size() > 1) {
                    ArrayList<Class[]> params = new ArrayList();
                    ArrayList<Class> rets = new ArrayList();
                    for (int i = 0; i < methods.size(); i++) {
                        java.lang.reflect.Method m = (java.lang.reflect.Method) methods.get(i);
                        params.add(m.getParameterTypes());
                        rets.add(m.getReturnType());
                    }
                    methodidx = getMatchingParams(methodName, params, args, rets);
                }
                java.lang.reflect.Method m = (java.lang.reflect.Method) (methodidx >= 0 ? methods.get(methodidx) : null);
                if (m != null && !Modifier.isPublic(m.getDeclaringClass().getModifiers())) {
                    //public method of non-public class, try to find it in hierarchy
                    m = Reflector.getAsMethodOfPublicBase(m.getDeclaringClass(), m);
                }
                method = m;
            }
        } else {
            method = null;
        }

        if (method == null && RT.booleanCast(RT.WARN_ON_REFLECTION.deref())) {
            RT.errPrintWriter().format("Reflection warning, %s:%d:%d - call to %s can't be resolved.\n", //
                    SOURCE_PATH.deref(), line, column, methodName);
        }
    }

    public Object eval() {
        try {
            Object targetval = target.eval();
            Object[] argvals = new Object[args.count()];
            for (int i = 0; i < args.count(); i++) {
                argvals[i] = ((Expr) args.nth(i)).eval();//求值每个参数
            }
            if (method != null) {
                LinkedList ms = new LinkedList();
                ms.add(method);
                return Reflector.invokeMatchingMethod(methodName, ms, targetval, argvals);
            }
            return Reflector.invokeInstanceMethod(targetval, methodName, argvals);
        } catch (Throwable e) {
            if (!(e instanceof CompilerException)) {
                throw new CompilerException(source, line, column, e);
            } else {
                throw (CompilerException) e;
            }
        }
    }

    public boolean canEmitPrimitive() {
        return method != null && Util.isPrimitive(method.getReturnType());//方法的返回值是原始类型
    }

    public void emitUnboxed(C context, ObjExpr objx, GeneratorAdapter gen) {
        gen.visitLineNumber(line, gen.mark());
        if (method != null) {
            Type type = Type.getType(method.getDeclaringClass());
            target.emit(C.EXPRESSION, objx, gen);
            //if(!method.getDeclaringClass().isInterface())
            gen.checkCast(type);
            MethodExpr.emitTypedArgs(objx, gen, method.getParameterTypes(), args);
            if (context == C.RETURN) {
                ObjMethod method = (ObjMethod) METHOD.deref();
                method.emitClearLocals(gen);
            }
            Method m = new Method(methodName, Type.getReturnType(method), Type.getArgumentTypes(method));
            if (method.getDeclaringClass().isInterface()) {
                gen.invokeInterface(type, m);
            } else {
                gen.invokeVirtual(type, m);
            }
        } else {
            throw new UnsupportedOperationException("Unboxed emit of unknown member");
        }
    }

    public void emit(C context, ObjExpr objx, GeneratorAdapter gen) {
        gen.visitLineNumber(line, gen.mark());
        if (method != null) {
            Type type = Type.getType(method.getDeclaringClass());
            target.emit(C.EXPRESSION, objx, gen);
            //if(!method.getDeclaringClass().isInterface())
            gen.checkCast(type);
            MethodExpr.emitTypedArgs(objx, gen, method.getParameterTypes(), args);
            if (context == C.RETURN) {
                ObjMethod method = (ObjMethod) METHOD.deref();
                method.emitClearLocals(gen);
            }
            Method m = new Method(methodName, Type.getReturnType(method), Type.getArgumentTypes(method));
            if (method.getDeclaringClass().isInterface()) {
                gen.invokeInterface(type, m);
            } else {
                gen.invokeVirtual(type, m);
            }
            //if(context != C.STATEMENT || method.getReturnType() == Void.TYPE)
            HostExpr.emitBoxReturn(objx, gen, method.getReturnType());
        } else {
            target.emit(C.EXPRESSION, objx, gen);
            gen.push(methodName);
            emitArgsAsArray(args, objx, gen);
            if (context == C.RETURN) {
                ObjMethod method = (ObjMethod) METHOD.deref();
                method.emitClearLocals(gen);
            }
            gen.invokeStatic(REFLECTOR_TYPE, invokeInstanceMethodMethod);
        }
        if (context == C.STATEMENT) {
            gen.pop();
        }
    }

    public boolean hasJavaClass() {
        return method != null || tag != null;
    }

    public Class getJavaClass() {
        return tag != null ? HostExpr.tagToClass(tag) : method.getReturnType();
    }
}
