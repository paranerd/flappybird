var Block = function(x, y, height, type) {
	this.width = 50;
	this.height = height;
	this.left = x;
	this.right = this.left + this.width;
	this.top = y;
	this.bottom = this.top + this.height;
	this.type = type; // 1 = top, 2 = bottom
	//this.img = new Image();
	//this.img.src = 'sprites/block_spritesheet.png';
	this.velocity = {x: 2 * this.dir, y: 0} // (horizontalSpeed, verticalSpeed); vS negative throws ball upwards
	this.speed = 150;
	this.bullets = [];
	this.collision = {top: false, left: false, bottom: false, right: false};
	this.scored = false;

	this.getPos = function() {
		return {left: this.left, right: this.right, top: this.top, bottom: this.bottom};
	};

	this.updatePos = function(dt) {
		this.left -= this.speed * dt;
		this.right = this.left + this.width;
	};
}