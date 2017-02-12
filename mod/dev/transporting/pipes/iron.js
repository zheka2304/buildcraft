// const
var IRON_PIPE_DIRECTIONS = [
	{x: 0, y: -1, z: 0},
	{x: 0, y: 1, z: 0},
	{x: 0, y: 0, z: -1},
	{x: 0, y: 0, z: 1},
	{x: -1, y: 0, z: 0},
	{x: 1, y: 0, z: 0},
];

// init renderer
Callback.addCallback("PreLoaded", function(){
	var swapToMax = function(array, index1, index2){
		if (array[index1] > array[index2]){
			var temp = array[index2];
			array[index2] = array[index1];
			array[index1] = temp;
		}
	}
	
	for (var data in IRON_PIPE_DIRECTIONS){
		var ironPipeRender = new TileRenderModel(BlockID.pipeItemIron, data);
		var dir = IRON_PIPE_DIRECTIONS[data];
		ironPipeRender.addConnectionGroup(ITEM_PIPE_CONNECTION_ANY);
		ironPipeRender.addConnectionGroup(ITEM_PIPE_CONNECTION_MACHINE);
		ironPipeRender.setConnectionWidth(PIPE_BLOCK_WIDTH * 2);
		
		var box = [
			dir.x == 0 ? PIPE_BLOCK_WIDTH / 2 : dir.x * 0.5 + 0.5,
			dir.x == 0 ? PIPE_BLOCK_WIDTH / 2 : 0.5 + PIPE_BLOCK_WIDTH / 2 * dir.x,
			dir.y == 0 ? PIPE_BLOCK_WIDTH / 2 : dir.y * 0.5 + 0.5,
			dir.y == 0 ? PIPE_BLOCK_WIDTH / 2 : 0.5 + PIPE_BLOCK_WIDTH / 2 * dir.y,
			dir.z == 0 ? PIPE_BLOCK_WIDTH / 2 : dir.z * 0.5 + 0.5,
			dir.z == 0 ? PIPE_BLOCK_WIDTH / 2 : 0.5 + PIPE_BLOCK_WIDTH / 2 * dir.z,
		];
		swapToMax(box, 0, 1);
		swapToMax(box, 2, 3);
		swapToMax(box, 4, 5);
		
		ironPipeRender.addBoxF(box[0], box[1], box[2], box[3], box[4], box[5], {id: BlockID.pipeItemIronRender, data: 0});
	}
});

TileEntity.registerPrototype(BlockID.pipeItemIron, {
	defaultValues: {
		direction: 0
	},

	setDirection: function(dir){
		this.data.direction = dir % 6 || 0;
		World.setBlock(this.x, this.y, this.z, World.getBlock(this.x, this.y, this.z).id, this.data.direction);
	},
	
	created: function(){
		this.setDirection(1);
	},
	
	click: function(id, count, data){
		if (id == ItemID.bcWrench){
			this.setDirection(this.data.direction + 1);
		}
	},
	
	getTransportedItemDirs: function(){
		return [
			IRON_PIPE_DIRECTIONS[this.data.direction]
		];
	}
});

