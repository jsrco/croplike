class_name BaseAIComponent
extends Component


func get_point_path_to(destination: Vector2i) -> PackedVector2Array:
	return get_map_data().pathfinder.get_point_path(entity.grid_position, destination)


func perform() -> void:
	pass
