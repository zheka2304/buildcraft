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