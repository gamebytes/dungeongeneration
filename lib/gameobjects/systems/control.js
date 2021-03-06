/**
 * Control System constructor
 *
 * @class Roguelike.Systems.Control
 * @classdesc The control system is responsible for handling user input
 *
 * @param {int} game - Reference to the currently running game
 */
Roguelike.Systems.Control = function(game) {

	/**
	 * @property {Roguelike.Game} game - Reference to the current game object
	 */
	this.game = game;

	/**
	 * @property {Roguelike.Keyboard} keyboard - Reference to the keyboard object
	 */
	this.keyboard = null;

	/**
	 * @property {Roguelike.Key} upKey - Reference to up key on the keyboard
	 */
	this.upKey = null;

	/**
	 * @property {Roguelike.Key} downKey - Reference to down key on the keyboard
	 */
	this.downKey = null;

	/**
	 * @property {Roguelike.Key} leftKey - Reference to left key on the keyboard
	 */
	this.leftKey = null;

	/**
	 * @property {Roguelike.Key} rightKey - Reference to right key on the keyboard
	 */
	this.rightKey = null;

	//Initialize itself
	this.initialize();

};

Roguelike.Systems.Control.prototype = {

	/**
	 * The 'constructor' for this component
	 * Sets up the right keys and sets functions on them
	 * @protected
	 */
	initialize: function() {

		//Create a new keyboard
		this.keyboard = new Roguelike.Keyboard(this);
		this.keyboard.initialize();

		//Reference to the current system
		var _this = this;

		//Add up key and tell it to move the entities up when it hits
		this.upKey = this.keyboard.getKey(38);

		//Function to perform
		var moveUp = function() {
			_this.queueMovement(38);
		};

		//Attach the function to the keydown event
		this.upKey.onDown.on(38, moveUp, _this);

		//Add down key and tell it to move the entities down when it hits
		this.downKey = this.keyboard.getKey(40);

		//Function to perform
		var moveDown = function() {
			_this.queueMovement(40);
		};

		//Attach the function to the keydown event
		this.downKey.onDown.on(40, moveDown, _this);

		//Add left key and tell it to move the entities left when it hits
		this.leftKey = this.keyboard.getKey(37);

		//Function to perform
		var moveLeft = function() {
			_this.queueMovement(37);
		};

		//Attach the function to the keydown event
		this.leftKey.onDown.on(37, moveLeft, _this);

		//Add right key and tell it to move the entities right when it hits
		this.rightKey = this.keyboard.getKey(39);

		//Function to perform
		var moveRight = function() {
			_this.queueMovement(39);
		};

		//Attach the function to the keydown event
		this.rightKey.onDown.on(39, moveRight, _this);

	},

	/**
	 * Function to queue movement onto entities that have the keyboard control component
	 * @protected
	 *
	 * @param {int} key - The keycode of the move being queued
	 */
	queueMovement: function(key) {

		//Then loop through all keyboardControl Entities and check the user input, and handle accordingly
		var entities = this.game.map.entities.getEntities("keyboardControl", "position");

		//Loop through all matching entities
		for(var i = 0; i < entities.length; i++) {

			//Get the keyboardControl component
			var keyboardControlComponent = entities[i].getComponent("keyboardControl");

			//Add this direction to it's movement queue
			keyboardControlComponent.actions.push(key);

		}

		//All the entities movements are queued, it's time to update the other game mechanics
		this.game.update();

	},

	/**
	 * Function that gets called when the game continues one tick
	 * @protected
	 */
	update: function() {

		//Then loop through all keyboardControl Entities and check the user input, and handle accordingly
		var entities = this.game.map.entities.getEntities("keyboardControl", "position");

		//Loop through all matching entities
		for(var i = 0; i < entities.length; i++) {

			//Get the keyboardControl component
			var keyboardControlComponent = entities[i].getComponent("keyboardControl");

			//Loop through the actions
			for(var a = keyboardControlComponent.actions.length - 1; a >= 0; a--) {

				//Pop the action from the "stack"
				var currentAction = keyboardControlComponent.actions.pop();

				//Move the current entity to the current action
				this.moveEntity(currentAction, entities[i]);

			}

		}

	},

	/**
	 * The function that gets called when the player moves
	 * @protected
	 *
	 * @param {string} direction - The direction the entities are being moved
	 * @param {Roguelike.Entity} entity - The entity that is being controlled
	 */
	moveEntity: function(direction, entity) {

		//Get the current entities position component
		var entityPosition = entity.getComponent("position");

		//Check which controls are being pressed and update the player accordingly
		switch(direction) {

			case (37): //Left

				entityPosition.x -= 1;

				break;

			case (38): //Up

				entityPosition.y -= 1;

				break;

			case (39): //Right

				entityPosition.x += 1;

				break;

			case (40): //Down

				entityPosition.y += 1;

				break;

		}

	}

};
