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
	active: {37: false, 38: false, 39: false, 40: false, 16: false},
	type: {
		battle: function() {
			if (SG.inputController.active[37]) { // left
				SG.player.force.x -= SG.player.current_state.air ? 1 : 3;
				SG.player.current_state.direction = -1;
			}
			if (SG.inputController.active[38]) { // up
				if (SG.player.current_state.air > 0) {
					if (SG.player.current_state.air < 5) { SG.player.force.y += 4; }
				} else {
					SG.player.force.y += 14;
					SG.player.current_state.air = 1;
				}
			}
			if (SG.inputController.active[39]) { // right
				SG.player.force.x += SG.player.current_state.air ? 1 : 3;
				SG.player.current_state.direction = 1;
			}
			if (SG.inputController.active[40]) { // down
				//SG.player.force.y += 2;
			}
			if (Math.abs(SG.player.force.x) > 8) {
				SG.player.force.x = SG.player.force.x > 0 ? 8 : -8;
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
	current_state: {direction: 1, status: 'idle', frame: 0},
	last_state: {air: 1},
	force: {x: 0, y: 0},
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
		light: function() {},
		medium: function() {},
		heavy: function() {},
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
			bl: { x: SG.player.x - SG.player.widthBounds + offsetX,
						y: SG.player.y - offsetY
					},
			br: { x: SG.player.x + SG.player.widthBounds + offsetX,
						y: SG.player.y - offsetY
					}
		}
	},
	draw: function() {
		if (SG.player.current_state.direction > 0) {
			SG.view.context.drawImage(SG.assets['player'].right, SG.player.getSprite()*60, 0, 60, 60, SG.player.x - SG.player.width/2, SG.player.y - SG.player.height, 60, 60);
		} else {
			SG.view.context.drawImage(SG.assets['player'].left, (8-SG.player.getSprite())*60, 0, 60, 60, SG.player.x - SG.player.width/2, SG.player.y - SG.player.height, 60, 60);	
		}
		console.log(SG.player.getSprite());
		SG.view.context.fillRect(SG.player.x, SG.player.y,3,3);// temp draw point viewer
	},
	getSprite: function() {
		if (SG.player.current_state.air) { return 5; }
		switch (SG.player.current_state.status) {
			case 'idle':
				return 0;
				break;
			case 'walking':
				return 1 + SG.player.current_state.frame;
				break;
			default:
				return 0;	
		}
	},
	moveY: function() {
		if (SG.player.last_state.air > 0) {
			SG.player.current_state.air = SG.player.last_state.air + 1;
		}
		SG.player.force.y -= 2;
		var collision = false;
		SG.player.y -= Math.round(SG.player.force.y);
		while (SG.collisions.groundCollision(SG.player.hitbox(),{})) {
			SG.player.y -= SG.player.force.y ? 1 : number !== 0 ? -1 : 0;
			SG.player.current_state.air = 0;
			collision = true;
		}
		if (collision) {
			SG.player.force.y = 0;
		}
	},

	moveX: function() {
		if (SG.player.force.x != 0) {
			if (SG.inputController.active[16]) {
 				SG.player.x += Math.round(SG.player.force.x * 1.5);
			} else {
				SG.player.x += Math.round(SG.player.force.x);
			}
			// record last force, if decreased significantly then slide
			if (!SG.player.last_state.air) { SG.player.force.x *= 0.8; }
			if (Math.abs(SG.player.force.x) < 1) {
				SG.player.force.x = 0;
			}
		}
		if (SG.player.force.x == 0) {
			SG.player.current_state.status = 'idle';
			SG.player.frame = 0;
		} else {
			SG.player.current_state.status = 'walking';
			if (SG.player.last_state.status === 'walking') {
				SG.player.current_state.frame++;
				if (SG.player.current_state.frame > 7) { SG.player.current_state.frame = 0 }
			}
		}
	},

	update: function() {
		SG.player.moveX();
		SG.player.moveY();
		console.log(SG.player.current_state.status);

		SG.player.last_state = SG.player.current_state;
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
		// if ((hitboxA.bl.x > hitboxB.tl.x || hitboxA.bl.y > hitboxB.tl.y) ||
		// 		() ||
		// 		() ||
		// 		() {
		// 	return true
		// } else {
		// 	return false
		// }
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