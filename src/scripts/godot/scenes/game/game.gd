extends Node2D

var wall_scene = preload("res://scenes/game/wall.tscn")


# Called when the node enters the scene tree for the first time.
func _ready():
	create_wall()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if Input.is_action_pressed("close_game"):
		get_tree().quit()


func create_wall():
	var cell_size : int = 15
	var entities = $Entities
	var viewport_size = get_viewport_rect().size
	# Specify the positions for the top and bottom edges
	for x in range(0, 600, cell_size):
		entities.add_child(create_wall_at(Vector2(x, 0)))
		entities.add_child(create_wall_at(Vector2(x, 600 - cell_size)))
	# Specify the positions for the left and right edges
	for y in range(cell_size, 600 - cell_size, cell_size):
		entities.add_child(create_wall_at(Vector2(0, y)))
		entities.add_child(create_wall_at(Vector2(600 - cell_size, y)))


func create_wall_at(position: Vector2) -> Node2D:
	var wall_copy = wall_scene.instantiate()
	wall_copy.position = position
	return wall_copy
