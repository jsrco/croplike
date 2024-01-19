class_name Game
extends Node2D

const PLAYER_DEFINITION: EntityDefinition = preload("res://assets/definitions/entities/actors/entity_definition_player.tres")

@onready var entities: Node2D = $Entities
@onready var event_handler: EventHandler = $"Event Handler"
@onready var map: Map = $Map
@onready var player: Entity

func _ready() -> void:
	player = Entity.new(Vector2i.ZERO, PLAYER_DEFINITION)
	var camera: Camera2D = $"Player Camera"
	remove_child(camera)
	player.add_child(camera)
	entities.add_child(player)
	map.generate(player)


func _physics_process(_delta: float) -> void:
	var action: Action = event_handler.get_action()
	if action:
		action.perform(self, player)


func get_map_data() -> MapData:
	return map.map_data
