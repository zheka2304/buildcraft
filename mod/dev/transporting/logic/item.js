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