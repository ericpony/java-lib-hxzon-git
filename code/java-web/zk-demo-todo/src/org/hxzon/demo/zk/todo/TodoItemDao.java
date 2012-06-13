package org.hxzon.demo.zk.todo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TodoItemDao {
	private static Map<String, TodoItem> todoItems = new HashMap<String, TodoItem>();
	static {
		todoItems.put("1", new TodoItem("1", "第一件事", "2011-6-30"));
		todoItems.put("2", new TodoItem("2", "第二件事", "2011-6-30"));
		todoItems.put("3", new TodoItem("3", "第三件事", "2011-6-30"));
	}

	public List<TodoItem> findAll() {
		List<TodoItem> result = new ArrayList<TodoItem>();
		for (TodoItem item : todoItems.values()) {
			result.add(item);
		}
		return result;
	}

	public void insert(TodoItem item) {
		todoItems.put(item.getId(), item);
	}

	public void update(TodoItem item) {
		todoItems.put(item.getId(), item);
	}

	public void delete(TodoItem item) {
		todoItems.remove(item);
	}
}
