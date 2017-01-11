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