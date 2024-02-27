class_name EntityDefinition
extends Resource

@export_category("Components")
@export var ai_type: Entity.AIType
@export var consumable_definition: ConsumableComponentDefinition
@export var inventory_capacity: int = 0
@export var fighter_definition: FighterComponentDefinition

@export_category("Mechanics")
@export var is_blocking_movement: bool = true
@export var type: Entity.EntityType = Entity.EntityType.ACTOR

@export_category("Visuals")
@export var name: String = "Unnamed Entity"
@export var texture: AtlasTexture
@export_color_no_alpha var color: Color = Color.WHITE
