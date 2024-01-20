class_name Map
extends Node2D

@export var fov_radius: int = 8

var map_data: MapData

@onready var dungeon_generator: DungeonGenerator = $"Dungeon Generator"
@onready var field_of_view: FieldOfView = $"Field Of View"


func generate(player: Entity) -> void:
	map_data = dungeon_generator.generate_dungeon(player)
	_place_tiles()


func update_fov(player_position: Vector2i) -> void:
	field_of_view.update_fov(map_data, player_position, fov_radius)


func _place_tiles() -> void:
	for tile in map_data.tiles:
		add_child(tile)
