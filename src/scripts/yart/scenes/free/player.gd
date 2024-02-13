extends Area2D

var cell_size : int = 10
var target_position : Vector2 = Vector2.ZERO
var is_moving : bool = false
var screen_size : Vector2  # Set your screen size here

func _process(delta):
	if not is_moving:
		var new_target_position = target_position  # Store the new target position

		if Input.is_action_pressed("move_right"):
			new_target_position.x += cell_size
		elif Input.is_action_pressed("move_left"):
			new_target_position.x -= cell_size
		if Input.is_action_pressed("move_down"):
			new_target_position.y += cell_size
		elif Input.is_action_pressed("move_up"):
			new_target_position.y -= cell_size
		if Input.is_action_pressed("move_downLeft"):
			new_target_position.y += cell_size
			new_target_position.x -= cell_size
		elif Input.is_action_pressed("move_downRight"):
			new_target_position.y += cell_size
			new_target_position.x += cell_size
		if Input.is_action_pressed("move_upLeft"):
			new_target_position.y -= cell_size
			new_target_position.x -= cell_size
		elif Input.is_action_pressed("move_upRight"):
			new_target_position.y -= cell_size
			new_target_position.x += cell_size

		# Check if the new target position is within screen boundaries
		if new_target_position.x >= 0 and new_target_position.x < screen_size.x and new_target_position.y >= 0 and new_target_position.y < screen_size.y:
			target_position = new_target_position
			is_moving = true

	# Check if the character is moving
	if is_moving:
		# Move towards the target position by 1 unit in each frame
		position.x += sign(target_position.x - position.x)
		position.y += sign(target_position.y - position.y)

		# Check if the character has reached the target position
		if position == target_position:
			is_moving = false

# Called when the node enters the scene tree for the first time.
func _ready():
	var viewport_size = get_viewport_rect().size
	screen_size.x = viewport_size.x - fmod(viewport_size.x, cell_size)
	screen_size.y = viewport_size.y - fmod(viewport_size.y, cell_size)

# Helper function to get the sign of a number
func sign(x):
	if x > 0:
		return 1
	elif x < 0:
		return -1
	else:
		return 0
