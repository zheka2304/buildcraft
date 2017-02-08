
IDRegistry.genBlockID("bcEngine");
Block.createBlock("bcEngine", [
	{name: "bcEngine", texture: [["empty", 0]], inCreative: false}
], BLOCK_TYPE_ITEM_PIPE);

Block.registerDropFunction("bcEngine", function(){
	return [];
});

Block.setBlockShape(BlockID.bcEngine, {x: 1 / 16, y: 1 / 16, z: 1 / 16}, {x: 15 / 16, y: 15 / 16, z: 15 / 16});

TransportingHelper.denyTransporting(BlockID.bcEngine, true, true);



var BUILDCRAFT_ENGINE_PROTOTYPE = {
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
			this.animationPiston = null;
		}
	},
	
	reloadAnimation: function(){
		this.destroyAnimation();
		
		var engineValues = this.data;
		this.animationPiston = new Animation.Base(this.x + .5, this.y + 15 / 16, this.z + .5);
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
		var typeData = getEngineType(this.data.type);
		
		if (typeData){
			for (var name in typeData){
				this[name] = typeData[name];
			}
			
			for (var name in typeData.defaultValues){
				this.data[name] = typeData.defaultValues[name];
			}
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
	
	redstone: function(signal){
		this.data.redstone = signal.power > 8;
	},
	
	getGuiScreen: function(){
		if (this.getEngineGui){
			return this.getEngineGui();
		}
	},
	
	destroy: function(){
		this.destroyAnimation();
		if (this.getItemDrop){
			var drop = this.getItemDrop();
			for (var i in drop){
				World.drop(this.x + .5, this.y + .5, this.z + .5, drop[i][0] || 0, drop[i][1] || 1, drop[i][2] || 0);
			}
		}
	}
};

Callback.addCallback("BC-DefineEngines", function(ICore){
	if (ICore){
		ICore.Machine.registerPrototype(BlockID.bcEngine, BUILDCRAFT_ENGINE_PROTOTYPE);
	}
	else{
		TileEntity.registerPrototype(BlockID.bcEngine, BUILDCRAFT_ENGINE_PROTOTYPE);
	}
});