//overall
SG = {
	game_state: 'battle', // temp
	initialize: function(canvas) {
		SG.canvas = "";
		SG.keyHandler = SG.controller(battle); // temp
	}
};
SG.view = {
	initialize: function() {
		var canvas = document.getElementById('game-view');
    var context = canvas.getContext('2d');
		window.addEventListener('resize', resizeCanvas, false);
	},
	resizeCanvas: function() {
		canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	}
}
//game state controller
SG.stateController = {
	type: {
		battle: {
			a: function() {
				SG.game
			},
			b: function() {

			}
		}
	},
	switchState: function(state) {
		SG.game_state = state
		SG.controller.switchHandler;
	}
};

// key listener controller
SG.controller = {
	active: {37: false, 38: false, 39: false, 40: false},
	type: {
		battle: function() {
		},
		menu: function() {
		}
	},
	switchHandler: function() {
		// remove old key handler
		switch (SG.game_state)
		{
			case 'battle':
				SG.controller.installHandler(SG.controller.type.battle);
				break;

		}
	},
	installHandler: function(type) {
		SG.keyHandler = type;
	},
	initialize: function() {
		SG.controller.switchHandler();
		window.addEventListener('keydown', SG.controller.keyDown, false);
		window.addEventListener('keyup', SG.controller.keyUp, false);
	},

	keyDown: function(e) {
		console.log(SG.controller.active);
		if (SG.controller.active[e.keyCode] === false) { SG.controller.active[e.keyCode] = true }	
	},
	keyUp: function(e) {
		if (SG.controller.active[e.keyCode]) { SG.controller.active[e.keyCode] = false }
	}
};

SG.player = {
	health: 100,
	coordinates: {x: 1, y: 2}, // tempe
	initialize: function() {
		// get shits from server
		// override with shits
		// maybe ajax requests for skills
	},
	moves: {
		light: function() {},
		medium: function() {},
		heavy: function() {},
		special: function() {}
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

	},
};
