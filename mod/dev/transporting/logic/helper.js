function denyTransporting(id, item, fluid){
	if (item){
		ItemTransportingHelper.TransportingDenied[id] = true;
	}
	if (fluid){
		// TODO: fill as liquid pipes will be added
	}
};

var ItemTransportingHelper = {
	PipeTiles: {
		// connection types are registred with render connections
	},
	
	PipeParams: {
		// params like friction are stored here
	},
	
	TransportingDenied: {
		// TODO: add all blocks
	},
	
	BasicItemContainers: {
		54: true,
		61: true,
		62: true
	},
	
	registerItemPipe: function(pipe, type, params){
		this.PipeTiles[pipe] = type;
		if (!params){
			params = {};
		}
		if (!params.friction){
			params.friction = 0;
		}
		this.PipeParams[pipe] = params;
	},
	
	isPipe: function(block){
		return this.PipeTiles[block];
	},
	
	canPipesConnect: function(pipe1, pipe2){
		var type1 = this.PipeTiles[pipe1] || ITEM_PIPE_CONNECTION_ANY;
		var type2 = this.PipeTiles[pipe2] || ITEM_PIPE_CONNECTION_ANY;
		return type1 == type2 || type1 == ITEM_PIPE_CONNECTION_ANY || type2 == ITEM_PIPE_CONNECTION_ANY;
	},
	
	canTransportTo: function(pipe, x, y, z){
		var block = World.getBlock(x, y, z).id;
		if (this.BasicItemContainers[block])
			return true; 
		if (block > 4096 && !this.TransportingDenied[block]){
			return TileEntity.isTileEntityBlock(block) || this.canPipesConnect(block, pipe);
		}
		return false;
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
				if (!this.TransportingDenied[block]){
					possibleDirs.push(dir);
				}
			}
		}
		return possibleDirs;
	},
	
	findBasicDirections: function(pipe, position, direction, checkBackwardDirection){
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
			if (this.canTransportTo(pipe, position.x + dir.x, position.y + dir.y, position.z + dir.z)){
				possibleDirs.push(dir);
			}
		}
		return possibleDirs;
	},
	
	filterDirections: function(listOfDirs, itemDirection){
		var resultDirs = [];
		for (var i in listOfDirs){
			var dir = listOfDirs[i];
			if (!(dir.x == -itemDirection.x && dir.y == -itemDirection.y && dir.z == -itemDirection.z)){
				resultDirs.push(dir);
			}
		}
		return resultDirs;
	},
	
	getPathData: function(transportedItem, item, position, direction){
		position = {
			x: Math.floor(position.x),
			y: Math.floor(position.y),
			z: Math.floor(position.z),
		};
		
		// cache block start
		var cachedData = TransportingCache.getInfo(position.x, position.y, position.z);
		if (!cachedData){
			// get block
			var pipeTile = World.getBlock(position.x, position.y, position.z).id;
			var pipeParams = this.PipeParams[pipeTile];
			var inPipe = this.isPipe(pipeTile);
			// get tile entity
			var container = World.getContainer(position.x, position.y, position.z);
			var tileEntity = container && container.tileEntity;
			// get dirs
			var possibleDirs = this.findBasicDirections(pipeTile, position, direction, false);
			// cache
			cachedData = {
				tileEntity: tileEntity,
				container: container,
				inPipe: inPipe,
				possibleDirs: possibleDirs,
				// params
				friction: pipeParams ? pipeParams.friction : 0
			};
			TransportingCache.registerInfo(position.x, position.y, position.z, cachedData);
		}
		// cache block end
		
		var resultDirs = this.filterDirections(cachedData.possibleDirs, direction);
		var acceleration = 0;
		if (cachedData.tileEntity){
			if (cachedData.tileEntity.getTransportedItemDirs){
				resultDirs = cachedData.tileEntity.getTransportedItemDirs(transportedItem, cachedData.possibleDirs, item, direction, resultDirs);
			}
			if (cachedData.tileEntity.getItemAcceleration){
				acceleration = cachedData.tileEntity.getItemAcceleration(transportedItem, cachedData.possibleDirs, item, direction, resultDirs);
			}
		}
		
		return {
			inPipe: cachedData.inPipe,
			directions: resultDirs,
			container: cachedData.container,
			tileEntity: cachedData.tileEntity,
			// params
			acceleration: acceleration,
			friction: cachedData.friction
		};
	}
}
