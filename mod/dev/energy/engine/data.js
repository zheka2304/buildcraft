var EngineModelPartRegistry = {
	models: {},
	
	Add: function(name, model){
		this.models[name] = model;
	},
	
	Get: function(name){
		return this.models[name];
	}
};

EngineModelPartRegistry.Add("trunkBlue0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlue1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlue2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 0}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkGreen0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkGreen1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkGreen2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 32}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkOrange0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkOrange1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkOrange2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 64}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkRed0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkRed1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkRed2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 96}, {width: 512, height: 512}));


EngineModelPartRegistry.Add("engineWood0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 0}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("engineStone0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 32}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("engineIron0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 64}, {width: 512, height: 512}));


var ENGINE_TYPE_WOOD = "Wood";
var ENGINE_TYPE_STONE = "Stone";
var ENGINE_TYPE_IRON = "Iron";

var ENGINE_HEAT_BLUE = "Blue";
var ENGINE_HEAT_GREEN = "Green";
var ENGINE_HEAT_ORANGE = "Orange";
var ENGINE_HEAT_RED = "Red";

var ENGINE_HEAT_ORDER = [
	ENGINE_HEAT_BLUE,
	ENGINE_HEAT_GREEN,
	ENGINE_HEAT_ORANGE,
	ENGINE_HEAT_RED
];

var ENGINE_ROTATION_Y = 0;
var ENGINE_ROTATION_X = 1;
var ENGINE_ROTATION_Z = 2;

var ENGINE_TYPE_DATA = {};

function getEngineTypeValue(type, method){
	if (ENGINE_TYPE_DATA[type]){
		return ENGINE_TYPE_DATA[type][method];
	}
}
