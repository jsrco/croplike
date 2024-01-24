class_name EntityDefinition
extends Resource

@export_category("Mechanics")
@export var is_blocking_movement: bool = true

@export_category("Visuals")
@export var name: String = "Unnamed Entity"
@export var texture: AtlasTexture
@export_color_no_alpha var color: Color = Color.WHITE
