class_name EventHandler
extends Node


func get_action() -> Action:
	var action: Action = null
	
	if Input.is_action_just_pressed("move_up"):
		action = BumpAction.new(0, -1)
	elif Input.is_action_just_pressed("move_down"):
		action = BumpAction.new(0, 1)
	elif Input.is_action_just_pressed("move_left"):
		action = BumpAction.new(-1, 0)
	elif Input.is_action_just_pressed("move_right"):
		action = BumpAction.new(1, 0)
	elif Input.is_action_just_pressed("move_down_left"):
		action = BumpAction.new(-1, 1)
	elif Input.is_action_just_pressed("move_down_right"):
		action = BumpAction.new(1, 1)
	elif Input.is_action_just_pressed("move_up_left"):
		action = BumpAction.new(-1, -1)
	elif Input.is_action_just_pressed("move_up_right"):
		action = BumpAction.new(1, -1)
	
	if Input.is_action_just_pressed("ui_cancel"):
		action = EscapeAction.new()
	
	return action
