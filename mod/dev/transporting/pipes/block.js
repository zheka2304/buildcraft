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

var ITEM_PIPE_CONNECTION_MACHINE = "bc-container";

var ITEM_PIPE_CONNECTION_ANY = "bc-item-pipe-any";
var ITEM_PIPE_CONNECTION_STONE = "bc-item-pipe-stone";
var ITEM_PIPE_CONNECTION_COBBLE = "bc-item-pipe-cobble";
var ITEM_PIPE_CONNECTION_SANDSTONE = "bc-item-pipe-sandstone";

function registerItemPipe(id, connectionType, params){
	/* drop func */
	Block.registerDropFunctionForID(id, function(){
		return [[id, 1, 0]];
	});

	/* render */
	var model = new TileRenderModel(id, 0);
	model.addConnectionGroup(connectionType);
	model.addConnectionGroup(ITEM_PIPE_CONNECTION_MACHINE);
	model.setConnectionWidth(PIPE_BLOCK_WIDTH * 2);
	model.addBoxF(0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH);
	
	ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_ANY, id);
	ICRenderLib.addConnectionBlock(connectionType, id);
	if (connectionType == ITEM_PIPE_CONNECTION_ANY){
		ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_STONE, id);
		ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_COBBLE, id);
		ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_SANDSTONE, id);
	}
	
	/* params */
	ItemTransportingHelper.registerItemPipe(id, connectionType, params);
	
	return model;
}

ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_MACHINE, 54);
ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_MACHINE, 61);
ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_MACHINE, 62);


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
	{name: "Stone Transporting Pipe", texture: [["pipe_item_stone", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemSandstone");
Block.createBlock("pipeItemSandstone", [
	{name: "Sandstone Transporting Pipe", texture: [["pipe_item_sandstone", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

IDRegistry.genBlockID("pipeItemIron");
Block.createBlock("pipeItemIron", [
	{name: "Iron Transporting Pipe", texture: [["pipe_item_iron", 1]], inCreative: true},
	{name: "Iron Transporting Pipe", texture: [["pipe_item_iron", 1]], inCreative: false},
	{name: "Iron Transporting Pipe", texture: [["pipe_item_iron", 1]], inCreative: false},
	{name: "Iron Transporting Pipe", texture: [["pipe_item_iron", 1]], inCreative: false},
	{name: "Iron Transporting Pipe", texture: [["pipe_item_iron", 1]], inCreative: false},
	{name: "Iron Transporting Pipe", texture: [["pipe_item_iron", 1]], inCreative: false},
], BLOCK_TYPE_ITEM_PIPE);
IDRegistry.genBlockID("pipeItemIronRender");
Block.createBlock("pipeItemIronRender", [
	{name: "tile.ironPipeRender.name", texture: [["pipe_item_iron", 0]], inCreative: false}
]);

IDRegistry.genBlockID("pipeItemGolden");
Block.createBlock("pipeItemGolden", [
	{name: "Golden Transporting Pipe", texture: [["pipe_item_gold", 0]], inCreative: true},
	{name: "Golden Transporting Pipe", texture: [["pipe_item_gold", 1]], inCreative: false},
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

IDRegistry.genBlockID("pipeItemDiamondRender");
Block.createBlock("pipeItemDiamondRender", [
	{name: "tile.diamondPipeRender.name", texture: [["pipe_item_diamond", 1]], inCreative: false},
	{name: "tile.diamondPipeRender.name", texture: [["pipe_item_diamond", 2]], inCreative: false},
	{name: "tile.diamondPipeRender.name", texture: [["pipe_item_diamond", 3]], inCreative: false},
	{name: "tile.diamondPipeRender.name", texture: [["pipe_item_diamond", 4]], inCreative: false},
	{name: "tile.diamondPipeRender.name", texture: [["pipe_item_diamond", 5]], inCreative: false},
	{name: "tile.diamondPipeRender.name", texture: [["pipe_item_diamond", 6]], inCreative: false}
]);

Block.setBlockShape(BlockID.pipeItemWooden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemCobble, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemStone, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemSandstone, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemIron, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemGolden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemObsidian, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemEmerald, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeItemDiamond, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});

// register item pipes
registerItemPipe(BlockID.pipeItemObsidian, ITEM_PIPE_CONNECTION_ANY);
registerItemPipe(BlockID.pipeItemEmerald, ITEM_PIPE_CONNECTION_ANY);
registerItemPipe(BlockID.pipeItemDiamond, ITEM_PIPE_CONNECTION_ANY);
registerItemPipe(BlockID.pipeItemGolden, ITEM_PIPE_CONNECTION_ANY).cloneForId(BlockID.pipeItemGolden, 1);
registerItemPipe(BlockID.pipeItemIron, ITEM_PIPE_CONNECTION_ANY);
registerItemPipe(BlockID.pipeItemWooden, ITEM_PIPE_CONNECTION_ANY);
registerItemPipe(BlockID.pipeItemCobble, ITEM_PIPE_CONNECTION_COBBLE, {
	friction: .005
});
registerItemPipe(BlockID.pipeItemStone, ITEM_PIPE_CONNECTION_STONE, {
	friction: .0015
});
registerItemPipe(BlockID.pipeItemSandstone, ITEM_PIPE_CONNECTION_SANDSTONE, {
	friction: .0025
});



// fluid pipe render setup

var FLUID_PIPE_CONNECTION_MACHINE = "bc-fluid";

var FLUID_PIPE_CONNECTION_ANY = "bc-fluid-pipe-any";
var FLUID_PIPE_CONNECTION_STONE = "bc-fluid-pipe-stone";
var FLUID_PIPE_CONNECTION_COBBLE = "bc-fluid-pipe-cobble";
var FLUID_PIPE_CONNECTION_SANDSTONE = "bc-fluid-pipe-sandstone";

function setupFluidPipeRender(id, connectionType){
	/* drop func */
	Block.registerDropFunctionForID(id, function(){
		return [[id, 1, 0]];
	});

	/* render */
	var model = new TileRenderModel(id, 0);
	model.addConnectionGroup(connectionType);
	model.addConnectionGroup(FLUID_PIPE_CONNECTION_MACHINE);
	model.setConnectionWidth(PIPE_BLOCK_WIDTH * 2);
	model.addBoxF(0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH);
	
	ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_ANY, id);
	ICRenderLib.addConnectionBlock(connectionType, id);
	if (connectionType == FLUID_PIPE_CONNECTION_ANY){
		ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_STONE, id);
		ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_COBBLE, id);
		ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_SANDSTONE, id);
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
	{name: "Stone Fluid Pipe", texture: [["pipe_fluid_stone", 0]], inCreative: true}
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

setupFluidPipeRender(BlockID.pipeFluidWooden, FLUID_PIPE_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidCobble, FLUID_PIPE_CONNECTION_COBBLE);
setupFluidPipeRender(BlockID.pipeFluidStone, FLUID_PIPE_CONNECTION_STONE);
setupFluidPipeRender(BlockID.pipeFluidIron, FLUID_PIPE_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidGolden, FLUID_PIPE_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidEmerald, FLUID_PIPE_CONNECTION_ANY);
