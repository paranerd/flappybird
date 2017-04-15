var Player = function(x, y) {
	this.height = 24;
	this.width = 30;
	this.top = y;
	this.left = x;
	this.bottom = this.top + this.height;
	this.right = this.left + this.width;
	this.falling = false;
	this.jumpAvailable = true;
	this.lookDir = 1; // 1 = right, -1 = left
	this.buttonPressed = false;
	this.speed = 140; // px per frame
	this.gravity = 16;
	this.velocity = 4.5;
	this.bullets = [];
	this.moving = {up: false, left: false, down: false, right: false};
	this.collision = {top: false, left: false, bottom: false, right: false};
	this.start = 0;
	
	this.animState = function() { // x-Position im Sprite
		if(this.moving.up) {
		   return 9;
		}
		else {
		   return 120;
		}
	};
	
	this.jump = function() {
		if(this.jumpAvailable) {
			this.velocity = 4.5;
			this.moving.up = true;
			this.jumpAvailable = false;
		}
	};

	this.updatePos = function (dt) {
		if (this.moving.up && !this.collision.top) {
			// Player is holding down jump key
			this.top -= this.velocity;
			this.velocity -= this.gravity * dt;
			if(this.velocity <= 0) {
				this.velocity = 0;
				this.moving.up = false;
			}
		}
		else if(!this.collision.bottom) {
			this.moving.up = false;
			this.top += this.velocity;
			this.velocity += this.gravity * dt * 2;
		}
		
		// Set bounderies
		this.bottom = this.top + this.height;
		this.right = this.left + this.width;

		this.collision = {top: false, bottom: false, right: false, left: false};
	};

	this.getBgOffset = function() {
		return this.bgOffset;
	};

	this.getPos = function() {
		var newLeft = this.left;
		var newRight = newLeft + this.width;
		return {left: newLeft, right: newRight, top: this.top, bottom: this.bottom};
	};
}
