var TRANSPORTING_CACHE_DEBUG = false;

var TransportingCache = {
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
	TransportingCache.clear();
});

Callback.addCallback("ItemUse", function(){
	TransportingCache.clear();
});

Callback.addCallback("DestroyBlock", function(){
	TransportingCache.clear();
});


/*
 * Debug output
*/
if (TRANSPORTING_CACHE_DEBUG){
	TransportingCache.registerInfo = function(x, y, z, info){
		this.debug.overrides++;
		var key = x + "." + y + "." + z;
		this.cache[key] = info;
	};
	
	TransportingCache.getInfo = function(x, y, z, info){
		this.debug.calls++;
		var key = x + "." + y + "." + z;
		return this.cache[key];
	};
	
	TransportingCache.debugTick = function(){
		Game.tipMessage(JSON.stringify(this.debug, "\t"));
		this.debug.calls = 0;
		this.debug.overrides = 0;
	};
	
	Callback.addCallback("tick", function(){
		TransportingCache.debugTick();
	});
}