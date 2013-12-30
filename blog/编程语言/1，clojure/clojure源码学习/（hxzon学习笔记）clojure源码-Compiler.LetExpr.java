//（hxzon学习笔记）clojure源码-Compiler.LetExpr.java
//https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/Compiler.java

//表达式：let*
public static class LetExpr implements Expr, MaybePrimitiveExpr {
    public final PersistentVector bindingInits;
    public final Expr body;
    public final boolean isLoop;

    public LetExpr(PersistentVector bindingInits, Expr body, boolean isLoop) {
        this.bindingInits = bindingInits;
        this.body = body;
        this.isLoop = isLoop;
    }

    static class Parser implements IParser {
        public Expr parse(C context, Object frm) {
            ISeq form = (ISeq) frm;
            //(let [var val var2 val2 ...] body...)
            boolean isLoop = RT.first(form).equals(LOOP);//检查form的第1个元素是否为“loop*”。
            if (!(RT.second(form) instanceof IPersistentVector)) {//form的第2个元素必须是向量（绑定列表）。
                throw new IllegalArgumentException("Bad binding form, expected vector");
            }

            IPersistentVector bindings = (IPersistentVector) RT.second(form);
            if ((bindings.count() % 2) != 0) {//form绑定向量的元素个数必须为偶数。
                throw new IllegalArgumentException("Bad binding form, expected matched symbol expression pairs");
            }

            ISeq body = RT.next(RT.next(form));//去掉form开头两个元素，得到let的函数体。

            if (context == C.EVAL || (context == C.EXPRESSION && isLoop)) {
                return analyze(context, RT.list(RT.list(FNONCE, PersistentVector.EMPTY, form)));//FNONCE为符号“fn*”，带上once元数据。
            }

            ObjMethod method = (ObjMethod) METHOD.deref();
            IPersistentMap backupMethodLocals = method.locals;
            IPersistentMap backupMethodIndexLocals = method.indexlocals;
            IPersistentVector recurMismatches = PersistentVector.EMPTY;
            for (int i = 0; i < bindings.count() / 2; i++) {
                recurMismatches = recurMismatches.cons(RT.F);
            }

            //may repeat once for each binding with a mismatch, return breaks
            while (true) {
                IPersistentMap dynamicBindings = RT.map(LOCAL_ENV, LOCAL_ENV.deref(), NEXT_LOCAL_NUM, NEXT_LOCAL_NUM.deref());
                method.locals = backupMethodLocals;
                method.indexlocals = backupMethodIndexLocals;

                if (isLoop) {
                    dynamicBindings = dynamicBindings.assoc(LOOP_LOCALS, null);
                }

                try {
                    Var.pushThreadBindings(dynamicBindings);

                    PersistentVector bindingInits = PersistentVector.EMPTY;
                    PersistentVector loopLocals = PersistentVector.EMPTY;
                    for (int i = 0; i < bindings.count(); i += 2) {
                        if (!(bindings.nth(i) instanceof Symbol)) {
                            throw new IllegalArgumentException("Bad binding form, expected symbol, got: " + bindings.nth(i));
                        }
                        Symbol sym = (Symbol) bindings.nth(i);
                        if (sym.getNamespace() != null) {
                            throw Util.runtimeException("Can't let qualified name: " + sym);
                        }
                        Expr init = analyze(C.EXPRESSION, bindings.nth(i + 1), sym.name);
                        if (isLoop) {
                            if (recurMismatches != null && RT.booleanCast(recurMismatches.nth(i / 2))) {
                                init = new StaticMethodExpr("", 0, 0, null, RT.class, "box", RT.vector(init));
                                if (RT.booleanCast(RT.WARN_ON_REFLECTION.deref()))
                                    RT.errPrintWriter().println("Auto-boxing loop arg: " + sym);
                            } else if (maybePrimitiveType(init) == int.class) {
                                init = new StaticMethodExpr("", 0, 0, null, RT.class, "longCast", RT.vector(init));
                            } else if (maybePrimitiveType(init) == float.class) {
                                init = new StaticMethodExpr("", 0, 0, null, RT.class, "doubleCast", RT.vector(init));
                            }
                        }
                        //sequential enhancement of env (like Lisp let*)
                        LocalBinding lb = registerLocal(sym, tagOf(sym), init, false);
                        BindingInit bi = new BindingInit(lb, init);
                        bindingInits = bindingInits.cons(bi);

                        if (isLoop) {
                            loopLocals = loopLocals.cons(lb);
                        }
                    }
                    if (isLoop) {
                        LOOP_LOCALS.set(loopLocals);
                    }
                    Expr bodyExpr;
                    boolean moreMismatches = false;
                    try {
                        if (isLoop) {
                            PathNode root = new PathNode(PATHTYPE.PATH, (PathNode) CLEAR_PATH.get());
                            Var.pushThreadBindings(RT.map(CLEAR_PATH, new PathNode(PATHTYPE.PATH, root), CLEAR_ROOT, new PathNode(PATHTYPE.PATH, root), NO_RECUR, null));

                        }
                        bodyExpr = (new BodyExpr.Parser()).parse(isLoop ? C.RETURN : context, body);
                    } finally {
                        if (isLoop) {
                            Var.popThreadBindings();
                            for (int i = 0; i < loopLocals.count(); i++) {
                                LocalBinding lb = (LocalBinding) loopLocals.nth(i);
                                if (lb.recurMistmatch) {
                                    recurMismatches = (IPersistentVector) recurMismatches.assoc(i, RT.T);
                                    moreMismatches = true;
                                }
                            }
                        }
                    }
                    if (!moreMismatches) {
                        return new LetExpr(bindingInits, bodyExpr, isLoop);
                    }
                } finally {
                    Var.popThreadBindings();
                }
            }
        }
    }

    public Object eval() {
        throw new UnsupportedOperationException("Can't eval let/loop");
    }

    public void emit(C context, ObjExpr objx, GeneratorAdapter gen) {
        doEmit(context, objx, gen, false);
    }

    public void emitUnboxed(C context, ObjExpr objx, GeneratorAdapter gen) {
        doEmit(context, objx, gen, true);
    }

    public void doEmit(C context, ObjExpr objx, GeneratorAdapter gen, boolean emitUnboxed) {
        HashMap<BindingInit, Label> bindingLabels = new HashMap();
        for (int i = 0; i < bindingInits.count(); i++) {
            BindingInit bi = (BindingInit) bindingInits.nth(i);
            Class primc = maybePrimitiveType(bi.init);
            if (primc != null) {
                ((MaybePrimitiveExpr) bi.init).emitUnboxed(C.EXPRESSION, objx, gen);
                gen.visitVarInsn(Type.getType(primc).getOpcode(Opcodes.ISTORE), bi.binding.idx);
            } else {
                bi.init.emit(C.EXPRESSION, objx, gen);
                gen.visitVarInsn(OBJECT_TYPE.getOpcode(Opcodes.ISTORE), bi.binding.idx);
            }
            bindingLabels.put(bi, gen.mark());
        }
        Label loopLabel = gen.mark();
        if (isLoop) {
            try {
                Var.pushThreadBindings(RT.map(LOOP_LABEL, loopLabel));
                if (emitUnboxed) {
                    ((MaybePrimitiveExpr) body).emitUnboxed(context, objx, gen);
                } else {
                    body.emit(context, objx, gen);
                }
            } finally {
                Var.popThreadBindings();
            }
        } else {
            if (emitUnboxed) {
                ((MaybePrimitiveExpr) body).emitUnboxed(context, objx, gen);
            } else {
                body.emit(context, objx, gen);
            }
        }
        Label end = gen.mark();
//		gen.visitLocalVariable("this", "Ljava/lang/Object;", null, loopLabel, end, 0);
        for (ISeq bis = bindingInits.seq(); bis != null; bis = bis.next()) {
            BindingInit bi = (BindingInit) bis.first();
            String lname = bi.binding.name;
            if (lname.endsWith("__auto__")) {
                lname += RT.nextID();
            }
            Class primc = maybePrimitiveType(bi.init);
            if (primc != null) {
                gen.visitLocalVariable(lname, Type.getDescriptor(primc), null, bindingLabels.get(bi), end, bi.binding.idx);
            } else {
                gen.visitLocalVariable(lname, "Ljava/lang/Object;", null, bindingLabels.get(bi), end, bi.binding.idx);
            }
        }
    }

    public boolean hasJavaClass() {
        return body.hasJavaClass();
    }

    public Class getJavaClass() {
        return body.getJavaClass();
    }

    public boolean canEmitPrimitive() {
        return body instanceof MaybePrimitiveExpr && ((MaybePrimitiveExpr) body).canEmitPrimitive();
    }

}
