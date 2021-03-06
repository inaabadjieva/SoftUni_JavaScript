let Turtle = require('./turtle')

class GalapagosTurtle extends Turtle {
	constructor(name, age, gender){
		super(name, age, gender)
		this._thingsEaten = []
	}
	get thingsEaten(){
		return this._thingsEaten
	}
	eat(food){
		this._thingsEaten.push(food)
	}
	grow(age){
		super.grow(age)
		this._thingsEaten = []
	}
	toString(){
		let output = super.toString()
		output += `\nThings, eaten this year: ${this._thingsEaten.join(', ')}`
		return output
	}
}
module.exports = GalapagosTurtle