class myCAD {
	constructor() {
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.dimtext = 32;
		this.leadertext = 48;
		
		this.linePattern = {
			"cont": [],
			"dot": [1, 1],
			"dash1": [10, 10],
			"dash2": [20, 5],
			"dashdot1": [15, 3, 3, 3],
			"dashdot2": [20, 3, 3, 3, 3, 3, 3, 3],
			"dashdot3": [12, 3, 3]
		};
		
	}
	Test(ctx) {
		ctx.beginPath();
		ctx.moveTo(20, 20);
		ctx.arcTo(70, 70, 120, 20, 30);
		ctx.lineTo(120, 20);
		ctx.stroke();
		ctx.fillRect(70, 70, 2, 2);
		ctx.fillStyle = "lightgrey";
		ctx.strokeStyle = "blue";
		this.Hsection(ctx, 100, 100, 20, 80, 120, 10, 9, 6);
		this.drawPolygon(ctx, 6, 40, 300, 150);
		ctx.setTransform(2, 0, 0, 1, 0, 0);
		ctx.setLineDash(linePattern.dashdot2);
		ctx.fillStyle = "rgba(200, 255, 255, 0.4)";
		this.roundedRect(ctx, 30, 105, 60, 40, 15);
	}
	update(fnc) {
		this.drawGrid(this.ctx);
		fnc(this.ctx, this);
	}
	drawGrid(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.save();
		for(var x = 0; x < ctx.canvas.width; x += 25.4) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, ctx.canvas.height);
		}
		for(var y = 0; y < ctx.canvas.height; y += 25.4) {
			ctx.moveTo(0, y);
			ctx.lineTo(ctx.canvas.width, y);
		}
		ctx.strokeStyle = '#ddd';
		ctx.stroke();
		ctx.restore();
	}
	drawLine(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	drawLines() {
		var ctx = arguments[0];
		var x1 = arguments[1];
		var y1 = arguments[2];
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		for(var i = 3; i < arguments.length; i += 2) {
			var x2 = x1 + arguments[i];
			var y2 = y1 + arguments[i + 1];
			ctx.lineTo(x2, y2);
			x1 = x2;
			y1 = y2;
		}
		ctx.stroke();
	}
	drawHContinueLine(ctx, xc, yc, L) {
		var dx = 20,
			dy = 40;
		this.drawLines(ctx, xc - L / 2, yc, L / 2 - 2 * dx, 0, dx, dy, dx, -dy, dx, -dy, dx, dy, L / 2 - 2 * dx, 0);
	}
	drawContinueLine(ctx, x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		var angle = Math.atan2(dy, dx);
		var length = Math.sqrt(dx * dx + dy * dy);
		ctx.save();
		ctx.translate((x2 + x1) / 2, (y2 + y1) / 2);
		ctx.rotate(angle);
		//ctx.strokeStyle = "#555";
		//ctx.lineWidth = 2;
		this.drawHContinueLine(ctx, 0, 0, length);
		ctx.restore();
	}
	drawRect(ctx, x1, y1, w, h) {
		ctx.beginPath();
		ctx.rect(x1, y1, w, h);
		ctx.stroke();
	}
	drawFillRect(ctx, x1, y1, w, h) {
		ctx.beginPath();
		ctx.rect(x1, y1, w, h);
		ctx.stroke();
		ctx.fill();
	}
	drawCircle(ctx, x1, y1, r) {
		ctx.beginPath();
		ctx.arc(x1, y1, r, 0, 2 * Math.PI);
		ctx.stroke();
	}
	drawFillCircle(ctx, x1, y1, r) {
		ctx.beginPath();
		ctx.arc(x1, y1, r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}
	drawPoint(ctx, x1, y1, r) {
		ctx.beginPath();
		ctx.moveTo(x1 - r / 2, y1);
		ctx.lineTo(x1 + r / 2, y1);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x1, y1 - r / 2);
		ctx.lineTo(x1, y1 + r / 2);
		ctx.stroke();
	}
	centerText(ctx, x, y, str, size) {
		ctx.font = size + "px Arial";
		ctx.textAlign = "center";
		ctx.strokeText(str, x, y);
	}
	leftText(ctx, x, y, str, size) {
		ctx.font = size + "px Arial";
		ctx.textAlign = "left";
		ctx.strokeText(str, x, y);
	}
	rightText(ctx, x, y, str, size) {
		ctx.font = size + "px Arial";
		ctx.textAlign = "right";
		ctx.strokeText(str, x, y);
	}
	drawHDim(ctx, x1, y1, x2, y2, y3) {
		var sign = y3 < 0 ? -1 : 1;
		var ofs = 8 * sign,
			ext = 50 * sign;
		this.drawLineWithArrows(ctx, x1, y1 + y3, x2, y2 + y3, 10, 14, true, true);
		this.drawLine(ctx, x1, y1 + ofs, x1, y1 + y3 + ext);
		this.drawLine(ctx, x2, y2 + ofs, x2, y2 + y3 + ext);
		ctx.save();
		ctx.font = this.dimtext + "px Arial";
		ctx.textAlign = "center";
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 2;
		ctx.strokeText(x2 - x1, (x1 + x2) / 2, y2 + y3 - 8);
		ctx.restore();
	}
	drawRoDim(ctx, x1, y1, x2, y2, y3) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		var angle = Math.atan2(dy, dx);
		var length = Math.sqrt(dx * dx + dy * dy);
		ctx.save();
		ctx.translate(x1, y1);
		ctx.rotate(angle);
		ctx.strokeStyle = "#555";
		ctx.lineWidth = 2;
		this.drawHDim(ctx, 0, 0, length, 0, y3);
		ctx.restore();
	}
	drawLeader(ctx, x, y, lx1, lx2, ly, str) {
		//var lx1=200, lx2=200, ly=200;
		var sx = lx2 > 0 ? 1 : -1;
		ctx.save();
		ctx.translate(x, y);
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 3;
		this.drawLineWithArrows(ctx, 0, 0, lx1, ly, 10, 24, true, false);
		if(arguments.length > 7) {
			var x2 = arguments[7];
			var y2 = arguments[8];
			this.drawLineWithArrows(ctx, x2, y2, lx1, ly, 10, 24, true, false);
		}
		this.drawLine(ctx, lx1, ly, lx1 + lx2, ly);
		if(sx > 0) this.leftText(ctx, lx1 + lx2 + 20, ly, str, this.leadertext);
		else this.rightText(ctx, lx1 + lx2 + 20, ly, str, this.leadertext);
		ctx.restore();
	}
	weldLeader(ctx, x, y, lx1, lx2, ly, w, spec) {
		//var lx1=200, lx2=200, ly=200;
		var sx = lx2 > 0 ? 1 : -1;
		ctx.save();
		ctx.translate(x, y);
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 3;
		this.drawLineWithArrows(ctx, 0, 0, lx1, ly, 10, 24, true, false);
		if(arguments.length > 8) {
			var x2 = arguments[8];
			var y2 = arguments[9];
			this.drawLineWithArrows(ctx, x2, y2, lx1, ly, 10, 24, true, false);
		}
		this.drawLine(ctx, lx1, ly, lx1 + lx2, ly);
		this.drawLine(ctx, lx1 + lx2, ly, lx1 + lx2 + 60, ly + 60);
		this.drawLine(ctx, lx1 + lx2, ly, lx1 + lx2 + 60, ly - 60);
		if(sx > 0) this.leftText(ctx, lx1 + lx2 + 20, ly, spec, this.leadertext);
		else this.rightText(ctx, lx1 + lx2 + 20, ly, spec, this.leadertext);
		var s = 30;
		this.drawLines(ctx, lx1 + lx2 / 2, ly, 0, -s, s, s, -s, s, 0, -s);
		this.rightText(ctx, lx1 + lx2 / 2 - 12, ly + s, w, this.leadertext);
		this.rightText(ctx, lx1 + lx2 / 2 - 12, ly - s / 2, w, this.leadertext);
		ctx.restore();
	}
	drawLineWithArrows(ctx, x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd) {
			var dx = x1 - x0;
			var dy = y1 - y0;
			var angle = Math.atan2(dy, dx);
			var length = Math.sqrt(dx * dx + dy * dy);
			//
			ctx.save();
			ctx.translate(x0, y0);
			ctx.rotate(angle);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(length, 0);
			if(arrowStart) {
				ctx.moveTo(aLength, -aWidth);
				ctx.lineTo(0, 0);
				ctx.lineTo(aLength, aWidth);
			}
			if(arrowEnd) {
				ctx.moveTo(length - aLength, -aWidth);
				ctx.lineTo(length, 0);
				ctx.lineTo(length - aLength, aWidth);
			}
			//
			ctx.stroke();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.restore();
		}
		// Use arcTo to easily create a rounded rectangle
	roundedRect(ctx, x, y, w, h, r) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + r, r);
		ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
		ctx.arcTo(x, y + h, x, y + h - r, r);
		ctx.arcTo(x, y, x + r, y, r);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
	sectionName(S) {
		return "H" + S.d + "x" + S.bf + "x" + S.tw + "x" + S.tf;
	}
	Hsection(ctx, x1, y1, ro, B, D, tw, th, r) {
		var x = 0,
			y = 0;
		ctx.save();
		ctx.translate(x1, y1);
		ctx.rotate(ro * Math.PI / 180);
		ctx.beginPath();
		ctx.moveTo(x - B / 2, y - D / 2);
		ctx.arcTo(x - B / 2, y - D / 2 + th, x - tw / 2, y - D / 2 + th, r);
		ctx.arcTo(x - tw / 2, y - D / 2 + th, x - tw / 2, y + D / 2 - th, r);
		ctx.arcTo(x - tw / 2, y + D / 2 - th, x - B / 2, y + D / 2 - th, r);
		ctx.arcTo(x - B / 2, y + D / 2 - th, x - B / 2, y + D / 2, r);
		ctx.lineTo(x - B / 2, y + D / 2);
		ctx.lineTo(x + B / 2, y + D / 2);
		ctx.arcTo(x + B / 2, y + D / 2 - th, x + tw / 2, y + D / 2 - th, r);
		ctx.arcTo(x + tw / 2, y + D / 2 - th, x + tw / 2, y - D / 2 + th, r);
		ctx.arcTo(x + tw / 2, y - D / 2 + th, x + B / 2, y - D / 2 + th, r);
		ctx.arcTo(x + B / 2, y - D / 2 + th, x + B / 2, y - D / 2, r);
		ctx.lineTo(x + B / 2, y - D / 2);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
	drawPolygon(ctx, numberOfSides, size, Xcenter, Ycenter) {
		ctx.beginPath();
		ctx.moveTo(Xcenter + size * Math.cos(0), Ycenter + size * Math.sin(0));
		for(var i = 1; i <= numberOfSides; i += 1) {
			ctx.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
		}
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	
}