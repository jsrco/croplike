class_name Game
extends Node2D

const PLAYER_DEFINITION: EntityDefinition = preload("res://assets/definitions/entities/actors/entity_definition_player.tres")

@onready var entities: Node2D = $Entities
@onready var event_handler: EventHandler = $"Event Handler"
@onready var map: Map = $Map
@onready var player: Entity

func _ready() -> void:
	var player_start_pos: Vector2i = Grid.world_to_grid(get_viewport_rect().size.floor() / 2)
	player = Entity.new(player_start_pos, PLAYER_DEFINITION)
	entities.add_child(player)
	var npc := Entity.new(player_start_pos + Vector2i.RIGHT, PLAYER_DEFINITION)
	npc.modulate = Color.ORANGE_RED
	entities.add_child(npc)


func _physics_process(_delta: float) -> void:
	var action: Action = event_handler.get_action()
	if action:
		action.perform(self, player)


func get_map_data() -> MapData:
	return map.map_data
