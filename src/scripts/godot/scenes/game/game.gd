class_name Game
extends Node2D

const PLAYER_DEFINITION: EntityDefinition = preload("res://assets/definitions/entities/actors/entity_definition_player.tres")

@onready var camera: Camera2D = $PlayerCamera
@onready var input_handler: InputHandler = $InputHandler
@onready var map: Map = $Map
@onready var player: Entity


func _ready() -> void:
	player = Entity.new(null, Vector2i.ZERO, PLAYER_DEFINITION)
	remove_child(camera)
	player.add_child(camera)
	map.generate(player)
	map.update_fov(player.grid_position)


func _physics_process(_delta: float) -> void:
	var action: Action = input_handler.get_action(player)
	if action:
		var previous_player_position: Vector2i = player.grid_position
		action.perform()
		_handle_enemy_turns()
		map.update_fov(player.grid_position)


func get_map_data() -> MapData:
	return map.map_data


func _handle_enemy_turns() -> void:
	for entity in get_map_data().entities:
		if entity.is_alive() and entity != player:
			entity.ai_component.perform()
