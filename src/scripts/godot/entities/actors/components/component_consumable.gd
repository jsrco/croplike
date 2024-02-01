class_name ConsumableComponent
extends Component


func get_action(consumer: Entity) -> Action:
	return ItemAction.new(consumer, entity)


func activate(action: ItemAction) -> bool:
	return false
