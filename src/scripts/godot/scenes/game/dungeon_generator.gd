class_name DungeonGenerator
extends Node

@export_category("Map Dimensions")
@export var map_height: int = 45
@export var map_width: int = 80

var _rng := RandomNumberGenerator.new()


func _ready() -> void:
	_rng.randomize()


func generate_dungeon() -> MapData:
	var dungeon := MapData.new(map_width, map_height)
	
	var room_1 := Rect2i(20, 15, 10, 15)
	var room_2 := Rect2i(35, 15, 10, 15)
	
	_carve_room(dungeon, room_1)
	_carve_room(dungeon, room_2)
	
	_tunnel_between(dungeon, room_1.get_center(), room_2.get_center())
	
	return dungeon


func _carve_room(dungeon: MapData, room: Rect2i) -> void:
	var inner: Rect2i = room.grow(-1)
	for y in range(inner.position.y, inner.end.y + 1):
		for x in range(inner.position.x, inner.end.x + 1):
			_carve_tile(dungeon, x, y)


func _carve_tile(dungeon: MapData, x: int, y: int) -> void:
		var tile_position = Vector2i(x, y)
		var tile: Tile = dungeon.get_tile(tile_position)
		tile.set_tile_type(dungeon.TILE_TYPES.floor)


func _tunnel_between(dungeon: MapData, start: Vector2i, end: Vector2i) -> void:
	if _rng.randf() < 0.5:
		_tunnel_horizontal(dungeon, start.y, start.x, end.x)
		_tunnel_vertical(dungeon, end.x, start.y, end.y)
	else:
		_tunnel_vertical(dungeon, start.x, start.y, end.y)
		_tunnel_horizontal(dungeon, end.y, start.x, end.x)


func _tunnel_horizontal(dungeon: MapData, y: int, x_start: int, x_end: int) -> void:
	var x_min: int = mini(x_start, x_end)
	var x_max: int = maxi(x_start, x_end)
	for x in range(x_min, x_max + 1):
		_carve_tile(dungeon, x, y)


func _tunnel_vertical(dungeon: MapData, x: int, y_start: int, y_end: int) -> void:
	var y_min: int = mini(y_start, y_end)
	var y_max: int = maxi(y_start, y_end)
	for y in range(y_min, y_max + 1):
		_carve_tile(dungeon, x, y)
