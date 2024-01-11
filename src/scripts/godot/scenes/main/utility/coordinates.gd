const START_X: int = 45
const START_Y: int = 45
const STEP_X: int = 15
const STEP_Y: int = 15

func index_to_vector(x: int, y: int,
		x_offset: int = 0, y_offset: int = 0) -> Vector2:
	var x_vector: int = START_X + STEP_X * x + x_offset
	var y_vector: int = START_Y + STEP_Y * y + y_offset
	return Vector2(x_vector, y_vector)

func vector_to_array(vector_coord: Vector2) -> Array:
	var x: int = ((vector_coord.x - START_X) / STEP_X) as int
	var y: int = ((vector_coord.y - START_Y) / STEP_Y) as int
	return [x, y]
