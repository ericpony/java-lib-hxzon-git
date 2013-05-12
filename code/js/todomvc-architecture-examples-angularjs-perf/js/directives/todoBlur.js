/*global todomvc */
'use strict';

/**
 * Directive that executes an expression when the element it is applied to loses focus
*/
//自定义指令。
todomvc.directive('todoBlur', function () {
	return function (scope, elem, attrs) {
		elem.bind('blur', function () {
			scope.$apply(attrs.todoBlur);
		});
	};
});
