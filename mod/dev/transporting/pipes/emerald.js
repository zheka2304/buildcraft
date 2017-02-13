
var emeraldPipeUI = new UI.StandartWindow({
	standart: {
		header: {
			text: {text: "Emerald Pipe"}
		},
		background: {
			standart: true,
		},
		inventory: {
			standart: true
		}
	},

	elements: {
		"modeSwitch": {
			type: "button", isTextButton: true, x: 400, y: 200, bitmap: "button_36x12_up", bitmap2: "button_36x12_down", text: "Normal", scale: 6, 
			font: {
				color: android.graphics.Color.WHITE,
				size: 24,
				shadow: 0.75
			},
			textOffset: {
				x: 32,
				y: 45
			},
			clicker: {
				onClick: function(container, tileEntity){
					tileEntity.data.inverseMode = !tileEntity.data.inverseMode;
				}
			}
		}
	}
});


TileEntity.registerPrototype(BlockID.pipeItemEmerald, {
	defaultValues: {
		containerIndex: 0,
		inverseMode: false
	},
	
	getGuiScreen: function(){
		return emeraldPipeUI;
	},
	
	tick: function(){
		this.container.setText("modeSwitch", this.data.inverseMode ? "Inveresed" : "Normal");
	},
	
	MJEnergyDeploy: function(amount, generator, params){
		var containerData = this.findContainer();
		if (containerData && containerData.container){
			var item = this.getItemFrom(containerData.container, amount >= 8 ? amount * 8 : 1);
			if (item){
				var transportedItem = TransportingItem.deploy();
				transportedItem.setPosition(containerData.position.x + .5, containerData.position.y + .5, containerData.position.z + .5);
				transportedItem.setItem(item.id, item.count, item.data);
				transportedItem.setTarget(this.x, this.y, this.z);
			}
			else{
				this.data.containerIndex++;
			}
		}
	},
	
	findContainer: function(){
		var directions = ItemTransportingHelper.findNearbyContainers(this);
		var dir = directions[this.data.containerIndex % directions.length];
		
		if (dir){
			var container = World.getContainer(this.x + dir.x, this.y + dir.y, this.z + dir.z);
			return {
				container: container,
				direction: dir,
				position: {x: this.x + dir.x, y: this.y + dir.y, z: this.z + dir.z}
			};
		}
	},
	
	getItemFrom: function(container, maxCount){
		container.refreshSlots();
		var tileEntity = container.tileEntity;
		var slots = [];
		var slotsInitialized = false;
		if (tileEntity){
			if (tileEntity.getTransportedItem){
				tileEntity.getTransportedItem();
			}
			if (tileEntity.getTransportSlots){
				slots = tileEntity.getTransportSlots().ouput || [];
				slotsInitialized = true;
			}
		}
		if (!slotsInitialized){
			for (var name in container.slots){
				slots.push(name);
			}
		}
		
		var item = null;
		for (var i in slots){
			var slot = container.getSlot(slots[i]);
			if (slot.id > 0){
				var count = Math.min(maxCount, slot.count);
				item = {id: slot.id, count: count, data: slot.data};
				slot.count -= count;
				break;
			}
		}
		container.validateAll();
		container.applyChanges();
		return item;
	}
});