function solve(obj){
	if(obj.handsShaking === true){
		obj.bloodAlcoholLevel += 0.1 * obj.weight * obj.experience
		obj.handsShaking = false
	}
	return obj
}
solve({ weight: 80,
  experience: 1,
  bloodAlcoholLevel: 0,
  handsShaking: true })