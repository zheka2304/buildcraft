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
