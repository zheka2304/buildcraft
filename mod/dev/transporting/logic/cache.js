var TRANSPORTING_CACHE_DEBUG = false;

var ItemTransportingCache = {
	cache: [],
	
	debug: {
		calls: 0,
		overrides: 0,
	},
	
	clear: function(){
		this.cache = [];
	},
	
	registerInfo: function(x, y, z, info){
		var key = x + "." + y + "." + z;
		this.cache[key] = info;
	},
	
	getInfo: function(x, y, z, info){
		var key = x + "." + y + "." + z;
		return this.cache[key];
	},
}


Callback.addCallback("LevelLoaded", function(){
	ItemTransportingCache.clear();
});

Callback.addCallback("ItemUse", function(){
	ItemTransportingCache.clear();
});

Callback.addCallback("DestroyBlock", function(){
	ItemTransportingCache.clear();
});


/*
 * Debug output
*/
if (TRANSPORTING_CACHE_DEBUG){
	ItemTransportingCache.registerInfo = function(x, y, z, info){
		this.debug.overrides++;
		var key = x + "." + y + "." + z;
		this.cache[key] = info;
	};
	
	ItemTransportingCache.getInfo = function(x, y, z, info){
		this.debug.calls++;
		var key = x + "." + y + "." + z;
		return this.cache[key];
	};
	
	ItemTransportingCache.debugTick = function(){
		Game.tipMessage(JSON.stringify(this.debug, "\t"));
		this.debug.calls = 0;
		this.debug.overrides = 0;
	};
	
	Callback.addCallback("tick", function(){
		ItemTransportingCache.debugTick();
	});
}