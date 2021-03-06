/**
 * Render System constructor
 *
 * @class Roguelike.Systems.Render
 * @classdesc The renderer draws entities onto the screen
 *
 * @param {int} game - Reference to the currently running game
 */
Roguelike.Systems.Render = function(game) {

	/**
	 * @property {Roguelike.Game} game - Reference to the current game object
	 */
	this.game = game;

	/**
	 * @property {object} canvas - Reference to the canvas object everything is drawn on
	 */
	this.canvas = null;

	/**
	 * @property {object} canvas - The 2D context of the current canvas object
	 */
	this.context = null;

	/**
	 * @property {array} tileColors - Contains all the default colors for the tiles
	 */
	this.tileColors = ['#302222', '#443939', '#6B5B45'];

	//Initialize itself
	this.initialize();

};

Roguelike.Systems.Render.prototype = {

	/**
	 * The 'constructor' for this component
	 * Gets that canvas object and it's 2D context
	 * @protected
	 */
	initialize: function() {

		//Get the canvas object from the games settings
		this.canvas = this.game.settings.canvas;

		//Define the context to draw on
		this.context = this.game.settings.canvas.getContext("2d");

	},

	/**
	 * Draw the current map onto the canvas
	 * @protected
	 */
	drawMap: function() {

		//Save the context to push a copy of our current drawing state onto our drawing state stack
		this.context.save();

		//Loop through every horizontal row
		for(var y = 0; y < this.game.map.tilesY; y++) {

			//Loop through every vertical row
			for(var x = 0; x < this.game.map.tilesX; x++) {

				//Get the type of the current tile
				var tileType = this.game.map.tiles[y][x].type;

				//Get the corresponding color of this tile from the array of colors
				this.context.fillStyle = this.tileColors[tileType];

				//Get the size of one tile to determine how big each rectangle is
				var tileSize = this.game.map.tileSize;

				//Create a rectangle!
				this.context.fillRect(
					//Get the current position of the tile, and check where it is in the camera's viewport
					(x * tileSize) - this.game.camera.position.x,
					(y * tileSize) - this.game.camera.position.y,
					tileSize,
					tileSize
				);

			}

		}

		//Pop the last saved drawing state off of the drawing state stack
		this.context.restore();

	},

	/**
	 * Function that gets called when the game continues one tick
	 * @protected
	 */
	update: function() {

		//Update the camera
		//TODO: Move this outta here!
		this.game.camera.update();

		//Clear the canvas and draw the map
		this.clear();
		this.drawMap();

		//Then loop through all keyboardControl Entities and check the user input, and handle accordingly
		var entities = this.game.map.entities.getEntities("position", "sprite");

		//Save the context to push a copy of our current drawing state onto our drawing state stack
		this.context.save();

		//Loop through all matching entities
		for(var i = 0; i < entities.length; i++) {

			//Get the components from the current entity and store them temporarily in a variable
			var renderComponent = entities[i].getComponent("sprite");
			var positionComponent = entities[i].getComponent("position");

			//The objects color
			this.context.fillStyle = renderComponent.color;

			//Create the object ( just a rectangle for now )!
			this.context.fillRect(
				(positionComponent.x * this.game.map.tileSize) - this.game.camera.position.x,
				(positionComponent.y * this.game.map.tileSize) - this.game.camera.position.y,
				this.game.map.tileSize,
				this.game.map.tileSize
			);

		}

		//Pop the last saved drawing state off of the drawing state stack
		this.context.restore();

		//Draw the lightmap
		this.drawLightMap();

	},

	/**
	 * Draw the current lightmap onto the canvas
	 * @protected
	 */
	drawLightMap: function() {

		//Save the context to push a copy of our current drawing state onto our drawing state stack
		this.context.save();

		//Loop through every horizontal row
		for(var y = 0; y < this.game.map.tilesY; y++) {

			//Loop through every vertical row
			for(var x = 0; x < this.game.map.tilesX; x++) {

				//Draw the lightmap
				if(this.game.map.tiles[y][x].explored === true && 1 - this.game.map.tiles[y][x].lightLevel > 0.7) {

					this.context.fillStyle = "rgba(0, 0, 0, 0.7)";

				}else{

					this.context.fillStyle = "rgba(0, 0, 0, " + (1 - this.game.map.tiles[y][x].lightLevel) + ")";

				}

				//Get the size of one tile to determine how big each rectangle is
				var tileSize = this.game.map.tileSize;

				//Create a rectangle!
				this.context.fillRect(
					//Get the current position of the tile, and check where it is in the camera's viewport
					(x * tileSize) - this.game.camera.position.x,
					(y * tileSize) - this.game.camera.position.y,
					tileSize,
					tileSize
				);

			}

		}

		//Pop the last saved drawing state off of the drawing state stack
		this.context.restore();

	},

	/**
	 * Function to clear the canvas
	 * @protected
	 */
	clear: function() {

		//Clear the entire canvas
		this.context.clearRect(0, 0, this.game.settings.canvas.width, this.game.settings.canvas.height);

	}

};
