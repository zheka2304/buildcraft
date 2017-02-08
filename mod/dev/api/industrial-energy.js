var IndustrialCraftAPI = null;

ModAPI.addAPICallback("ICore", function(ICore){
	IndustrialCraftAPI = ICore;
});

Callback.addCallback("PostLoaded", function(){
	if (IndustrialCraftAPI){
		Callback.invokeCallback("BC-DefineEngines", IndustrialCraftAPI);
		Callback.invokeCallback("BC-ICore", IndustrialCraftAPI);
	}
	else{
		Callback.invokeCallback("BC-DefineEngines", null);
	}
});