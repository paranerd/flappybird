var player = new Player(100, 10),
	blocks = [],
	score = 0,
	gameOver = false,
	groundSize = 60,
	bgOffset = 0,
	ctx = canvas.getContext('2d'),
	bg = new Image(),
	sound = new SoundManager(),
	lastRender = Date.now(),
	lastFpsCycle = Date.now(),
	requestId,
	last = Date.now(),
	lastUpdate = Date.now(),
	frame = 0,
	groundOffset = 0;

bg.src = 'img/sprites.png';
sound.init();

window.onload = function() {
	wrapper.style.left = (window.innerWidth - canvas.width) / 2 + "px";
	wrapper.style.top = (window.innerHeight - canvas.height) / 2 + "px";

	createBlock();
	animate();
}

function createBlock() {
	var height1 = Math.floor(Math.random() * 100) + 80;
	blocks.push(new Block(canvas.width + 100, 0, height1, 1));

	var gap = 90;
	var height2 = canvas.height - height1 - gap - groundSize;
	blocks.push(new Block(canvas.width + 100, height1 + gap, height2, 2));
}

// Keyboard
document.onkeydown = function(e) {
	switch(e.keyCode) {
		case 32: // Spacebar
				player.jump();
			break;
	}
};
document.onkeyup = function(e) {
	switch(e.keyCode) {
		case 32: // Spacebar
			player.jumpAvailable = true;
			break;
	}
};

function simpleCollision(entity1, entity2) {
	ent1 = entity1.getPos();
	ent2 = entity2.getPos();

	return (ent2.bottom >= ent1.top &&
			ent2.top <= ent1.bottom &&
			ent2.left <= ent1.right &&
			ent2.right >= ent1.left);
}

function scored(player, block) {
	pl = player.getPos();
	bl = block.getPos();

	if(	pl.left > bl.left) {
		return true;
	}
}


// Game loop
function animate() {
	var delta = (Date.now() - lastRender) / 1000;
	update(delta);
	lastRender = Date.now();
	draw();

	// Request a new animation frame using Paul Irish's shim
	if(!gameOver) {
		requestId = window.requestAnimFrame(animate);
	}
	else {
		gameover.innerHTML = "Score: " + score;
		gameover.style.display = "inline-block";
		//$("#gameOver").html("Score: " + score);
		//$("#gameOver").fadeIn(200);
		sound.playSound("blockBreak");
	}
};

// Update
function update(dt) {
	frame++;

	if(frame == 60) {
		frame = 0;
		createBlock();
	}

	if(player.top <= 0) {
		player.collision.top = true;
	}

	else if(player.bottom >= canvas.height - groundSize - 2) {
		player.collision.bottom = true;
	}

	// Player against blocks
	for(var b = 0; b < blocks.length; b++) {
		var block = blocks[b];
		if(block.right <= 20) {
			blocks.splice(b, 1);
			b--;
			continue;
		}
		else {
			block.updatePos(dt);
		}

		if(simpleCollision(player, block)) {
			gameOver = true;
		}
		else if(!block.scored && block.type == 2 && scored(player, block)) {
			score++;
			block.scored = true;
			sound.playSound("coin");
			scorediv.innerHTML = score;
			window.cancelRequestAnimFrame(requestId);
		}
	}
	
	// Move Background
	bgOffset = (bgOffset <= -270) ? bgOffset + 270 : bgOffset - 1;
	groundOffset = (groundOffset <= -270) ? groundOffset + 270 : groundOffset - 150 * dt;

	player.updatePos(dt);
};

// Draw
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw background
	for(var i = bgOffset; i < canvas.width; i += 270) {
		ctx.drawImage(bg, 0, 0, 290, 510, i, 0, 272, 480);
	}
	
	for(var i = groundOffset; i < canvas.width; i += 270) {
		ctx.drawImage(bg, 584, 0, 336, groundSize, i, canvas.height - groundSize, 272, groundSize);
	}

	// Blocks
	for(var b in blocks) {
		var block = blocks[b];
		if(block.type == 1) {
			ctx.drawImage(bg, 113, 966 - block.height, 50, block.height, block.left, block.top, block.width, block.height);
		}
		else {
			ctx.drawImage(bg, 168, 646, 52, block.height, block.left, block.top, block.width, block.height);
		}
	}

	// Player
	ctx.drawImage(bg, player.animState(), 982, player.width, player.height, player.left, player.top, player.width, player.height);
};
