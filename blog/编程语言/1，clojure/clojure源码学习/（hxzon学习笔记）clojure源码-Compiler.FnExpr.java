//（hxzon学习笔记）clojure源码-Compiler.FnExpr.java
//https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/Compiler.java

//=======
//表达式：fn*
static public class FnExpr extends ObjExpr {
    final static Type aFnType = Type.getType(AFunction.class);//函数类型：固定参数
    final static Type restFnType = Type.getType(RestFn.class);//函数类型：不定参数
    //if there is a variadic overload (there can only be one) it is stored here
    FnMethod variadicMethod = null;//不定参数实现体（只能有一个）
    IPersistentCollection methods;//实现体（重载）列表
    private boolean hasPrimSigs;
    private boolean hasMeta;

    //	String superName = null;

    public FnExpr(Object tag) {
        super(tag);
    }

    public boolean hasJavaClass() {
        return true;
    }

    boolean supportsMeta() {
        return hasMeta;
    }

    public Class getJavaClass() {
        return AFunction.class;
    }

    protected void emitMethods(ClassVisitor cv) {
        //override of invoke/doInvoke for each method
        for (ISeq s = RT.seq(methods); s != null; s = s.next()) {
            ObjMethod method = (ObjMethod) s.first();
            method.emit(this, cv);
        }

        if (isVariadic()) {
            GeneratorAdapter gen = new GeneratorAdapter(ACC_PUBLIC, Method.getMethod("int getRequiredArity()"), null, null, cv);
            gen.visitCode();
            gen.push(variadicMethod.reqParms.count());
            gen.returnValue();
            gen.endMethod();
        }
    }

//	(def
//	        ^{:arglists '([x seq])
//	           :doc "Returns a new seq where x is the first element and seq is
//	           the rest."
//	          :added "1.0"
//	          :static true}
//
//	        cons (fn* ^:static cons [x seq] (. clojure.lang.RT (cons x seq))))	

//	(def
//	        ^{:macro true
//	          :added "1.0"}
//	        let (fn* let [&form &env & decl] (cons 'let* decl)))

//	(def
//	        ^{:macro true
//	          :added "1.0"}
//	        fn (fn* fn [&form &env & decl] 
//	                (.withMeta ^clojure.lang.IObj (cons 'fn* decl) 
//	                           (.meta ^clojure.lang.IMeta &form))))
    static Expr parse(C context, ISeq form, String name) {
        ISeq origForm = form;
        FnExpr fn = new FnExpr(tagOf(form));
        fn.src = form;//源代码
        ObjMethod enclosingMethod = (ObjMethod) METHOD.deref();
        if (((IMeta) form.first()).meta() != null) {//获取form的第1个元素（方法名）的元数据，如果有。
            //元数据是否含有once
            fn.onceOnly = RT.booleanCast(RT.get(RT.meta(form.first()), Keyword.intern(null, "once")));
//			fn.superName = (String) RT.get(RT.meta(form.first()), Keyword.intern(null, "super-name"));
        }
        //fn.thisName = name;
        String basename = enclosingMethod != null ? (enclosingMethod.objx.name + "$") : //"clojure.fns." +
                (munge(currentNS().name.name) + "$");
        if (RT.second(form) instanceof Symbol) {//如果form的第2个元素是符号（可选的内部方法名，用于自引用）
            name = ((Symbol) RT.second(form)).name;
        }
        String simpleName = (name != null) ? //
        (munge(name).replace(".", "_DOT_") + (enclosingMethod != null ? "__" + RT.nextID() : "")) //
                : ("fn" + "__" + RT.nextID());
        fn.name = basename + simpleName;
        fn.internalName = fn.name.replace('.', '/');
        fn.objtype = Type.getObjectType(fn.internalName);
        ArrayList<String> prims = new ArrayList();
        try {
            Var.pushThreadBindings(RT.mapUniqueKeys(CONSTANTS, PersistentVector.EMPTY, CONSTANT_IDS, new IdentityHashMap(), KEYWORDS, PersistentHashMap.EMPTY, VARS, PersistentHashMap.EMPTY,
                    KEYWORD_CALLSITES, PersistentVector.EMPTY, PROTOCOL_CALLSITES, PersistentVector.EMPTY, VAR_CALLSITES, emptyVarCallSites(), NO_RECUR, null));

            //arglist might be preceded by symbol naming this fn
            if (RT.second(form) instanceof Symbol) {//如果form的第2个元素是符号（可选的内部方法名，用于自引用）
                Symbol nm = (Symbol) RT.second(form);
                fn.thisName = nm.name;
                fn.isStatic = false; //RT.booleanCast(RT.get(nm.meta(), staticKey));
                form = RT.cons(FN, RT.next(RT.next(form)));//去掉form开头的两个元素，再在开头加上“fn”。
            }

            //now (fn [args] body...) or (fn ([args] body...) ([args2] body2...) ...)
            //turn former into latter
            if (RT.second(form) instanceof IPersistentVector) {//如果form的第2个元素是向量（参数列表）
                form = RT.list(FN, RT.next(form));//去掉form的参数列表，在开头加上“fn”。
            }
            fn.line = lineDeref();
            fn.column = columnDeref();
            FnMethod[] methodArray = new FnMethod[MAX_POSITIONAL_ARITY + 1];
            FnMethod variadicMethod = null;//不定参数函数（实现体）
            for (ISeq s = RT.next(form); s != null; s = RT.next(s)) {
                FnMethod f = FnMethod.parse(fn, (ISeq) RT.first(s), fn.isStatic);
                if (f.isVariadic()) {
                    if (variadicMethod == null)
                        variadicMethod = f;
                    else
                        throw Util.runtimeException("Can't have more than 1 variadic overload");
                } else if (methodArray[f.reqParms.count()] == null)
                    methodArray[f.reqParms.count()] = f;//不同的参数个数对应不同的函数（实现体）
                else
                    throw Util.runtimeException("Can't have 2 overloads with same arity");
                if (f.prim != null)
                    prims.add(f.prim);
            }
            if (variadicMethod != null) {//固定参数的个数不能超过不定参数的参数个数。
                for (int i = variadicMethod.reqParms.count() + 1; i <= MAX_POSITIONAL_ARITY; i++) {
                    if (methodArray[i] != null) {
                        throw Util.runtimeException("Can't have fixed arity function with more params than variadic function");
                    }
                }
            }

            if (fn.isStatic && fn.closes.count() > 0) {
                throw new IllegalArgumentException("static fns can't be closures");//静态函数不能含有闭包。
            }
            IPersistentCollection methods = null;
            for (int i = 0; i < methodArray.length; i++) {
                if (methodArray[i] != null) {
                    methods = RT.conj(methods, methodArray[i]);
                }
            }
            if (variadicMethod != null) {
                methods = RT.conj(methods, variadicMethod);
            }

            fn.methods = methods;
            fn.variadicMethod = variadicMethod;
            fn.keywords = (IPersistentMap) KEYWORDS.deref();
            fn.vars = (IPersistentMap) VARS.deref();
            fn.constants = (PersistentVector) CONSTANTS.deref();
            fn.keywordCallsites = (IPersistentVector) KEYWORD_CALLSITES.deref();
            fn.protocolCallsites = (IPersistentVector) PROTOCOL_CALLSITES.deref();
            fn.varCallsites = (IPersistentSet) VAR_CALLSITES.deref();

            fn.constantsID = RT.nextID();
//			DynamicClassLoader loader = (DynamicClassLoader) LOADER.get();
//			loader.registerConstants(fn.constantsID, fn.constants.toArray());
        } finally {
            Var.popThreadBindings();
        }
        fn.hasPrimSigs = prims.size() > 0;
        IPersistentMap fmeta = RT.meta(origForm);
        if (fmeta != null) {
            fmeta = fmeta.without(RT.LINE_KEY).without(RT.COLUMN_KEY).without(RT.FILE_KEY);
        }
        fn.hasMeta = RT.count(fmeta) > 0;

        try {
            fn.compile(fn.isVariadic() ? "clojure/lang/RestFn" : "clojure/lang/AFunction", (prims.size() == 0) ? null : prims.toArray(new String[prims.size()]), fn.onceOnly);
        } catch (IOException e) {
            throw Util.sneakyThrow(e);
        }
        fn.getCompiledClass();

        if (fn.supportsMeta()) {
            //System.err.println(name + " supports meta");
            return new MetaExpr(fn, MapExpr.parse(context == C.EVAL ? context : C.EXPRESSION, fmeta));
        } else {
            return fn;
        }
    }

    public final ObjMethod variadicMethod() {
        return variadicMethod;
    }

    boolean isVariadic() {
        return variadicMethod != null;
    }

    public final IPersistentCollection methods() {
        return methods;
    }

    public void emitForDefn(ObjExpr objx, GeneratorAdapter gen) {
//		if(!hasPrimSigs && closes.count() == 0)
//			{
//			Type thunkType = Type.getType(FnLoaderThunk.class);
////			presumes var on stack
//			gen.dup();
//			gen.newInstance(thunkType);
//			gen.dupX1();
//			gen.swap();
//			gen.push(internalName.replace('/','.'));
//			gen.invokeConstructor(thunkType,Method.getMethod("void <init>(clojure.lang.Var,String)"));
//			}
//		else
        emit(C.EXPRESSION, objx, gen);
    }
}
