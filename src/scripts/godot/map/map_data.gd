class_name MapData
extends RefCounted

const ENTITY_PATHFINDING_WEIGHT = 10.0
const TILE_TYPES = {
	"floor": preload("res://assets/definitions/tiles/tile_definition_floor.tres"),
	"wall": preload("res://assets/definitions/tiles/tile_definition_wall.tres"),
}

var entities: Array[Entity]
var height: int
var pathfinder: AStarGrid2D
var player: Entity
var tiles: Array[Tile]
var width: int


func _init(map_width: int, map_height: int, player: Entity) -> void:
	width = map_width
	height = map_height
	self.player = player
	entities = []
	_setup_tiles()


func get_actor_at_location(location: Vector2i) -> Entity:
	for actor in get_actors():
		if actor.grid_position == location:
			return actor
	return null


func get_actors() -> Array[Entity]:
	var actors: Array[Entity] = []
	for entity in entities:
		if entity.get_entity_type() == Entity.EntityType.ACTOR and entity.is_alive():
			actors.append(entity)
	return actors


func get_blocking_entity_at_location(grid_position: Vector2i) -> Entity:
	for entity in entities:
		if entity.is_blocking_movement() and entity.grid_position == grid_position:
			return entity
	return null


func get_tile(grid_position: Vector2i) -> Tile:
	var tile_index: int = grid_to_index(grid_position)
	if tile_index == -1:
		return null
	return tiles[tile_index]


func get_tile_xy(x: int, y: int) -> Tile:
	var grid_position := Vector2i(x, y)
	return get_tile(grid_position)


func grid_to_index(grid_position: Vector2i) -> int:
	if not is_in_bounds(grid_position):
		return -1
	return grid_position.y * width + grid_position.x


func is_in_bounds(coordinate: Vector2i) -> bool:
	return (
		0 <= coordinate.x
		and coordinate.x < width
		and 0 <= coordinate.y
		and coordinate.y < height
	)


func register_blocking_entity(entity: Entity) -> void:
	pathfinder.set_point_weight_scale(entity.grid_position, ENTITY_PATHFINDING_WEIGHT)


func setup_pathfinding() -> void:
	pathfinder = AStarGrid2D.new()
	pathfinder.region = Rect2i(0, 0, width, height)
	pathfinder.update()
	for y in height:
		for x in width:
			var grid_position := Vector2i(x, y)
			var tile: Tile = get_tile(grid_position)
			pathfinder.set_point_solid(grid_position, not tile.is_walkable())
	for entity in entities:
		if entity.is_blocking_movement():
			register_blocking_entity(entity)


func unregister_blocking_entity(entity: Entity) -> void:
	pathfinder.set_point_weight_scale(entity.grid_position, 0)


func _setup_tiles() -> void:
	tiles = []
	for y in height:
		for x in width:
			var tile_position := Vector2i(x, y)
			var tile := Tile.new(tile_position, TILE_TYPES.wall)
			tiles.append(tile)
