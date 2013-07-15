//overall
SG = {
	game_state: 'battle', // temp
	initialize: function(canvas) {
		SG.canvas = "";
		SG.inputController.initialize()	; // temp
		SG.view.initialize();
		SG.player.initialize();
		
		window.setInterval(SG.update, 45);
	},
	update: function() {
		SG.keyHandler();
		SG.player.update();

		SG.view.update();
	},
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

SG.player = {
	health: 100,
	state: {air: 0, frame: 0, attack: {}, status: 'idle', force: {x: 0, y: 0} },
	x: 1,	
	y: 2, // temp
	initialize: function() {
		// get shits from server
		// override with shits
		// maybe ajax requests for skills

		SG.player.width = 50; // temp hardcoded, from server
		SG.player.height = 59;
		SG.player.heightBounds = SG.player.height - 1;
		SG.player.widthBounds = SG.player.width - 1;
	},
	moves: {
		light: function() {
			SG.inputController.active[90] = false;
			SG.player.state.attack.type = 'light';
			SG.player.state.frame = 0;
		},
		medium: function() {},
		heavy: function() {
			SG.player.state.attack.type = 'heavy';
			SG.player.state.frame = 0;
		},
		special: function() {}
	},
	hitbox: function() {//offsetX, offsetY) {
		var offsetX = 0;
		var offsetY = 0;
		return {
			tl: {	x: SG.player.x - SG.player.widthBounds + offsetX,
					y: SG.player.y - SG.player.height - offsetY
				},
			tr: {	x: SG.player.x + SG.player.widthBounds + offsetX,
					y: SG.player.y - SG.player.height - offsetY
				},
			bl: { 	x: SG.player.x - SG.player.widthBounds + offsetX,
					y: SG.player.y - offsetY
				},
			br: {	x: SG.player.x + SG.player.widthBounds + offsetX,
					y: SG.player.y - offsetY
				}
		}
	},
	
	draw: function() {
		var spriteCoord = SG.player.getSprite();
		if (SG.player.state.direction > 0) {
			SG.view.context.drawImage(SG.assets['player'].right, (10-spriteCoord[0])*60, spriteCoord[1]*60, 60, 60, SG.player.x - SG.player.width/2, SG.player.y - SG.player.height, 60, 60);
		} else {
			SG.view.context.drawImage(SG.assets['player'].left, (spriteCoord[0])*60, spriteCoord[1]*60, 60, 60, SG.player.x - SG.player.width/2, SG.player.y - SG.player.height, 60, 60);	
		}
		SG.view.context.fillRect(SG.player.x, SG.player.y,3,3);// temp draw point viewer
	},

	getSprite: function() {
		SG.player.updateFrame();
		switch (SG.player.state.attack.type) {
			case null:
				break;
			case 'light':
				return [SG.player.state.frame-1, 1];
				break;
			case 'heavy':
				return [SG.player.state.frame-1, 2];
				break;
		}
		if (SG.player.state.air) { return [6, 0]; }
		switch (SG.player.state.status) {
			case 'idle':
				return [0, 0];
				break;
			case 'walking':
				return [1 + SG.player.state.frame, 0];
				break;
			default:
				return [0, 0];	
		}
	},

	move: function() {
		SG.player.moveX();
		SG.player.moveY();
	},

	moveY: function() {
		if (SG.player.state.air > 0) {
			SG.player.state.air++;
		}
		SG.player.state.force.y -= 2;
		var collision = false;
		SG.player.y -= Math.round(SG.player.state.force.y);
		while (SG.collisions.groundCollision(SG.player.hitbox(),{})) {
			SG.player.y -= SG.player.state.force.y ? 1 : number !== 0 ? -1 : 0;
			SG.player.state.air = 0;
			collision = true;
		}
		if (collision) {
			SG.player.state.force.y = 0;
		}
	},

	moveX: function() {
		if (SG.player.state.attack.type) { SG.player.state.force.x *= 0.8; }
		if (SG.player.state.force.x != 0) {
			if (SG.inputController.active[16]) {
 				SG.player.x += Math.round(SG.player.state.force.x * 1.5);
			} else {
				SG.player.x += Math.round(SG.player.state.force.x);
			}
			// record last force, if decreased significantly then slide
			if (!SG.player.state.air) { SG.player.state.force.x *= 0.8; }
			if (Math.abs(SG.player.state.force.x) < 1) {
				SG.player.state.force.x = 0;
			}
		}
		
	},

	updateFrame: function() {
		if (SG.player.state.attack.type) {
			switch (SG.player.state.attack.type) {
				case 'light':
					if (SG.player.state.frame > 5) {
						SG.player.state.frame=0;
						SG.player.state.attack.type = null;
					} else {
						SG.player.state.frame++;	
					}
					break;
				case 'heavy':
					if (SG.player.state.frame > 8) {
						SG.player.state.frame=0;
						SG.player.state.attack.type = null;
					} else {
						SG.player.state.frame++;	
					}
					break;
			}
		} else if (SG.player.state.force.x == 0) {
			SG.player.state.status = 'idle';
			SG.player.frame = 0;
		} else {
			SG.player.state.status = 'walking';
			if (SG.player.state.status === 'walking') {
				SG.player.state.frame++;
				if (SG.player.state.frame > 7) { SG.player.state.frame = 0 }
			}
		}
	},

	update: function() {
		console.log(SG.player.state.frame);
		SG.player.moveX();
		SG.player.moveY();
	}
};

SG.collisions = {
	groundCollision: function(hitboxA, hitboxB) { // temp hardcoding
		if ((hitboxA.br.y >= SG.view.canvas.height - 100) ||
			  (hitboxA.bl.y >= SG.view.canvas.height - 100)) {
			return true
		} else {
			return false
		}
	},
	rectangleCheck: function(hitboxA, hotboxB) {
	}
};
SG.battle = {
	enemys: [],
	initialize: function() {

	},

	spawn_enemy: function() {
		// get from shits
	},

	update: function() {
		//delta = {SG}
	},
};

SG.initialize();