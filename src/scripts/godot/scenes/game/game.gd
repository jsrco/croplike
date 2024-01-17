extends Node2D

@onready var event_handler: EventHandler = $"Event Handler"
var player_grid_pos := Vector2i.ZERO
@onready var player: Sprite2D = $Player

func _process(delta: float) -> void:
	var action: Action = event_handler.get_action()
	if action is MovementAction:
		player_grid_pos += action.offset
		player.position = Grid.grid_to_world(player_grid_pos)
	elif action is EscapeAction:
		get_tree().quit()

