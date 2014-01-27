;（hxzon读书笔记）《计算机程序的构造和解释》-用过程实现点对

;by hxzon
;==========
;1，点对
;点对由三个操作来定义。
;2.1.3  What Is Meant by Data?
;http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-4.html#%_toc_%_sec_2.1.3

;cons构造点对。
;car获得点对头部。
;cdr获得点对尾部。

;----
;用过程定义点对：
(define (cons x y)
  (define (dispatch m)
    (cond ((= m 0) x)
          ((= m 1) y)
          (else (error "Argument not 0 or 1 -- CONS" m))))
  dispatch)

(define (car z) (z 0))

(define (cdr z) (z 1))

;----
(define (cons x y)
  (define (dispatch m)
    (cond ((eq? m 'car) x)
          ((eq? m 'cdr) y)
          (else (error "Undefined operation -- CONS" m))))
  dispatch)

(define (car z) (z 'car))

(define (cdr z) (z 'cdr))

;====
;2，可变结构的点对
;可变点对由4个操作定义。
;3.3.1  Mutable List Structure
;http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-4.html#%_toc_%_sec_3.3.1

;----
define (cons x y)
  (define (set-x! v) (set! x v))
  (define (set-y! v) (set! y v))
  (define (dispatch m)
    (cond ((eq? m 'car) x)
          ((eq? m 'cdr) y)
          ((eq? m 'set-car!) set-x!)
          ((eq? m 'set-cdr!) set-y!)
          (else (error "Undefined operation -- CONS" m))))
  dispatch)

(define (car z) (z 'car))

(define (cdr z) (z 'cdr))

(define (set-car! z new-value)
  ((z 'set-car!) new-value)
  z)

(define (set-cdr! z new-value)
  ((z 'set-cdr!) new-value)
  z)




