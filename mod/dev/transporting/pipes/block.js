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
	model.addBoxF(0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH);
	
	ICRenderLib.addConnectionBlock(ITEM_PIPE_RENDER_CONNECTION_ANY, id);
	ICRenderLib.addConnectionBlock(connectionType, id);
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
	{name: "Stone Transporting Pipe", texture: [["pipe_item_stone", 0]], inCreative: true}
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
	model.addBoxF(0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH);
	
	ICRenderLib.addConnectionBlock(FLUID_PIPE_RENDER_CONNECTION_ANY, id);
	ICRenderLib.addConnectionBlock(connectionType, id);
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

setupFluidPipeRender(BlockID.pipeFluidWooden, FLUID_PIPE_RENDER_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidCobble, FLUID_PIPE_RENDER_CONNECTION_COBBLE);
setupFluidPipeRender(BlockID.pipeFluidStone, FLUID_PIPE_RENDER_CONNECTION_STONE);
setupFluidPipeRender(BlockID.pipeFluidIron, FLUID_PIPE_RENDER_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidGolden, FLUID_PIPE_RENDER_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidEmerald, FLUID_PIPE_RENDER_CONNECTION_ANY);
