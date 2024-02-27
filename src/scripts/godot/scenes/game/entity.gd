extends Sprite2D

var cell_size : int = 15
var target_position : Vector2 = Vector2(self.position.x, self.position.y)
var is_moving : bool = false
var movement_amount :  int = 1
var screen_size : Vector2 


func _ready():
	var viewport_size = get_viewport_rect().size
	screen_size.x = viewport_size.x - fmod(viewport_size.x, cell_size)
	screen_size.y = viewport_size.y - fmod(viewport_size.y, cell_size)


func _process(delta):
	if not is_moving:
		move()
	# Check if the character is moving
	if is_moving:
		adjustPosition()


func adjustPosition():
	# Move towards the target position by 1 unit in each frame
	position.x += movement_amount * sign(target_position.x - position.x)
	position.y += movement_amount * sign(target_position.y - position.y)
	# Check if the character has reached the target position
	if position == target_position:
		is_moving = false


func checkCollision(new_target_position: Vector2) -> bool:
	var is_it_ok = true
	var entities = $"../Entities"
	var targetRect = Rect2(new_target_position.x, new_target_position.y, cell_size, cell_size)
	for i in range(entities.get_child_count()):
		var entity_position = entities.get_child(i).position
		var entityRect = Rect2(entity_position.x, entity_position.y, cell_size, cell_size)
		is_it_ok = !entityRect.intersects(targetRect)
		if !is_it_ok:
			return is_it_ok
	return is_it_ok


func move():
	var new_target_position = target_position  # Store the new target position
	if Input.is_action_pressed("move_right") && checkCollision(Vector2(target_position.x + cell_size, target_position.y)):
		new_target_position.x += cell_size
	elif Input.is_action_pressed("move_left")&& checkCollision(Vector2(target_position.x - cell_size, target_position.y)):
		new_target_position.x -= cell_size
	if Input.is_action_pressed("move_down") && checkCollision(Vector2(target_position.x, target_position.y + cell_size)):
		new_target_position.y += cell_size
	elif Input.is_action_pressed("move_up") && checkCollision(Vector2(target_position.x, target_position.y - cell_size)):
		new_target_position.y -= cell_size
	if Input.is_action_pressed("move_downLeft") && checkCollision(Vector2(target_position.x - cell_size, target_position.y + cell_size)):
		new_target_position.x -= cell_size
		new_target_position.y += cell_size
	elif Input.is_action_pressed("move_downRight") && checkCollision(Vector2(target_position.x + cell_size, target_position.y + cell_size)):
		new_target_position.x += cell_size
		new_target_position.y += cell_size
	if Input.is_action_pressed("move_upLeft") && checkCollision(Vector2(target_position.x - cell_size, target_position.y - cell_size)):
		new_target_position.x -= cell_size
		new_target_position.y -= cell_size
	elif Input.is_action_pressed("move_upRight") && checkCollision(Vector2(target_position.x + cell_size, target_position.y - cell_size)):
		new_target_position.x += cell_size
		new_target_position.y -= cell_size
	# Check if the new target position is within screen boundaries
	if new_target_position.x >= 0 and new_target_position.x < screen_size.x and new_target_position.y >= 0 and new_target_position.y < screen_size.y:
		target_position = new_target_position
		is_moving = true


# Helper function to get the sign of a number
func sign(x):
	if x > 0:
		return 1
	elif x < 0:
		return -1
	else:
		return 0
