var UPDATABLE_TRANSPORTED_ITEM = "TRANSPORTED_ITEM";
var TRANSPORTED_ITEM_SAVER = {
	save: function(){
		return {
			position: this.pos,
			item: this.item,
			target: this.target,
			direction: this.direction,
			inPipeFlag: this.inPipeFlag
		};
	},
	
	read: function(data){
		if (!data || !data.item){
			return true;
		}
		var item = new TransportingItem();
		if (data.position){
			item.pos = data.position;
		}
		if (data.item){
			item.item = data.item;
		}
		if (data.target){
			item.target = data.target;
		}
		if (data.direction){
			item.direction = data.direction;
		}
		item.inPipeFlag = data.inPipeFlag;
		item.load();
		return true;
	}
};

UpdatableSaver.registerPrototype(UPDATABLE_TRANSPORTED_ITEM, TRANSPORTED_ITEM_SAVER);

function registerTransportedItem(updatable){
	UpdatableSaver.attachSaverPrototype(updatable, UPDATABLE_TRANSPORTED_ITEM);
}




var UPDATABLE_TRANSPORTED_FLUID = "TRANSPORTED_FLUID";

