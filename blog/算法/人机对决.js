var gameboard;
var board_idx;
var a;
var p1, c1, p2, c2;
var man_score, mach_score;
var moves;
function ZeroMatrix() {
	a = new Array(2);
	for (i = 0; i < 2; i++) {
		a[i] = new Array(3);
		for (j = 0; j < 3; j++) {
			a[i][j] = new Array(2);
			for (k = 0; k < 2; k++) {
				a[i][j][k] = new Array(3);
				for (l = 0; l < 3; l++) {
					a[i][j][k][l] = new Array(2);
					for (m = 0; m < 2; m++) {
						a[i][j][k][l][m] = 0;
					}
				}
			}
		}
	}
}
function ZeroBoard() {
	gameboard = new Array(3);
	for (i = 0; i < 3; i++) {
		gameboard[i] = new Array(15);
		for (j = 0; j < 15; j++) {
			gameboard[i][j] = '';
		}
	}
}
function Reset() {
	ZeroMatrix();
	p1 = 0;
	c1 = 0;
	p2 = 0;
	c2 = 0;
	man_score = 0;
	mach_score = 0;
	moves = 0;
	DisplayScores();
	ZeroBoard();
	board_idx = 0;
	DisplayBoard();
}
function DisplayBoard() {
	var board = document.getElementById("board");
	for (var i = 0, row; row = board.rows[i]; i++) {
		for (var j = 0, col; col = row.cells[j]; j++) {
			col.innerHTML = gameboard[i][j];
		}
	}
}
function DisplayScores() {
	document.getElementById('manscore').firstChild.nodeValue = man_score;
	document.getElementById('machscore').firstChild.nodeValue = mach_score;
	var man_per = 0, mach_per = 0;
	var total = man_score + mach_score;
	man_win = '-';
	mach_win = '-';
	if (total > 0) {
		man_per = (man_score / total) * 100;
		mach_per = (mach_score / total) * 100;
		if (man_score > mach_score) {
			man_win = '✓';
		} else if (mach_score > man_score) {
			mach_win = '✓';
		}
	}
	document.getElementById('manwin').firstChild.nodeValue = man_win;
	document.getElementById('machwin').firstChild.nodeValue = mach_win;
	document.getElementById('manper').firstChild.nodeValue = man_per.toFixed(2);
	document.getElementById('machper').firstChild.nodeValue = mach_per
			.toFixed(2);
}
function Judge(man_ans, mach_ans) {
	if (mach_ans != 2) {
		if (man_ans == mach_ans)
			mach_score++;
		else
			man_score++;
		DisplayScores();
	}
}
function checkKey(e) {
	e = e || window.event;
	if (e.keyCode == 49) {
		Move(1);
	} else if (e.keyCode == 48) {
		Move(0);
	} else if (e.keyCode == 32) {
		Reset();
	}
}
function Init() {
	Reset();
	document.onkeypress = checkKey;
}
function Move(man) {
	if (moves < 3) {
		mach = 2;
	} else {
		if (Math.abs(a[p1][c1][p2][c2][0] - a[p1][c1][p2][c2][1]) <= 1.8 * Math
				.pow(1.01, moves))
			mach = 2;
		else if (a[p1][c1][p2][c2][0] < a[p1][c1][p2][c2][1])
			mach = 1;
		else
			mach = 0;
		a[p1][c1][p2][c2][man] += Math.pow(1.1, moves);
		Judge(man, mach);
	}
	board_idx = moves % 15;
	if (board_idx == 0)
		ZeroBoard();
	gameboard[0][board_idx] = "#" + moves;
	gameboard[1][board_idx] = man;
	gameboard[2][board_idx] = (mach == 2) ? 'pass' : mach;
	DisplayBoard();
	c1 = c2;
	c2 = mach;
	p1 = p2;
	p2 = man;
	moves++;
}
Init();