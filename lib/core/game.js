/**
 * Game Constructor
 *
 * @class Roguelike.game
 * @classdesc The heart of this roguelike game! In here we provide access to
 * all the other objects and function, and we handle the startup of the game
 *
 * @param {object} userSettings - The settings that the user provides
 */
Roguelike.Game = function(userSettings) {

	/**
	 * @property {bool} isInitialized - Boolean to see if the game is already initialized
	 */
	this.isInitialized = false;

	/**
	 * @property {Roguelike.Map} map - Reference to the current map
	 */
	this.map = null;

	/**
	 * @property {Roguelike.Systems} systems - An array with all the current systems
	 */
	this.systems = [];

	/**
	 * @property {Roguelike.Camera} camera - Reference to the camera
	 */
	this.camera = null;

	/**
	 * @property {Roguelike.Entity} player - Reference to the player object
	 */
	this.player = null;

	/**
	 * @property {object} settings - The default settings
	 */
	this.settings = {
		canvas: null,
		tilesX: 60,
		tilesY: 40,
		tileSize: 20,
		maxRooms: 10,
		minRoomWidth: 6,
		maxRoomWidth: 12,
		minRoomHeight: 6,
		maxRoomHeight: 12,
		debug: false
	};

	//Extend the default settings with those of the user
	this.settings = Roguelike.Utils.extend(this.settings, userSettings);

	//Initialize itself
	this.initialize();

};

Roguelike.Game.prototype = {

	/**
	 * Initialize the game, create all objects
	 * @protected
	 */
	initialize: function() {

		//Check if the game is already initialized
		if(this.isInitialized) {
			return;
		}

		//Initialize the map
		this.map = new Roguelike.Map(this);
		this.map.initialize();

		//Add a new entity group to the map
		this.map.entities = new Roguelike.Group(this);

		//Generate rooms for this map
		this.map.mapFactory.generateRooms();
		this.map.addRooms();

		//Generate the corridors on this map
		this.map.mapFactory.generateCorridors();

		//Generate doors on this map
		this.map.mapFactory.generateDoors();

		//Add all objects to the map
		this.map.mapFactory.placeEntranceExitObjects();

		//Create the camera object
		this.camera = new Roguelike.Camera(this, {x: 0, y: 0});

		//Create the player entity
		this.player = new Roguelike.Entity();

		//Give the player a health of 100 points
		this.player.addComponent(new Roguelike.Components.Health(100));

		//The starting position of the player is at the dungeon's entrance
		this.player.addComponent(new Roguelike.Components.Position(this.map.entrance.x, this.map.entrance.y));

		//The player has a sprite ( color for now )
		this.player.addComponent(new Roguelike.Components.Sprite("#FF7300"));

		//The player must be controllable by the keyboards arrow keys
		this.player.addComponent(new Roguelike.Components.KeyboardControl());

		//Add a lightsource to the player
		this.player.addComponent(new Roguelike.Components.LightSource(true, 6));

		//Add the player to the entities list of the current map
		this.map.entities.addEntity(this.player);

		//Let the camera follow the player entity
		this.camera.follow(this.player, this.settings.canvas.width / 2, this.settings.canvas.height / 2);

		//Add all systems to the game
		this.systems.push(new Roguelike.Systems.Collision(this));
		this.systems.push(new Roguelike.Systems.Open(this));
		this.systems.push(new Roguelike.Systems.Control(this));
		this.systems.push(new Roguelike.Systems.LightMap(this));
		this.systems.push(new Roguelike.Systems.Render(this));

		//Update the game for the first time
		this.update();

		//The game is fully initialized!
		this.isInitialized = true;

	},

	/**
	 * All the functions that need to be executed every time the game updates
	 * Basically the game loop
	 * @protected
	 */
	update: function() {

		//Loop through each system
		for(var s = 0; s < this.systems.length; s++) {

			//Update the current system
			this.systems[s].update();

		}

	}

};
