//overall
SG = {
	game_state: 'battle', // temp
	initialize: function(canvas) {
		SG.overflow = 0;
		SG.canvas = "";
		SG.inputController.initialize()	; // temp
		SG.view.initialize();
		SG.player.initialize();
		
		SG.battle.initialize();
		time = Date.now();
		SG.update();
	},
	update: function() {
		//console.log(Date.now()-SG.time);
		SG.time = Date.now() + SG.overflow; 
		SG.keyHandler();
		SG.player.update();
		SG.battle.update();
		SG.view.update();
		var timeout = 50 - (Date.now() - SG.time);
		if (timeout < 0) {SG.overflow = Math.abs(timeout) }
		window.setTimeout(SG.update, timeout);
	},
	ping: function() {
		socket.emit('ping', Date.now());
	}
};

SG.view = {
	resizeCanvas: function() {
		SG.view.canvas.width = window.innerWidth;
	    SG.view.canvas.height = window.innerHeight;
	},
	clear: function() {
		SG.view.context.clearRect(0, 0, SG.view.canvas.width, SG.view.canvas.height);
	},
	update: function() {
		SG.view.clear();
		SG.view.drawBackground();
		SG.player.draw();
		for (var i = 0; i < SG.battle.enemies.length; i++) {
			SG.battle.enemies[i].draw();
		};
	},
	drawBackground: function() {
		SG.view.context.fillRect(0, SG.view.canvas.height - 100, SG.view.canvas.width,3);
	},
	initialize: function() {
		SG.preloader.initialize();
		SG.view.canvas = document.getElementById('game-view');
	    SG.view.context = SG.view.canvas.getContext('2d');
	    SG.view.resizeCanvas();

		window.addEventListener('resize', SG.view.resizeCanvas, false);
	},
}

SG.preloader = {
	initialize: function() {
		SG.assets = {};
		SG.preloader.loadImage('player', '/images/spritesheet');
	},
	loadImage: function(key, src) {
		SG.assets[key] = {};
		SG.assets[key].left = document.createElement('img');
		SG.assets[key].left.className = 'preloaded';
		SG.assets[key].left.setAttribute('src', src + '-l.png');
		SG.assets[key].left.setAttribute('id', key);

		SG.assets[key].right = document.createElement('img');
		SG.assets[key].right.className = 'preloaded';
		SG.assets[key].right.setAttribute('src', src + '-r.png');
		SG.assets[key].right.setAttribute('id', key);
	}
};

//game state controller
SG.stateController = {
	type: {
		battle: {
			a: function() {
			},
			b: function() {

			}
		}
	},
	switchState: function(state) {
		SG.game_state = state
		SG.inputController.switchHandler;
	}
};

// key listener controller
SG.inputController = {
	active: {
		37: false, // left
		38: false, // up
		39: false, // right
		40: false, // down
		16: false, // shift
		90: false, // z
		88: false,
	},
	type: {
		battle: function() {
			if (SG.inputController.active[90]) {
				if (!SG.player.state.attack.type) { SG.player.moves.light(); }
			}
			if (SG.inputController.active[88]) {
				if (!SG.player.state.attack.type) { SG.player.moves.heavy(); }
			}
			if (SG.inputController.active[37]) { // left
				SG.player.state.force.x -= SG.player.state.air ? 1 : 3;
				SG.player.state.direction = -1;
			}
			if (SG.inputController.active[38]) { // up
				if (SG.player.state.air > 0) {
					if (SG.player.state.air < 5) { SG.player.state.force.y += 4; }
				} else {
					SG.player.state.force.y += 14;
					SG.player.state.air = 1;
				}
			}
			if (SG.inputController.active[39]) { // right
				SG.player.state.force.x += SG.player.state.air ? 1 : 3;
				SG.player.state.direction = 1;
			}
			if (SG.inputController.active[40]) { // down
				//SG.player.state.force.y += 2;
			}
			if (Math.abs(SG.player.state.force.x) > 8) {
				SG.player.state.force.x = SG.player.state.force.x > 0 ? 8 : -8;
			}
		},
		menu: function() {
		}
	},
	switchHandler: function() {
		// remove old key handler
		switch (SG.game_state)
		{
			case 'battle':
				SG.inputController.installHandler(SG.inputController.type.battle);
				break;

		}
	},
	installHandler: function(type) {
		SG.keyHandler = type;
	},
	initialize: function() {
		SG.inputController.switchHandler();
		window.addEventListener('keydown', SG.inputController.keyDown, false);
		window.addEventListener('keyup', SG.inputController.keyUp, false);
	},

	keyDown: function(e) {
		if (SG.inputController.active[e.keyCode] === false) { SG.inputController.active[e.keyCode] = true }	
	},
	keyUp: function(e) {
		if (SG.inputController.active[e.keyCode]) { SG.inputController.active[e.keyCode] = false }
	}
};
function Projectile(x, y, assets, width, height, offsetX, offsetY) {
	this.x = x;
	this.y = y;
	
	this.assets = assets;
	this.state = {health: 0, air: 0, frame: 0, attack: {},  status: 'idle', force: {x: 0, y: 0}};
	this.width = width;
	this.height = height;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
};

function BattleEntity(x, y, assets, width, height, offsetX, offsetY) {
	this.x = x;
	this.y = y;
	
	this.assets = assets;
	this.state = {health: 0, air: 0, frame: 0, attack: {},  status: 'idle', force: {x: 0, y: 0}};
	this.width = width;
	this.height = height;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
};

BattleEntity.prototype.move = function() {
	this.moveX();
	this.moveY();
};

BattleEntity.prototype.moveX = function() {
	if (this.state.attack.type) { this.state.force.x *= 0.8; }
	if (this.state.force.x != 0) {
		if (SG.inputController.active[16]) {
				this.x += Math.round(this.state.force.x * 1.5);
		} else {
			this.x += Math.round(this.state.force.x);
		}
		var collision = false;
		while (SG.collisions.battleCollision(this.hitbox())) {
			this.x -= this.state.direction
			collision = true;
		}
		if (collision) {
			this.state.force.x = 0;
		}
		// record last force, if decreased significantly then slide
		if (!this.state.air) { this.state.force.x *= 0.8; }
		if (Math.abs(this.state.force.x) < 1) {
			this.state.force.x = 0;
			this.state.status = 'idle';
		} else {
			this.state.status = 'walking';
		}
	}
};

BattleEntity.prototype.moveY = function() {
	if (this.state.air > 0) {
		this.state.air++;
	}
	this.state.force.y -= 2;
	var collision = false;
	this.y -= Math.round(this.state.force.y);
	while (SG.collisions.battleCollision(this.hitbox())) {
		this.y -= this.state.force.y ? 1 : number !== 0 ? -1 : 0;
		this.state.air = 0;
		collision = true;
	}
	if (collision) {
		this.state.force.y = 0;
	}
};

BattleEntity.prototype.hitbox = function() {//offsetX, offsetY) {
	return {
		tl: {	x: this.x - this.width/2 + this.offsetX,
				y: this.y - this.height + this.offsetY
			},
		tr: {	x: this.x + this.width/2 - this.offsetX,
				y: this.y - this.height + this.offsetY
			},
		bl: { 	x: this.x - this.width/2 + this.offsetX,
				y: this.y - 1
			},
		br: {	x: this.x + this.width/2 - this.offsetX,
				y: this.y - 1
			},
		bc: {	x: this.x,
				y: this.y - 1
			}
	}
};

BattleEntity.prototype.draw = function() {
	var spriteCoord = this.getSprite();
	if (this.state.direction > 0) {
		SG.view.context.drawImage(SG.assets[this.assets].right, (10-spriteCoord[0])*this.width, spriteCoord[1]*this.height, this.width, this.height, this.x - this.width/2, this.y - this.height, this.width, this.height);
	} else {
		SG.view.context.drawImage(SG.assets[this.assets].left, (spriteCoord[0])*this.width, spriteCoord[1]*this.height, this.width, this.height, this.x - this.width/2, this.y - this.height, this.width, this.height);	
	}
	SG.view.context.fillRect(this.x, this.y,3,3);// temp draw point viewer
};

BattleEntity.prototype.update = function() {
	this.move();
	// off until sensible update + validation system
	// socket.emit('update', SG.player.state);
};

// {attack: {light: {maxFrame: 5, spriteRow: 1}, heavy: {maxFrame: 10, spriteRow: 2}}
SG.player = new BattleEntity(0, 0, 'player', 60, 60, 18, 9);

SG.player.initialize = function() {
	// get shits from server
	// override with shits
	// maybe ajax requests for skills

};

SG.player.moves = {
	light: function() {
		SG.inputController.active[90] = false;
		SG.player.state.attack.type = 'light';
		SG.player.state.frame = 0;
		SG.player.moves.light.frames = 5;
	},
	medium: function() {},
	heavy: function() {
		SG.player.state.attack.type = 'heavy';
		SG.player.state.frame = 0;
	},
	special: function() {}
};

BattleEntity.prototype.getSprite = function() {
	this.updateFrame();
	switch (this.state.attack.type) {
		case null:
			break;
		case 'light':
			return [this.state.frame-1, 1];
			break;
		case 'heavy':
			return [this.state.frame-1, 2];
			break;
	}
	if (this.state.air) { return [6, 0]; }
	switch (this.state.status) {
		case 'idle':
			return [0, 0];
			break;
		case 'walking':
			return [1 + this.state.frame, 0];
			break;
		default:
			return [0, 0];	
	}
};

// todo, add moveset object which contains max frame and row of different actions (idle, walk in one row, attacks in rest)

BattleEntity.prototype.updateFrame = function() {
	if (this.state.attack.type) {
		switch (this.state.attack.type) {
			case 'light':
				if (this.state.frame > 5) {
					this.state.frame=0;
					this.state.attack.type = null;
				} else {
					this.state.frame++;	
				}
				break;
			case 'heavy':
				if (this.state.frame > 8) {
					this.state.frame=0;
					this.state.attack.type = null;
				} else {
					this.state.frame++;	
				}
				break;
		}
	} else {
		switch (this.state.status) {
			case 'idle':
				this.state.frame = 0;
				break;
			case 'walking':
				this.state.frame++;
				if (this.state.frame > 7) { this.state.frame = 0 }
				break;
		}
	} 
};

SG.collisions = {
	corners: ['br', 'bl', 'tr', 'tl'],
	battleCollision: function(hitbox) { // temp hardcoding

		// ground check
		if ((hitbox.br.y >= SG.view.canvas.height - 100) ||
			  (hitbox.bl.y >= SG.view.canvas.height - 100)) {
			return true
		}

		var enemies = SG.battle.enemies;
		for (var i = 0; i < enemies.length; i++) {
			var enemy = enemies[i].hitbox();
			// ghetto fix to prevent enemeis from checking themselves
			if (hitbox.br.x == enemy.br.x && hitbox.bl.y == enemy.bl.y) {
				return false;
			}
			for (var j = 0; j < SG.collisions.corners.length; j++) {
				if (hitbox[SG.collisions.corners[j]].x <= enemy.br.x && hitbox[SG.collisions.corners[j]].x >= enemy.tl.x &&
					hitbox[SG.collisions.corners[j]].y <= enemy.br.y && hitbox[SG.collisions.corners[j]].y >= enemy.tl.y) {
					console.log(enemy)
					console.log(enemies[i]);
					return enemies[i];
				}
			}
		}
		return false
	},
};
SG.battle = {
	enemies: [],
	initialize: function() {
		SG.battle.spawnEnemy(500, 0, 'player', 60, 60, 18, 9);
	},

	spawnEnemy: function(x, y, assets, width, height, offsetX, offsetY) {
		SG.battle.enemies.push(new BattleEntity(x, y, assets, width, height, offsetX, offsetY));
	},

	update: function() {
		for (var i = 0; i < SG.battle.enemies.length; i++) {
			SG.battle.enemies[i].update();
		};
	},
};

socket.on('start', function() {
	console.log('starting');
});
socket.on('echo', function(data) {
	console.log(data);
	console.log('packet recieved');
});
socket.on('ping', function(time) {
	console.log(Date.now()-time);
});
SG.initialize();
