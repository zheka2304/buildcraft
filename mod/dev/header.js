// fast tile access
var nativeGetTile = ModAPI.requireGlobal("getTile_origin");

// constants
var FURNACE_FUEL_MAP = {
	5: 300,
	6: 100,
	17: 300,
	263: 1600,
	280: 100,
	268: 200,
	269: 200,
	270: 200,
	271: 200,
	85: 300,
	107: 300,
	134: 300,
	135: 300,
	158: 150,
	162: 300,
	163: 300,
	164: 300,
	184: 300,
	185: 300,
	186: 300,
	187: 300,
	53: 300,
	54: 300,
	58: 300
};

// gui fonts
var STD_FONT_MEDIUM = {color: android.graphics.Color.WHITE, size: 28, shadow: 0.5};
var RED_FONT_MEDIUM = {color: android.graphics.Color.RED, size: 28, shadow: 0.5};


