/*global todomvc */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

//定义todomvc模块的控制器TodoCtrl。
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage, filterFilter) {
	var todos = $scope.todos = todoStorage.get();

	$scope.newTodo = '';
	$scope.remainingCount = filterFilter(todos, {completed: false}).length;
	$scope.editedTodo = null;

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	//使用$scope.$watch监视location.path()的变化。
	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = (path === '/active') ?
			{ completed: false } : (path === '/completed') ?
			{ completed: true } : null;
	});

	$scope.$watch('remainingCount == 0', function (val) {
		$scope.allChecked = val;
	});

	$scope.addTodo = function () {
		if ($scope.newTodo.length === 0) {
			return;
		}

		todos.push({
			title: $scope.newTodo,
			completed: false
		});
		todoStorage.put(todos);

		$scope.newTodo = '';
		$scope.remainingCount++;
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
	};

	//失去焦点时触发。
	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;

		if (!todo.title) {
			$scope.removeTodo(todo);
		}

		todoStorage.put(todos);
	};
	//点击删除按钮。
	$scope.removeTodo = function (todo) {
		$scope.remainingCount -= todo.completed ? 0 : 1;
		todos.splice(todos.indexOf(todo), 1);
		todoStorage.put(todos);
	};
	//点击完成复选框（监听checkbox的change事件）。
	$scope.todoCompleted = function (todo) {
		if (todo.completed) {
			$scope.remainingCount--;
		} else {
			$scope.remainingCount++;
		}
		todoStorage.put(todos);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos = todos = todos.filter(function (val) {
			return !val.completed;
		});
		todoStorage.put(todos);
	};
	//点击全选复选框（监听checkbox的change事件）。
	$scope.markAll = function (completed) {
		todos.forEach(function (todo) {
			todo.completed = completed;
		});
		$scope.remainingCount = completed ? 0 : todos.length;
		todoStorage.put(todos);
	};
});
