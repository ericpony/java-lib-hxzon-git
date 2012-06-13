#ifndef _LIST_H
#define _LIST_H

#define __INLINE__ inline

struct list_head {
	struct list_head *next, *prev;
};

#define LIST_HEAD_INIT(name) { &(name), &(name) }

#define LIST_HEAD(name) \
	struct list_head name = LIST_HEAD_INIT(name)

#define INIT_LIST_HEAD(ptr) do { \
	(ptr)->next = (ptr); (ptr)->prev = (ptr); \
} while (0)

#define list_entry(ptr, type, member) \
	((type *)((char *)(ptr)-(unsigned long)(&((type *)0)->member)))

static __INLINE__ void __list_add(struct list_head *new,
			      struct list_head *prev,
			      struct list_head *next)
{
	next->prev = new;
	new->next = next;
	new->prev = prev;
	prev->next = new;
}

static __INLINE__ void list_add(struct list_head *new, struct list_head *head)
{
	__list_add(new, head, head->next);
}

static __INLINE__ void list_add_tail(struct list_head *new, struct list_head *head)
{
	__list_add(new, head->prev, head);
}

static __INLINE__ void __list_del(struct list_head *prev, struct list_head *next)
{
	next->prev = prev;
	prev->next = next;
}

static __INLINE__ void list_del(struct list_head *entry)
{
	__list_del(entry->prev, entry->next);
	entry->next = (void *) 0;
	entry->prev = (void *) 0;
}

static __INLINE__ void list_del_init(struct list_head *entry)
{
	__list_del(entry->prev, entry->next);
	INIT_LIST_HEAD(entry); 
}

static __INLINE__ void list_move(struct list_head *list, struct list_head *head)
{
        __list_del(list->prev, list->next);
        list_add(list, head);
}

static __INLINE__ void list_move_tail(struct list_head *list,
				  struct list_head *head)
{
        __list_del(list->prev, list->next);
        list_add_tail(list, head);
}

static __INLINE__ int list_empty(struct list_head *head)
{
	return head->next == head;
}

#endif /* _LIST_H */

