class_name FighterComponentDefinition
extends Resource

@export_category("Stats")
@export var defense: int
@export var max_hp: int
@export var power: int

@export_category("Visuals")
@export var death_texture: AtlasTexture = preload("res://assets/resources/default_death_texture.tres")
@export var death_color: Color = Color("991b1b")
