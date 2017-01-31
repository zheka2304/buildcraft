// fast tile access
var nativeGetTile = ModAPI.requireGlobal("getTile_origin");

// for versions of CE older than 1.06
var UpdatableSaver = ModAPI.requireGlobal("UpdatableSaver");

// 
var FURNACE_FUEL_MAP = {
	5: 300,
	6: 100,
	17: 300,
	263: 1600,
	280: 100,
	268: 200,
	269: 200,
	270: 200,
	271: 200,
	85: 300,
	107: 300,
	134: 300,
	135: 300,
	158: 150,
	162: 300,
	163: 300,
	164: 300,
	184: 300,
	185: 300,
	186: 300,
	187: 300,
	53: 300,
	54: 300,
	58: 300
};

// gui fonts
var STD_FONT_MEDIUM = {color: android.graphics.Color.WHITE, size: 28, shadow: .7};
var RED_FONT_MEDIUM = {color: android.graphics.Color.RED, size: 28, shadow: .7};




function TileRenderModel(id, data){
	this.registerAsId = function(id, data){
		var block = Unlimited.API.GetReal(id, data || 0);
		this.id = block.id;
		this.data = block.data;
		this.convertedId = this.id * 16 + this.data;
		
		if (this.convertedId){
			ICRenderLib.registerTileModel(this.convertedId, this);
		}
		else{
			Logger.Log("tile model cannot be registred: block id is undefined or 0", "ERROR");
		}
	}
	
	this.cloneForId = function(id, data){
		this.registerAsId(id, data);
	}
	
	this.registerAsId(id, data);
	
	this.boxes = [];
	this.dynamic = [];

	this.formatBox = function(x1, y1, z1, x2, y2, z2, block){
		var M = 1.0;
		var box = [
			x1 * M, y1 * M, z1 * M,
			x2 * M, y2 * M, z2 * M,
		];

		if (block){
			block = Unlimited.API.GetReal(block.id, block.data);
			box.push(parseInt(block.id) || 0);
			box.push(parseInt(block.data) || 0)
		}
		else{
			box.push(-1);
			box.push(-1);
		}

		return box;
	}

	this.addBoxF = function(x1, y1, z1, x2, y2, z2, block){
		this.boxes.push(this.formatBox(x1, y1, z1, x2, y2, z2, block));
	}
 
	this.addBox = function(x, y, z, size, block){
		this.boxes.push(this.formatBox(
				x, y, z,
				(x + size.x),
				(y + size.y),
				(z + size.z), 
				block
			)
		);
	}

	this.createCondition = function(x, y, z, mode){
		var model = this;
		var condition = {
			x: x, y: y, z: z,
			mode: Math.max(0, mode || 0),

			boxes: [],
			
			addBoxF: function(x1, y1, z1, x2, y2, z2, block){
				this.boxes.push(model.formatBox(x1, y1, z1, x2, y2, z2, block));
			},

			addBox: function(x, y, z, size, block){
				this.boxes.push(model.formatBox(
						x, y, z,
						(x + size.x),
						(y + size.y),
						(z + size.z), 
						block
					)
				);
			},

			tiles: {},
			tileGroups: [],
			
			addBlock: function(id, data){
				var block = Unlimited.API.GetReal(id, data || 0);
				var convertedId = block.id * 16 + block.data;
				this.tiles[convertedId] = true;
			},
			
			addBlockGroup: function(name){
				this.tileGroups.push(name);
			},
			
			addBlockGroupFinal: function(name){
				var group = ICRenderLib.getConnectionGroup(name);
				for (var id in group){
					this.tiles[id] = true;
				}
			},
			
			writeCondition: function(){
				var output = parseInt(this.x) + " " + parseInt(this.y) + " " + parseInt(this.z) + " " + parseInt(this.mode) + "\n";
				
				for (var i in this.tileGroups){
					this.addBlockGroupFinal(this.tileGroups[i]);
				}
				
				var blocks = [];
				for(var id in this.tiles){
					blocks.push(id);
				}
				output += blocks.length + " " + blocks.join(" ") + "\n" + condition.boxes.length + "\n";
				
				for(var i in condition.boxes){
					output += condition.boxes[i].join(" ") + "\n";
				}
				
				return output;
			}
		};

		this.dynamic.push(condition);
		return condition;
	}
	
	this.connections = {};
	this.connectionGroups = [];
	this.connectionWidth = 0.5;
	this.hasConnections = false;
	
	this.setConnectionWidth = function(width){
		this.connectionWidth = width;
	}
	
	this.addConnection = function(id, data){
		var block = Unlimited.API.GetReal(id, data || 0);
		var convertedId = block.id * 16 + block.data;
		this.connections[convertedId] = true;
		this.hasConnections = true;
	}
	
	this.addConnectionGroup = function(name){
		this.connectionGroups.push(name);
		this.hasConnections = true;
	}
	
	this.addConnectionGroupFinal = function(name){
		var group = ICRenderLib.getConnectionGroup(name);
		for (var id in group){
			this.connections[id] = true;
		}
	}
	
	this.addSelfConnection = function(){
		this.connections[this.convertedId] = true;
		this.hasConnections = true;
	}
	
	this.writeAsId = function(id){
		var output = "";
		output += id + " " + (this.hasConnections ? 1 : 0) + "\n";
		output += this.boxes.length + "\n";
		
		for (var i in this.boxes){
			output += this.boxes[i].join(" ") + "\n";
		}

		output += this.dynamic.length + "\n";
		for(var i in this.dynamic){
			var condition = this.dynamic[i];
			output += condition.writeCondition();
		}
		
		for (var i in this.connectionGroups){
			this.addConnectionGroupFinal(this.connectionGroups[i]);
		}
		
		var connections = [];
		for (var id in this.connections){
			connections.push(id);
		}
		
		output += connections.length + " " + this.connectionWidth + "\n" + connections.join(" ");
		return output;
	}
}


var ICRenderLib = ModAPI.requireAPI("ICRenderLib");

if (!ICRenderLib){
	var ICRenderLib = {
		/* model registry */
		tileModels: {},
		
		registerTileModel: function(convertedId, model){
			this.tileModels[convertedId] = model;
		},
		
		/* output */
		writeAllData: function(){
			var output = "";
			var count = 0;
			for (var id in this.tileModels){
				output += this.tileModels[id].writeAsId(id) + "\n\n";
				count++;
			}
			
			output = count + "\n\n" + output;
			FileTools.WriteText("games/com.mojang/mods/icrender", output);
		},
		
		/* connection groups functions */
		connectionGroups: {},
		
		addConnectionBlockWithData: function(name, blockId, blockData){
			var group = this.connectionGroups[name];
			if (!group){
				group = {};
				this.connectionGroups[name] = group;
			}
			
			var block = Unlimited.API.GetReal(blockId, blockData);
			group[block.id * 16 + block.data] = true;
		},
		
		addConnectionBlock: function(name, blockId){
			for (var data = 0; data < 16; data++){
				this.addConnectionBlockWithData(name, blockId, data);
			}
		},
		
		addConnectionGroup: function(name, blockIds){
			for (var i in blockIds){
				this.addConnectionBlock(name, blockIds[i]);
			}
		},
		
		getConnectionGroup: function(name){
			return this.connectionGroups[name];
		},
		
		
		/* standart models */
		registerAsWire: function(id, connectionGroupName, width){
			width = width || 0.5;
			
			var model = new TileRenderModel(id, 0);
			model.addConnectionGroup(connectionGroupName);
			model.addSelfConnection();
			model.setConnectionWidth(width);
			model.addBox(.5 - width / 2.0, .5 - width / 2.0, .5 - width / 2.0, {
				x: width,
				y: width,
				z: width,
			});
			
			this.addConnectionBlock(connectionGroupName, id);
		}
	};
	
	
	ModAPI.registerAPI("ICRenderLib", ICRenderLib);
	Callback.addCallback("PostLoaded", function(){
		ICRenderLib.writeAllData();
	});
	Logger.Log("ICRender API was created and shared by " + __name__ + " with name ICRenderLib", "API");
}




/**

// exampe of block model

Block.setPrototype("pillar", {
	getVariations: function(){
		return [
			{name: "Pillar", texture: [["cobblestone", 0]], inCreative: true}
		]
	}
});
Block.setBlockShape(BlockID.pillar, {x: 0.25, y: 0, z: 0.25},  {x: 0.75, y: 1, z: 0.75})

var pillarRender = new TileRenderModel(BlockID.pillar);

var pillarCondition1 = pillarRender.createCondition(0, -1, 0, 1);
var pillarCondition2 = pillarRender.createCondition(0, 1, 0, 1);
pillarCondition1.addBlock(BlockID.pillar, 0);
pillarCondition2.addBlock(BlockID.pillar, 0);

for(var i = 0; i < 4; i++){
	pillarCondition1.addBoxF(i / 16, i / 16, i / 16, 1.0 - i / 16, (i + 1) / 16, 1.0 - i / 16);
	pillarCondition2.addBoxF(i / 16, 1.0 - (i + 1) / 16, i / 16, 1.0 - i / 16, 1.0 - i / 16, 1.0 - i / 16);
}

pillarRender.addBoxF(0.25, 0.0, 0.25, 0.75, 1.0, 0.75, {id: 5, data: 2});

*/



var ModelHelper = {
	Texture: function(name, offset, size) {
		this.name = name;
		this.offset = offset;
		this.size = size;
		
		this.getUV = function(){
			return this.offset;
		}
		
		this.getSize = function(){
			return this.size;
		}
		
		this.getTexture = function(){
			return this.name;
		}
		
		this.textureMatches = function(texture){
			return this.name == texture.name;
		}
	},
	
}


var IndustrialIntergation = {
	
}




IDRegistry.genItemID("bcWrench");
Item.createItem("bcWrench", "Wrench", {name: "bc_wrench"});


IDRegistry.genItemID("engineWooden");
Item.createItem("engineWooden", "Redstone Engine", {name: "wooden_engine"});

IDRegistry.genItemID("engineStone");
Item.createItem("engineStone", "Stirling Engine", {name: "stone_engine"});

IDRegistry.genItemID("engineIron");
Item.createItem("engineIron", "ICE", {name: "iron_engine"});

Item.registerUseFunction("engineWooden", function(coords, item, block){
	var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
	if (block.id == 0){
		World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
		World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_WOOD);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

Item.registerUseFunction("engineStone", function(coords, item, block){
	var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
	if (block.id == 0){
		World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
		World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_STONE);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

Item.registerUseFunction("engineIron", function(coords, item, block){
	var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
	if (block.id == 0){
		World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
		World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_IRON);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});


var TransportingHelper = {
	ItemPipeTiles: {
		
	},
	
	FluidPipeTiles: {
		
	},
	
	BasicItemContainers: {
		54: true,
		61: true,
		62: true
	},
	
	ItemTransportingDenied: {
		
	},
	
	FluidTransportingDenied: {
		
	},
	
	denyTransporting: function(id, item, fluid){
		if (item){
			this.ItemTransportingDenied[id] = true;
		}
		if (fluid){
			this.FluidTransportingDenied[id] = true;
		}
	},
	
	isItemTransportDir: function(x, y, z){
		var block = World.getBlock(x, y, z).id;
		return (this.ItemPipeTiles[block] || this.BasicItemContainers[block] || TileEntity.isTileEntityBlock(block)) && !this.ItemTransportingDenied[block];
	},
	
	isItemPipe: function(x, y, z){
		return nativeGetTile(x, y, z) == BLOCK_TYPE_ITEM_PIPE;
	},
	
	isFluidPipe: function(x, y, z){
		return nativeGetTile(x, y, z) == BLOCK_TYPE_LIQUID_PIPE;
	},
	
	
	findBasicDirections: function(position, direction, checkBackwardDirection){
		var directions = [
			{x: -1, y: 0, z: 0},
			{x: 1, y: 0, z: 0},
			{x: 0, y: -1, z: 0},
			{x: 0, y: 1, z: 0},
			{x: 0, y: 0, z: -1},
			{x: 0, y: 0, z: 1},
		];
		var possibleDirs = [];
		for (var i in directions){
			var dir = directions[i];
			if (checkBackwardDirection && dir.x == -direction.x && dir.y == -direction.y && dir.z == -direction.z){
				continue;
			}
			if (this.isItemTransportDir(position.x + dir.x, position.y + dir.y, position.z + dir.z)){
				possibleDirs.push(dir);
			}
		}
		return possibleDirs;
	},
	
	findNearbyContainers: function(position){
		var directions = [
			{x: -1, y: 0, z: 0},
			{x: 1, y: 0, z: 0},
			{x: 0, y: -1, z: 0},
			{x: 0, y: 1, z: 0},
			{x: 0, y: 0, z: -1},
			{x: 0, y: 0, z: 1},
		];
		var possibleDirs = [];
		for (var i in directions){
			var dir = directions[i];
			var container = World.getContainer(position.x + dir.x, position.y + dir.y, position.z + dir.z);
			if (container){
				var block = World.getBlock(position.x + dir.x, position.y + dir.y, position.z + dir.z).id;
				if (!this.ItemTransportingDenied[block]){
					possibleDirs.push(dir);
				}
			}
		}
		return possibleDirs;
	},
	
	getPathData: function(transportedItem, item, position, direction){
		position = {
			x: Math.floor(position.x),
			y: Math.floor(position.y),
			z: Math.floor(position.z),
		};
		var cachedData;
		
		// TODO: chaching block start
		var inPipe = this.isItemPipe(position.x, position.y, position.z);
		var container = World.getContainer(position.x, position.y, position.z);
		var tileEntity = container && container.tileEntity;
		
		var checkBackwardDirection = !container || (inPipe && !(tileEntity && tileEntity.getTransportedItemDirs));
		var possibleDirs = this.findBasicDirections(position, direction, checkBackwardDirection);
		
		cachedData = {
			tileEntity: tileEntity,
			container: container,
			inPipe: inPipe,
			possibleDirs: possibleDirs
		};
		// TODO: chaching block end
		
		if (cachedData.tileEntity && cachedData.tileEntity.getTransportedItemDirs){
			var resultDirs = cachedData.tileEntity.getTransportedItemDirs(transportedItem, cachedData.possibleDirs, item, direction);
		}
		else{
			var resultDirs = cachedData.possibleDirs;
		}
		
		return {
			inPipe: cachedData.inPipe,
			directions: resultDirs,
			container: cachedData.container,
			tileEntity: cachedData.tileEntity
		};
	}
};

// register item pipes
Callback.addCallback("PostLoaded", function(){
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemWooden] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemCobble] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemStone] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemSandstone] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemIron] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemGolden] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemObsidian] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemEmerald] = true;
	TransportingHelper.ItemPipeTiles[BlockID.pipeItemDiamond] = true;
});


var UPDATABLE_TRANSPORTED_ITEM = "TRANSPORTED_ITEM";
var TRANSPORTED_ITEM_SAVER = {
	save: function(){
		return {
			position: this.pos,
			item: this.item,
			target: this.target,
			direction: this.direction,
			inPipeFlag: this.inPipeFlag
		};
	},
	
	read: function(data){
		if (!data || !data.item){
			return true;
		}
		var item = new TransportingItem();
		if (data.position){
			item.pos = data.position;
		}
		if (data.item){
			item.item = data.item;
		}
		if (data.target){
			item.target = data.target;
		}
		if (data.direction){
			item.direction = data.direction;
		}
		item.inPipeFlag = data.inPipeFlag;
		item.load();
		return true;
	}
};

UpdatableSaver.registerPrototype(UPDATABLE_TRANSPORTED_ITEM, TRANSPORTED_ITEM_SAVER);

function registerTransportedItem(updatable){
	UpdatableSaver.attachSaverPrototype(updatable, UPDATABLE_TRANSPORTED_ITEM);
}




var UPDATABLE_TRANSPORTED_FLUID = "TRANSPORTED_FLUID";



function TransportingItem(){
	this.pos = {
		x: 0,
		y: 0,
		z: 0
	};
	
	this.item = {
		id: 0,
		count: 0,
		data: 0
	};
	
	this.inPipeFlag = false;
	
	this.animation = null;
	
	this.setPosition = function(x, y, z){
		this.pos = {
			x: x,
			y: y,
			z: z
		};
	}
	
	this.reloadAnimation = function(){
		if (this.animation){
			this.animation.destroy();
		}
		this.animation = new Animation.Item(this.pos.x, this.pos.y, this.pos.z);
		var modelCount = 1;
		if (this.item.count > 1){
			modelCount = 2;
		}
		if (this.item.count > 12){
			modelCount = 3;
		}
		if (this.item.count > 56){
			modelCount = 4;
		}
		this.animation.describeItem({
			id: this.item.id,
			count: modelCount,
			data: this.item.data,
			size: .5,
			rotation: "x"
		});
		this.animation.load();
	}
	
	this.moveAnimation = function(){
		this.animation.setPos(this.pos.x, this.pos.y, this.pos.z);
	}
	
	this.setItemSource = function(item){
		this.item = item || {id: 0, count: 0, data: 0};
		this.reloadAnimation();
	}
	
	this.setItem = function(id, count, data){
		this.item = {
			id: id,
			count: count, 
			data: data
		};
		this.reloadAnimation();
	}
	
	this.drop = function(){
		this.destroy();
		if (this.item && this.item.id > 0 && this.item.count > 0){
			var item = World.drop(this.pos.x, this.pos.y, this.pos.z, this.item.id, this.item.count, this.item.data);
			Entity.setVelocity(item, this.direction.x * this.velocity * 1.5,  this.direction.y * this.velocity * 1.5,  this.direction.z * this.velocity * 1.5)
		}
		this.setItem(0, 0, 0);
	}
	
	this.validate = function(){
		if (!this.item || this.item.count <= 0){
			this.destroy();
		}
	}
	
	
	
	
	
	
	this.target = null;
	this.velocity = .05;
	this.direction = {
		x: 0, 
		y: 0, 
		z: 0
	};
	
	this.move = function(){
		if (this.target && this.velocity){
			var delta = {
				x: this.target.x - this.pos.x,
				y: this.target.y - this.pos.y,
				z: this.target.z - this.pos.z,
			};
			var dis = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z);
			this.direction = {
				x: Math.floor(delta.x / dis + .5) || 0,
				y: Math.floor(delta.y / dis + .5) || 0,
				z: Math.floor(delta.z / dis + .5) || 0,
			};
			var move = Math.min(dis, this.velocity) / dis || 0;
			this.pos.x += delta.x * move;
			this.pos.y += delta.y * move;
			this.pos.z += delta.z * move;
			return dis <= this.velocity;
		}
		return true;
	};
	
	this.setTarget = function(x, y, z){
		this.target = {
			x: Math.floor(x) + .5 || 0,
			y: Math.floor(y) + .5 || 0,
			z: Math.floor(z) + .5 || 0,
		};
	},
	
	
	this.addItemToContainer = function(container){
		container.refreshSlots();
		var tileEntity = container.tileEntity;
		var slots = [];
		var slotsInitialized = false;
		if (tileEntity){
			if (tileEntity.addTransportedItem){
				tileEntity.addTransportedItem(this, this.item, this.direction);
			}
			if (tileEntity.getTransportSlots){
				slots = tileEntity.getTransportSlots().input || [];
				slotsInitialized = true;
			}
		}
		if (!slotsInitialized){
			for (var name in container.slots){
				slots.push(name);
			}
		}
		for (var i in slots){
			var slot = container.getSlot(slots[i]);
			if (this.item.count <= 0){
				break;
			}
			if (slot.id == 0 || slot.id == this.item.id && slot.data == this.item.data){
				var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
				var add = Math.min(maxstack - slot.count, this.item.count);
				this.item.count -= add;
				slot.count += add;
				slot.id = this.item.id;
				slot.data = this.item.data;
			}
		}
		container.applyChanges();
		container.validateAll();
	}
	
	this.pathfind = function(){
		var pathdata = TransportingHelper.getPathData(this, this.item, this.pos, this.direction);
		var directions = pathdata.directions;
		var dir = directions[parseInt(directions.length * Math.random())];
		
		if (pathdata.inPipe){			
			dir = dir || this.direction;
			this.inPipeFlag = true;
		}
		else if (pathdata.container){
			if (this.inPipeFlag){
				this.addItemToContainer(pathdata.container);
				this.validate();
			}
			this.inPipeFlag = false;
		}
		else {
			if (this.inPipeFlag){
				this.drop();
			}
			if (!dir){
				this.drop();
			}
		}
		
		if (dir){
			this.target = {
				x: Math.floor(this.pos.x) + .5 + dir.x,
				y: Math.floor(this.pos.y) + .5 + dir.y,
				z: Math.floor(this.pos.z) + .5 + dir.z,
			};
		}
	}
	
	
	
	
	
	this.load = function(){
		UpdatableAPI.addUpdatable(this);
		registerTransportedItem(this);
		this.reloadAnimation();
	},
	
	this.destroy = function(){
		this.remove = true;
		if (this.animation){
			this.animation.destroy();
		}
	}
	
	this.update = function(){
		if (this.move()){
			this.pathfind();
		}
		if (!this.item || this.item.count < 0 || !this.item.id){
			this.destroy();
		}
		this.moveAnimation();
	}
	
	//UpdatableSaver.attachSaverPrototype(this, UPDATABLE_TRANSPORTED_ITEM);
}

Callback.addCallback("ItemUse", function(coords, carried, block){
	if (carried.id == 280){
		var item = new TransportingItem();
		item.setPosition(coords.x + .5, coords.y + .5, coords.z + .5);
		item.setItem(264, 55, 0);
		item.load();
	}
});


var BLOCK_TYPE_ITEM_PIPE = Block.createSpecialType({
	base: 20,
	renderlayer: 3
}, "bc-item-pipe");

var BLOCK_TYPE_LIQUID_PIPE = Block.createSpecialType({
	base: 20,
	renderlayer: 3
}, "bc-liquid-pipe");

var PIPE_BLOCK_WIDTH = 0.25;


// item pipe render setup

var PIPE_RENDER_CONNECTION_ITEM_MACHINE = "bc-item-pipe-mech";

var ITEM_PIPE_RENDER_CONNECTION_ANY = "bc-item-pipe-any";
var ITEM_PIPE_RENDER_CONNECTION_STONE = "bc-item-pipe-stone";
var ITEM_PIPE_RENDER_CONNECTION_COBBLE = "bc-item-pipe-cobble";
var ITEM_PIPE_RENDER_CONNECTION_SANDSTONE = "bc-item-pipe-sandstone";

function setupItemPipeRender(id, connectionType){
	var model = new TileRenderModel(id, 0);
	model.addConnectionGroup(connectionType);
	model.addConnectionGroup(PIPE_RENDER_CONNECTION_ITEM_MACHINE);
	model.setConnectionWidth(PIPE_BLOCK_WIDTH * 2);
	
	ICRenderLib.addConnectionBlock(ITEM_PIPE_RENDER_CONNECTION_ANY, id);
	if (connectionType == ITEM_PIPE_RENDER_CONNECTION_ANY){
		ICRenderLib.addConnectionBlock(ITEM_PIPE_RENDER_CONNECTION_STONE, id);
		ICRenderLib.addConnectionBlock(ITEM_PIPE_RENDER_CONNECTION_COBBLE, id);
		ICRenderLib.addConnectionBlock(ITEM_PIPE_RENDER_CONNECTION_SANDSTONE, id);
	}
}


// item pipes 

IDRegistry.genBlockID("pipeItemWooden");
Block.createBlock("pipeItemWooden", [
	{name: "Wooden Transporting Pipe", texture: [["pipe_item_wood", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemCobble");
Block.createBlock("pipeItemCobble", [
	{name: "Cobblestone Transporting Pipe", texture: [["pipe_item_cobble", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemStone");
Block.createBlock("pipeItemStone", [
	{name: "Stone Transporting Pipe", texture: [["pipe_item_cobble", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemSandstone");
Block.createBlock("pipeItemSandstone", [
	{name: "Sandstone Transporting Pipe", texture: [["pipe_item_sandstone", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemIron");
Block.createBlock("pipeItemIron", [
	{name: "Iron Transporting Pipe", texture: [["pipe_item_iron", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemGolden");
Block.createBlock("pipeItemGolden", [
	{name: "Golden Transporting Pipe", texture: [["pipe_item_gold", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemObsidian");
Block.createBlock("pipeItemObsidian", [
	{name: "Obsidian Transporting Pipe", texture: [["pipe_item_obsidian", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemEmerald");
Block.createBlock("pipeItemEmerald", [
	{name: "Emerald Transporting Pipe", texture: [["pipe_item_emerald", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemDiamond");
Block.createBlock("pipeItemDiamond", [
	{name: "Diamond Transporting Pipe", texture: [["pipe_item_diamond", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Block.setBlockShape(BlockID.pipeItemWooden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemCobble, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemStone, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemSandstone, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemIron, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemGolden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemObsidian, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemEmerald, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemDiamond, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});

setupItemPipeRender(BlockID.pipeItemWooden, ITEM_PIPE_RENDER_CONNECTION_ANY);
setupItemPipeRender(BlockID.pipeItemCobble, ITEM_PIPE_RENDER_CONNECTION_COBBLE);
setupItemPipeRender(BlockID.pipeItemStone, ITEM_PIPE_RENDER_CONNECTION_STONE);
setupItemPipeRender(BlockID.pipeItemSandstone, ITEM_PIPE_RENDER_CONNECTION_SANDSTONE);
setupItemPipeRender(BlockID.pipeItemIron, ITEM_PIPE_RENDER_CONNECTION_ANY);
setupItemPipeRender(BlockID.pipeItemGolden, ITEM_PIPE_RENDER_CONNECTION_ANY);
setupItemPipeRender(BlockID.pipeItemObsidian, ITEM_PIPE_RENDER_CONNECTION_ANY);
setupItemPipeRender(BlockID.pipeItemEmerald, ITEM_PIPE_RENDER_CONNECTION_ANY);
setupItemPipeRender(BlockID.pipeItemDiamond, ITEM_PIPE_RENDER_CONNECTION_ANY);



// fluid pipe render setup

var PIPE_RENDER_CONNECTION_FLUID_MACHINE = "bc-fluid-pipe-mech";

var FLUID_PIPE_RENDER_CONNECTION_ANY = "bc-fluid-pipe-any";
var FLUID_PIPE_RENDER_CONNECTION_STONE = "bc-fluid-pipe-stone";
var FLUID_PIPE_RENDER_CONNECTION_COBBLE = "bc-fluid-pipe-cobble";
var FLUID_PIPE_RENDER_CONNECTION_SANDSTONE = "bc-fluid-pipe-sandstone";

function setupFluidPipeRender(id, connectionType){
	var model = new TileRenderModel(id, 0);
	model.addConnectionGroup(connectionType);
	model.addConnectionGroup(PIPE_RENDER_CONNECTION_FLUID_MACHINE);
	model.setConnectionWidth(PIPE_BLOCK_WIDTH * 2);
	
	ICRenderLib.addConnectionBlock(FLUID_PIPE_RENDER_CONNECTION_ANY, id);
	if (connectionType == FLUID_PIPE_RENDER_CONNECTION_ANY){
		ICRenderLib.addConnectionBlock(FLUID_PIPE_RENDER_CONNECTION_STONE, id);
		ICRenderLib.addConnectionBlock(FLUID_PIPE_RENDER_CONNECTION_COBBLE, id);
		ICRenderLib.addConnectionBlock(FLUID_PIPE_RENDER_CONNECTION_SANDSTONE, id);
	}
}


// fluid pipes

IDRegistry.genBlockID("pipeFluidWooden");
Block.createBlock("pipeFluidWooden", [
	{name: "Wooden Fluid Pipe", texture: [["pipe_fluid_wood", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidCobble");
Block.createBlock("pipeFluidCobble", [
	{name: "Cobblestone Fluid Pipe", texture: [["pipe_fluid_cobble", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidStone");
Block.createBlock("pipeFluidStone", [
	{name: "Stone Fluid Pipe", texture: [["pipe_fluid_cobble", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidIron");
Block.createBlock("pipeFluidIron", [
	{name: "Iron Fluid Pipe", texture: [["pipe_fluid_iron", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidGolden");
Block.createBlock("pipeFluidGolden", [
	{name: "Golden Fluid Pipe", texture: [["pipe_fluid_gold", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidEmerald");
Block.createBlock("pipeFluidEmerald", [
	{name: "Emerald Fluid Pipe", texture: [["pipe_fluid_emerald", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);


Block.setBlockShape(BlockID.pipeFluidWooden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidCobble, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidStone, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidIron, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidGolden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidEmerald, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});

setupFluidPipeRender(BlockID.pipeFluidWooden, FLUID_PIPE_RENDER_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidCobble, FLUID_PIPE_RENDER_CONNECTION_COBBLE);
setupFluidPipeRender(BlockID.pipeFluidStone, FLUID_PIPE_RENDER_CONNECTION_STONE);
setupFluidPipeRender(BlockID.pipeFluidIron, FLUID_PIPE_RENDER_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidGolden, FLUID_PIPE_RENDER_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidEmerald, FLUID_PIPE_RENDER_CONNECTION_ANY);


TileEntity.registerPrototype(BlockID.pipeItemWooden, {
	defaultValues: {
		containerIndex: 0,
	},
	
	
	
	MJEnergyDeploy: function(amount, generator, params){
		var containerData = this.findContainer();
		if (containerData && containerData.container){
			var item = this.getItemFrom(containerData.container, amount >= 8 ? amount * 8 : 1);
			if (item){
				var transportedItem = new TransportingItem();
				transportedItem.setPosition(containerData.position.x + .5, containerData.position.y + .5, containerData.position.z + .5);
				transportedItem.setItem(item.id, item.count, item.data);
				transportedItem.load();
			}
			else{
				this.data.containerIndex++;
			}
		}
	},
	
	findContainer: function(){
		var directions = TransportingHelper.findNearbyContainers(this);
		var dir = directions[this.data.containerIndex % directions.length];
		
		if (dir){
			var container = World.getContainer(this.x + dir.x, this.y + dir.y, this.z + dir.z);
			return {
				container: container,
				direction: dir,
				position: {x: this.x + dir.x, y: this.y + dir.y, z: this.z + dir.z}
			};
		}
	},
	
	getItemFrom: function(container, maxCount){
		container.refreshSlots();
		var tileEntity = container.tileEntity;
		var slots = [];
		var slotsInitialized = false;
		if (tileEntity){
			if (tileEntity.getTransportedItem){
				tileEntity.getTransportedItem();
			}
			if (tileEntity.getTransportSlots){
				slots = tileEntity.getTransportSlots().ouput || [];
				slotsInitialized = true;
			}
		}
		if (!slotsInitialized){
			for (var name in container.slots){
				slots.push(name);
			}
		}
		
		var item = null;
		for (var i in slots){
			var slot = container.getSlot(slots[i]);
			if (slot.id > 0){
				var count = Math.min(maxCount, slot.count);
				item = {id: slot.id, count: count, data: slot.data};
				slot.count -= count;
				break;
			}
		}
		container.validateAll();
		container.applyChanges();
		return item;
	}
});


var EngineModelPartRegistry = {
	models: {},
	
	Add: function(name, model){
		this.models[name] = model;
	},
	
	Get: function(name){
		return this.models[name];
	}
};

EngineModelPartRegistry.Add("trunkBlue0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlue1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlue2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 0}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkGreen0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkGreen1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkGreen2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 32}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkOrange0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkOrange1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkOrange2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 64}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkRed0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkRed1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkRed2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 96}, {width: 512, height: 512}));


EngineModelPartRegistry.Add("engineWood0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 0}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("engineStone0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 32}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("engineIron0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 64}, {width: 512, height: 512}));


var ENGINE_TYPE_WOOD = "Wood";
var ENGINE_TYPE_STONE = "Stone";
var ENGINE_TYPE_IRON = "Iron";

var ENGINE_HEAT_BLUE = "Blue";
var ENGINE_HEAT_GREEN = "Green";
var ENGINE_HEAT_ORANGE = "Orange";
var ENGINE_HEAT_RED = "Red";

var ENGINE_HEAT_ORDER = [
	ENGINE_HEAT_BLUE,
	ENGINE_HEAT_GREEN,
	ENGINE_HEAT_ORANGE,
	ENGINE_HEAT_RED
];

var ENGINE_ROTATION_Y = 0;
var ENGINE_ROTATION_X = 1;
var ENGINE_ROTATION_Z = 2;

var ENGINE_TYPE_DATA = {};

function getEngineTypeValue(type, method){
	if (ENGINE_TYPE_DATA[type]){
		return ENGINE_TYPE_DATA[type][method];
	}
}


var EngineModelHelper = {
	init: function(){
		
	},
	
	createPiston: function(type, heat, rotation, direction, position){
		var pistonMaterial = EngineModelPartRegistry.Get("engine" + type + rotation);
		var trunkMaterial = EngineModelPartRegistry.Get("trunk" + heat + rotation);
		
		var coords = {
			x: 0,
			y: 0, 
			z: 0
		};
		
		switch (rotation){
			case ENGINE_ROTATION_X:
			coords.x = direction;
			break;
			case ENGINE_ROTATION_Y:
			coords.y = direction;
			break;
			case ENGINE_ROTATION_Z:
			coords.z = direction;
			break;
		};
		
		var renderName = [type, heat, rotation, direction, position] + "";
		var render = new Render({name: renderName});
		if (render.isEmpty){
			var modelData = [{
				type: "box",
				uv: pistonMaterial.getUV(),
				coords: {
					x: 0 + coords.x * 6,
					y: 24 + coords.y * 6,
					z: 0 + coords.z * 6,
				},
				size: {
					x: 4 + 12 * (1 - Math.abs(coords.x)),
					y: 4 + 12 * (1 - Math.abs(coords.y)),
					z: 4 + 12 * (1 - Math.abs(coords.z))
				}
			},
			{
				type: "box",
				uv: pistonMaterial.getUV(),
				coords: {
					x: 0 + coords.x * (2 - position / 3),
					y: 24 + coords.y * (2 - position / 3),
					z: 0 + coords.z * (2 - position / 3),
				},
				size: {
					x: 4 + 12 * (1 - Math.abs(coords.x)),
					y: 4 + 12 * (1 - Math.abs(coords.y)),
					z: 4 + 12 * (1 - Math.abs(coords.z))
				}
			}];
			
			if (pistonMaterial.textureMatches(trunkMaterial)){
				modelData.push({
					type: "box",
					uv: trunkMaterial.getUV(),
					coords: {
						x: 0 - coords.x * .1,
						y: 24 - coords.y * .1,
						z: 0 - coords.z * .1
					},
					size: {
						x: 8 + 8 * (Math.abs(coords.x)),
						y: 8 + 8 * (Math.abs(coords.y)),
						z: 8 + 8 * (Math.abs(coords.z))
					}
				});
			}
			render.setPart("body", modelData, pistonMaterial.getSize());
			render.saveState(renderName);
		}
		
		return {
			skin: pistonMaterial.getTexture(),
			renderAPI: render,
			firmRotation: true,
			hitbox: {
				width: .2,
				height: .4
			}
		};
	}
}




IDRegistry.genBlockID("bcEngine");
Block.createBlock("bcEngine", [
	{name: "bcEngine", texture: [["empty", 0]], inCreative: false}
], BLOCK_TYPE_ITEM_PIPE);

Block.registerDropFunction("bcEngine", function(){
	return [];
});

TransportingHelper.denyTransporting(BlockID.bcEngine, true, true);




TileEntity.registerPrototype(BlockID.bcEngine, {
	defaultValues:{
		type: null,
		rotation: 0,
		direction: 1,
		heatStage: ENGINE_HEAT_BLUE,
		
		rotationIndex: 0,
		redstone: false,
		
		position: 24, // low piston position
		energy: 0,
		heat: 0,
		power: 0,
		targetPower: 0
	},
	
	destroyAnimation: function(){
		if (this.animationPiston){
			this.animationPiston.destroy();
		}
	},
	
	reloadAnimation: function(){
		this.destroyAnimation();
		
		var engineValues = this.data;
		this.animationPiston = new Animation.Base(this.x + .5, this.y + .5, this.z + .5);
		this.animationPiston.loadCustom(function(){
			var animData = EngineModelHelper.createPiston(engineValues.type, engineValues.heatStage, engineValues.rotation, engineValues.direction, Math.abs(parseInt(engineValues.position) % 48 - 24));
			this.describe(animData);
			this.refresh();
		});
	},
	
	findRotations: function(){
		var directions = [
			{x: -1, y: 0, z: 0, rotation: ENGINE_ROTATION_X, direction: 1},
			{x: 1, y: 0, z: 0, rotation: ENGINE_ROTATION_X, direction: -1},
			{x: 0, y: -1, z: 0, rotation: ENGINE_ROTATION_Y, direction: -1},
			{x: 0, y: 1, z: 0, rotation: ENGINE_ROTATION_Y, direction: 1},
			{x: 0, y: 0, z: -1, rotation: ENGINE_ROTATION_Z, direction: -1},
			{x: 0, y: 0, z: 1, rotation: ENGINE_ROTATION_Z, direction: 1},
		];
		
		this.rotationDirections = [];
		for (var i in directions){
			var dir = directions[i];
			var tileEntity = World.getTileEntity(this.x + dir.x, this.y + dir.y, this.z + dir.z);
			if (tileEntity){
				dir.tileEntity = tileEntity;
				this.rotationDirections.push(dir);
			}
		}
		
		var dir = this.rotationDirections[this.data.rotationIndex % this.rotationDirections.length];
		if (dir){
			this.targetTileEntity = dir.tileEntity;
			this.data.rotation = dir.rotation;
			this.data.direction = dir.direction;
		}
		else{
			this.targetTileEntity = null;
			this.data.rotation = ENGINE_ROTATION_Y;
			this.data.direction = 1;
		}
	},
	
	getLookCoords: function(){
		var coords = {x: 0, y: 1, z: 0};
		if (this.data.rotation == ENGINE_ROTATION_X){
			var coords = this.data.direction > 0 ? {x: -1, y: 0, z: 0} : {x: 1, y: 0, z: 0};
		}
		if (this.data.rotation == ENGINE_ROTATION_Y){
			var coords = this.data.direction > 0 ? {x: 0, y: 1, z: 0} : {x: 0, y: -1, z: 0};
		}
		if (this.data.rotation == ENGINE_ROTATION_Z){
			var coords = this.data.direction > 0 ? {x: 0, y: 0, z: 1} : {x: 0, y: 0, z: -1};
		}
		return {
			x: this.x + coords.x,
			y: this.y + coords.y,
			z: this.z + coords.z,
		};
	},
	
	updateTargetTileEntity: function(){
		if (this.targetTileEntity && this.targetTileEntity.remove){
			this.targetTileEntity = null;
		}
		if (!this.targetTileEntity){
			var coords = this.getLookCoords();
			this.targetTileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
		}
	},
	
	MJEnergyDeploy: function(amount, generator, params){
		params = params || {};
		if (!params.chain){
			params.chain = 1;
		}
		if (params.chain++ > 15){
			return;
		}
		if (generator != this.targetTileEntity){
			this.updateTargetTileEntity();
			this.deployMJEnergy(amount, params, generator);
			this.data.heat += 3;
		}
	},
	
	deployEnergyToTarget: function(){
		if (this.energyDeploy){
			this.updateTargetTileEntity();
			var params = {
				directDeploy: false,
				deployTarget: null,
				extra: null
			};
			if (this.targetTileEntity){
				params.directDeploy = true;
				params.deployTarget = this.targetTileEntity;
			}
			
			var amount = this.energyDeploy(params);
			this.deployMJEnergy(amount, params.extra);
		}
	},
	
	deployMJEnergy: function(amount, extra, customGenerator){
		if (amount){
			if (this.targetTileEntity){
				if (this.targetTileEntity.MJEnergyDeploy){
					this.targetTileEntity.MJEnergyDeploy(amount, customGenerator || this, extra);
				}
			}
			else{
				
			}
		}
	},
	
	
	
	
	setPower: function(power){
		this.data.targetPower = power;
	},
	
	updatePower: function(){
		var change = .04;
		var add = this.data.targetPower - this.data.power;
		if (add > change){
			add = change;
		}
		if (add < -change){
			add = -change;
		}
		this.data.power += add;
	},

	isPushingForward: function(){
		return this.data.position > 24;
	},
	
	
	
	
	
	
	setEngineType: function(type){
		this.data.type = type;
		this.engineTick = getEngineTypeValue(this.data.type, "engineTick");
		this.energyDeploy = getEngineTypeValue(this.data.type, "energyDeploy");
		this.getEngineGui = getEngineTypeValue(this.data.type, "getGuiScreen");
		this.getItemDrop = getEngineTypeValue(this.data.type, "getItemDrop");
		this.getHeatStage = getEngineTypeValue(this.data.type, "getHeatStage");
		
		var defaultValues = getEngineTypeValue(this.data.type, "defaultValues");
		for (var name in defaultValues){
			this.data[name] = defaultValues[name];
		}
	},
	
	created: function(){
		this.findRotations();
	},
	
	init: function(){
		this.setEngineType(this.data.type);
		this.reloadAnimation();
	},
	
	tick: function(){
		// update basic
		this.data.position += this.data.power;
		this.updatePower();
		// 
		if (this.engineTick){
			this.engineTick();
		}
		if (this.getHeatStage){
			this.data.heatStage = ENGINE_HEAT_ORDER[Math.min(3, Math.max(0, this.getHeatStage() || 0))];
		}
		if (this.data.position > 48){
			this.data.position -= 48;
			this.deployEnergyToTarget();
		}
	},
	
	click: function(id, count, data){
		if (id == ItemID.bcWrench){
			this.data.rotationIndex++;
			this.findRotations();
			return true;
		}
	},
	
	destroy: function(){
		this.destroyAnimation();
	},
	
	redstone: function(signal){
		this.data.redstone = signal.power > 8;
	},
	
	getGuiScreen: function(){
		if (this.getEngineGui){
			return this.getEngineGui();
		}
	},
	
	destroy: function(){
		if (this.getItemDrop){
			var drop = this.getItemDrop();
			for (var i in drop){
				World.drop(this.x + .5, this.y + .5, this.z + .5, drop[i][0] || 0, drop[i][1] || 1, drop[i][2] || 0);
			}
		}
	}
})


ENGINE_TYPE_DATA[ENGINE_TYPE_WOOD] = {
	getGuiScreen: function(){
		return null;
	},
	
	getItemDrop: function(){
		return [[ItemID.engineWooden, 1, 0]];
	},
	
	getHeatStage: function(){
		var MAX_HEAT = 100;
		var index = parseInt(this.data.heat / MAX_HEAT * 3);
		return index;
	},
	
	engineTick: function(){
		var MAX_HEAT = 100;
		if (this.data.redstone){
			this.setPower(this.getHeatStage() + .4);
			if (this.isPushingForward()){
				this.data.heat += .2;
			}
			else{
				this.data.heat -= .1;
			}
		}
		else{
			this.setPower(0);
			this.data.heat -= .1;
		}
		this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
	},
	
	energyDeploy: function(params){
		if (params.directDeploy){
			return 1;
		}
		return 0;
	}
};


var guiStoneEngine = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Stirling Engine"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 445, y: 120, bitmap: "fire_background", scale: 5}
	],
	
	elements: {
		"burningScale": {type: "scale", x: 445, y: 120, direction: 1, value: 0.5, bitmap: "fire_scale", scale: 5},
		"slotFuel": {type: "slot", x: 441, y: 212, size: 80},
		"textInfo1": {type: "text", x: 545, y: 180, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
		"textInfo2": {type: "text", x: 655, y: 180, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
	}
});

ENGINE_TYPE_DATA[ENGINE_TYPE_STONE] = {
	defaultValues: {
		burn: 0,
		maxBurn: 0,
		overheat: 0
	},
	
	getItemDrop: function(){
		return [[ItemID.engineStone, 1, 0]];
	},
	
	getGuiScreen: function(){
		return guiStoneEngine;
	},
	
	energyDeploy: function(){
		return 32;
	},
	
	getHeatStage: function(){
		var MAX_HEAT = 800;
		var index = parseInt(this.data.heat / MAX_HEAT * 3);
		if (this.data.overheat > 0){
			return 3;
		}
		return index;
	},
	
	engineTick: function(){
		var MAX_HEAT = 800;
		var heatRatio = (MAX_HEAT - this.data.heat) / MAX_HEAT + .1;
		
		if (this.data.overheat > 0){
			this.data.overheat--;
			this.data.heat -= .2;
			this.setPower(0);
		}
		
		else if (this.data.redstone && this.data.burn > 0){
			this.setPower(parseInt(this.data.heat / MAX_HEAT * 3) + .4);
			if (this.isPushingForward()){
				this.data.heat += .8 * heatRatio;
			}
			else{
				this.data.heat -= .4 * heatRatio;
			}
			this.data.burn--;
		}
		else{
			this.setPower(0);
			this.data.heat -= .2;
		}
		
		if (this.data.burn <= 0){
			this.data.burn = this.data.maxBurn = getFuelForStoneEngine(this.container, "slotFuel") * 2;
		}
		
		this.container.setScale("burningScale", this.data.burn / this.data.maxBurn || 0);
		this.container.setText("textInfo1", parseInt(this.data.heat) + "°C");
		this.container.setText("textInfo2", (this.data.redstone ? "ON" : "OFF") + (this.data.overheat > 0 ? ": OVERHEATED" : (this.data.burn <= 0 ? ": NO FUEL" : "")));
		
		this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
		if (this.data.heat == MAX_HEAT){
			this.data.overheat = 2400; // 120 secs
		}
	}
};


function getFuelForStoneEngine(container, slotName){
	var fuelSlot = container.getSlot(slotName);
	if (fuelSlot.id > 0){
		var burn = FURNACE_FUEL_MAP[fuelSlot.id];
		if (burn){
			fuelSlot.count--;
			container.validateSlot(slotName);
			return burn;
		}
		if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data) == "lava"){
			var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
			fuelSlot.id = empty.id;
			fuelSlot.data = empty.data;
			return 20000;
		}
	}
	return 0;
}


var guiIronEngine = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Iron Engine"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 550, y: 30, bitmap: "liquid_scale_40x8_background", scale: 4}
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 554, y: 34, direction: 1, value: 0.5, bitmap: "liquid_scale_40x8_empty", overlay: "liquid_scale_40x8_overlay", scale: 4},
		"liquidSlot1": {type: "slot", x: 421, y: 54, size: 80},
		"liquidSlot2": {type: "slot", x: 421, y: 254, size: 80},
		"textInfo1": {type: "text", x: 685, y: 150, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
		"textInfo2": {type: "text", x: 685, y: 200, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
	}
});

var ENGINE_IRON_FUEL_DATA = {
	"lava": 2500,
	"oil": 7500,
	"fuel": 12500,
	"biofuel": 12500
};

ENGINE_TYPE_DATA[ENGINE_TYPE_IRON] = {
	defaultValues: {
		overheat: 0
	},
	
	getGuiScreen: function(){
		return guiIronEngine;
	},
	
	getItemDrop: function(){
		return [[ItemID.engineIron, 1, 0]];
	},
	
	energyDeploy: function(){
		return 128;
	},
	
	getHeatStage: function(){
		var MAX_HEAT = 1200;
		var index = parseInt(this.data.heat / MAX_HEAT * 3);
		if (this.data.overheat > 0){
			return 3;
		}
		return index;
	},
	
	engineTick: function(){
		var MAX_HEAT = 1200;
		var heatRatio = (MAX_HEAT - this.data.heat) / MAX_HEAT + .1;
		
		var liquidStored = this.liquidStorage.getLiquidStored();
		var fuelTicks = ENGINE_IRON_FUEL_DATA[liquidStored];
		
		if (this.data.overheat > 0){
			this.data.overheat--;
			this.data.heat -= .2;
			this.setPower(0);
		}
		else if (this.data.redstone && fuelTicks && this.liquidStorage.getLiquid(liquidStored, 1.0 / fuelTicks, true)){
			this.setPower(parseInt(this.data.heat / MAX_HEAT * 3) + .4);
			if (this.isPushingForward()){
				this.data.heat += 1.21 * heatRatio;
			}
			else{
				this.data.heat -= .4 * heatRatio;
			}
		}
		else{
			this.setPower(0);
			this.data.heat -= .2;
		}
		
		var slot1 = this.container.getSlot("liquidSlot1");
		var slot2 = this.container.getSlot("liquidSlot2");
		var emptyItem = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		this.liquidStorage.setLimit(null, 8);
		
		if (emptyItem && (emptyItem.liquid == liquidStored || !liquidStored)){
			if (this.liquidStorage.addLiquid(emptyItem.liquid, 1, true) < 1){
				if (slot2.id == emptyItem.id && slot2.data == emptyItem.data && slot2.count < Item.getMaxStack(emptyItem.id) || slot2.id == 0){
					slot1.count--;
					slot2.id = emptyItem.id;
					slot2.data = emptyItem.data;
					slot2.count++;
					this.container.validateAll();
				}
			}
		}
		
		this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
		this.container.setText("textInfo1", parseInt(this.data.heat) + "°C");
		this.container.setText("textInfo2", (this.data.redstone ? "ON" : "OFF") + (this.data.overheat > 0 ? ": OVERHEATED" : (!fuelTicks ? ": NO FUEL" : "")));
		
		this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
		if (this.data.heat == MAX_HEAT){
			this.data.overheat = 3600; // 180 secs
		}
	}
};


