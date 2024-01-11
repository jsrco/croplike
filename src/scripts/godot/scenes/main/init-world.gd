extends Node2D

const ARROWX := preload("res://scenes/main/sprites/arrow-x.tscn")
const ARROWY := preload("res://scenes/main/sprites/arrow-y.tscn")
const DWARF := preload("res://scenes/main/sprites/dwarf.tscn")
const FLOOR := preload("res://scenes/main/sprites/floor.tscn")
const PLAYER := preload("res://scenes/main/sprites/player.tscn")
const WALL := preload("res://scenes/main/sprites/wall.tscn")

var new_coordinates := preload("res://scenes/main/utility/coordinates.gd").new()
var new_dungeon_size := preload("res://scenes/main/utility/dungeon-size.gd").new()
var new_group_name := preload("res://scenes/main/utility/group-name.gd").new()

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	init_floor()
	
	init_dwarf()
	init_indicator()
	
	init_player()
	
	init_wall()

func create_sprite(prefab: PackedScene, group: String, x: int, y: int,
		x_offset: int = 0, y_offset: int = 0) -> void:
	var new_sprite := prefab.instantiate() as Sprite2D
	new_sprite.position = new_coordinates.index_to_vector(x, y, x_offset, y_offset)
	new_sprite.add_to_group(group)
	add_child(new_sprite)

func init_dwarf() -> void:
	create_sprite(DWARF, new_group_name.DWARF, 3, 3)
	create_sprite(DWARF, new_group_name.DWARF, 14, 5)
	create_sprite(DWARF, new_group_name.DWARF, 7, 11)

func init_floor() -> void:
	for i in range(new_dungeon_size.MAX_X):
		for j in range(new_dungeon_size.MAX_Y):
			create_sprite(FLOOR, new_group_name.FLOOR, i, j)

func init_indicator() -> void:
	create_sprite(ARROWX, new_group_name.ARROW, 0, 12,
			- new_dungeon_size.ARROW_MARGIN)
	create_sprite(ARROWY, new_group_name.ARROW, 5, 0,
			0, - new_dungeon_size.ARROW_MARGIN)

func init_player() -> void:
	create_sprite(PLAYER, new_group_name.PLAYER, 0, 0)
	
func init_wall() -> void:
	var shift: int = 2
	var min_x: int = new_dungeon_size.CENTER_X - shift
	var max_x: int = new_dungeon_size.CENTER_X + shift + 1
	var min_y: int = new_dungeon_size.CENTER_Y - shift
	var max_y: int = new_dungeon_size.CENTER_Y + shift + 1
	for i in range(min_x, max_x):
		for j in range(min_y, max_y):
			create_sprite(WALL, new_group_name.WALL, i, j)
