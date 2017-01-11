var EngineModelHelper = {
	init: function(){
		
	},
	
	createPiston: function(type, heat, rotation, direction, position){
		var pistonMaterial = EngineModelPartRegistry.Get("engine" + type + rotation);
		var trunkMaterial = EngineModelPartRegistry.Get("trunk" + heat + rotation);
		
		var coords = {
			x: 0,
			y: 0, 
			z: 0
		};
		
		switch (rotation){
			case ENGINE_ROTATION_X:
			coords.x = direction;
			break;
			case ENGINE_ROTATION_Y:
			coords.y = direction;
			break;
			case ENGINE_ROTATION_Z:
			coords.z = direction;
			break;
		};
		
		var renderName = [type, heat, rotation, direction, position] + "";
		var render = new Render({name: renderName});
		if (render.isEmpty){
			var modelData = [{
				type: "box",
				uv: pistonMaterial.getUV(),
				coords: {
					x: 0 + coords.x * 6,
					y: 24 + coords.y * 6,
					z: 0 + coords.z * 6,
				},
				size: {
					x: 4 + 12 * (1 - Math.abs(coords.x)),
					y: 4 + 12 * (1 - Math.abs(coords.y)),
					z: 4 + 12 * (1 - Math.abs(coords.z))
				}
			},
			{
				type: "box",
				uv: pistonMaterial.getUV(),
				coords: {
					x: 0 + coords.x * (2 - position / 3),
					y: 24 + coords.y * (2 - position / 3),
					z: 0 + coords.z * (2 - position / 3),
				},
				size: {
					x: 4 + 12 * (1 - Math.abs(coords.x)),
					y: 4 + 12 * (1 - Math.abs(coords.y)),
					z: 4 + 12 * (1 - Math.abs(coords.z))
				}
			}];
			
			if (pistonMaterial.textureMatches(trunkMaterial)){
				modelData.push({
					type: "box",
					uv: trunkMaterial.getUV(),
					coords: {
						x: 0 - coords.x * .1,
						y: 24 - coords.y * .1,
						z: 0 - coords.z * .1
					},
					size: {
						x: 8 + 8 * (Math.abs(coords.x)),
						y: 8 + 8 * (Math.abs(coords.y)),
						z: 8 + 8 * (Math.abs(coords.z))
					}
				});
			}
			render.setPart("body", modelData, pistonMaterial.getSize());
			render.saveState(renderName);
		}
		
		return {
			skin: pistonMaterial.getTexture(),
			renderAPI: render,
			firmRotation: true,
			hitbox: {
				width: .2,
				height: .4
			}
		};
	}
}

