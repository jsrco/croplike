extends Node2D

const Player := preload("res://scenes/main/sprites/player.tscn")
const ArrowX := preload("res://scenes/main/sprites/arrowX.tscn")
const ArrowY := preload("res://scenes/main/sprites/arrowY.tscn")
const Dwarf := preload("res://scenes/main/sprites/dwarf.tscn")
const Floor := preload("res://scenes/main/sprites/floor.tscn")
const Wall := preload("res://scenes/main/sprites/wall.tscn")

var new_Coordinates := preload("res://scenes/main/utility/coordinates.gd").new()
var new_DungeonSize := preload("res://scenes/main/utility/dungeonSize.gd").new()
var new_GroupName := preload("res://scenes/main/utility/groupName.gd").new()

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	init_dwarf()
	init_floor()
	init_indicator()
	init_player()
	init_wall()

func create_sprite(prefab: PackedScene, group: String, x: int, y: int,
		x_offset: int = 0, y_offset: int = 0) -> void:
	var new_sprite := prefab.instantiate() as Sprite2D
	new_sprite.position = new_Coordinates.index_to_vector(x, y, x_offset, y_offset)
	new_sprite.add_to_group(group)
	add_child(new_sprite)

func init_dwarf() -> void:
	create_sprite(Dwarf, new_GroupName.DWARF, 3, 3)
	create_sprite(Dwarf, new_GroupName.DWARF, 14, 5)
	create_sprite(Dwarf, new_GroupName.DWARF, 7, 11)

func init_floor() -> void:
	for i in range(new_DungeonSize.MAX_X):
		for j in range(new_DungeonSize.MAX_Y):
			create_sprite(Floor, new_GroupName.FLOOR, i, j)

func init_indicator() -> void:
	create_sprite(ArrowX, new_GroupName.ARROW, 0, 12,
			- new_DungeonSize.ARROW_MARGIN)
	create_sprite(ArrowY, new_GroupName.ARROW, 5, 0,
			0, - new_DungeonSize.ARROW_MARGIN)

func init_player() -> void:
	create_sprite(Player, new_GroupName.PLAYER, 0, 0)
	
func init_wall() -> void:
	var shift: int = 2
	var min_x: int = new_DungeonSize.CENTER_X - shift
	var max_x: int = new_DungeonSize.CENTER_X + shift + 1
	var min_y: int = new_DungeonSize.CENTER_Y - shift
	var max_y: int = new_DungeonSize.CENTER_Y + shift + 1
	for i in range(min_x, max_x):
		for j in range(min_y, max_y):
			create_sprite(Wall, new_GroupName.WALL, i, j)
