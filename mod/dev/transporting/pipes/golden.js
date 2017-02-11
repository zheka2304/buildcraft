TileEntity.registerPrototype(BlockID.pipeItemGolden, {
	defaultValues: {
		redstone: false,
	},

	redstone: function(signal){
		this.data.redstone = signal.power > 8;
		World.setBlock(this.x, this.y, this.z, World.getBlock(this.x, this.y, this.z).id, this.data.redstone ? 1 : 0);
	},
	
	getItemAcceleration: function(){
		return this.data.redstone ? 0.0025 : 0.02;
	}
});