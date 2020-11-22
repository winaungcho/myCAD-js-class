/******
 * Javascript myCAD class
 *
 * This class is free for the educational use as long as maintain this header together with this class.
 * Author: Win Aung Cho
 * Contact winaungcho@gmail.com
 * version 1.0
 * Date: 22-11-2020
 *
 ******/


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
function drawJoint(ctx, mycad) {
		var D1 = 40,
			ED = 75,
			S = 85,
			tp = 22,
			ts = 13,
			td = 9.5,
			Bp = 200,
			db = 22,
			g = 100;
		var lfac = 1;
		var boltType = "A325";
		var beamBotSlope = 1.0 / 4;
		var x = 350,
			y = 350;
		var Beam = {
				"d": 400,
				"tw": 10,
				"bf": 154,
				"tf": 13,
				"k": 24
			}
			//Column:
		var C = {
			"d": 350,
			"tw": 14,
			"bf": 315,
			"tf": 20,
			"k": 31,
			"k1": 34
		}

		
		var elmts = document.getElementsByTagName("input");
		var L = elmts.length;
		for(var i = 0; i < L; i++) {
			try {
				eval(elmts[i].name + "=" + elmts[i].value);
			} catch(e) {}
		}
		var lp = 2 * (D1 + ED) + Beam.d;
		
		ctx.save();
		ctx.setTransform(0.5 * lfac, 0, 0, 0.5 * lfac, 0, 0);
		ctx.translate(x / lfac, y / lfac);
		ctx.fillStyle = "rgba(200, 255, 255, 0.4)";
		ctx.strokeStyle = "#555";
		ctx.setLineDash(mycad.linePattern.dashdot2);
		ctx.lineWidth = 2;
		mycad.drawLine(ctx, 0, -(D1 + ED + 150), 0, lp + 150);
		mycad.drawLine(ctx, C.d / 2 - C.tf - 25, -D1, C.d / 2 + tp + 25, -D1);
		mycad.drawLine(ctx, C.d / 2 - C.tf - 25, -D1 + S, C.d / 2 + tp + 25, -D1 + S);
		mycad.drawLine(ctx, C.d / 2 - C.tf - 25, Beam.d + D1, C.d / 2 + tp + 25, Beam.d + D1);
		mycad.drawLine(ctx, C.d / 2 - C.tf - 25, Beam.d + D1 - S, C.d / 2 + tp + 25, Beam.d + D1 - S);
		mycad.drawLine(ctx, C.d / 2 - C.tf - 25, Beam.d / 2 - S / 2, C.d / 2 + tp + 25, Beam.d / 2 - S / 2);
		mycad.drawLine(ctx, C.d / 2 - C.tf - 25, Beam.d / 2 + S / 2, C.d / 2 + tp + 25, Beam.d / 2 + S / 2);
		ctx.setLineDash(mycad.linePattern.cont);
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 3;
		mycad.drawLine(ctx, -C.d / 2, -(D1 + ED + 100), -C.d / 2, lp + 100);
		mycad.drawLine(ctx, -C.d / 2 + C.tf, -(D1 + ED + 100), -C.d / 2 + C.tf, lp + 100);
		mycad.drawLine(ctx, C.d / 2, -(D1 + ED + 100), C.d / 2, lp + 100);
		mycad.drawLine(ctx, C.d / 2 - C.tf, -(D1 + ED + 100), C.d / 2 - C.tf, lp + 100);
		mycad.drawHContinueLine(ctx, 0, -(D1 + ED + 100), C.d + 200);
		mycad.drawHContinueLine(ctx, 0, (lp + 100), C.d + 200);
		mycad.drawFillRect(ctx, 0 - C.d / 2 + C.tf, 0, C.d - 2 * C.tf, ts);
		mycad.drawFillRect(ctx, 0 - C.d / 2 + C.tf, Beam.d - ts, C.d - 2 * C.tf, ts);
		mycad.centerText(ctx, 0, Beam.d + 120, "Column", 48 / lfac);
		mycad.centerText(ctx, 0, Beam.d + 180, mycad.sectionName(C), 48 / lfac);
		mycad.weldLeader(ctx, 0, Beam.tf, 100, 300, 100, 6, "E70 SMAW", 0, Beam.d - 2 * ts);
		mycad.drawRect(ctx, C.d / 2, -(D1 + ED), tp, lp);
		mycad.drawLineWithArrows(ctx, C.d / 2 + tp, Beam.d / 2, C.d / 2 + tp + Beam.d, -ED - D1, 10, 24, true, false);
		mycad.drawLineWithArrows(ctx, C.d / 2 + tp + Beam.d * 2 + C.bf / 2 - Bp / 2, Beam.d / 2, C.d / 2 + tp + Beam.d, -ED - D1, 10, 24, true, false);
		mycad.centerText(ctx, C.d / 2 + tp + Beam.d, -ED - D1, "End Plate " + tp + " mm thick", 48 / lfac);
		mycad.weldLeader(ctx, C.d / 2 + tp, Beam.d - 100, 200, 200, 200, 6, "E70 SMAW");
		var dy = Beam.d * 2 * beamBotSlope;
		mycad.drawLine(ctx, C.d / 2 + tp, 0, C.d / 2 + tp + Beam.d * 2, 0);
		mycad.drawLine(ctx, C.d / 2 + tp, Beam.tf, C.d / 2 + tp + Beam.d * 2, Beam.tf);
		mycad.drawLine(ctx, C.d / 2 + tp, Beam.d, C.d / 2 + tp + Beam.d * 2, Beam.d - dy);
		mycad.drawLine(ctx, C.d / 2 + tp, Beam.d - Beam.tf, C.d / 2 + tp + Beam.d * 2, Beam.d - Beam.tf - dy);
		mycad.centerText(ctx, C.d / 2 + tp + Beam.d, Beam.d / 2, "Beam", 48 / lfac);
		mycad.centerText(ctx, C.d / 2 + tp + Beam.d, Beam.d / 2 + 60, mycad.sectionName(Beam), 48 / lfac);
		mycad.drawContinueLine(ctx, C.d / 2 + tp + Beam.d * 2, Beam.d + 100 - dy, C.d / 2 + tp + Beam.d * 2, -100);
		mycad.drawFillRect(ctx, C.d / 2 - C.tf, -D1 - db / 2, C.tf + tp, db);
		mycad.drawFillRect(ctx, C.d / 2 - C.tf, -D1 + S - db / 2, C.tf + tp, db);
		mycad.drawFillRect(ctx, C.d / 2 - C.tf, Beam.d + D1 - db / 2, C.tf + tp, db);
		mycad.drawFillRect(ctx, C.d / 2 - C.tf, Beam.d + D1 - S - db / 2, C.tf + tp, db);
		mycad.drawFillRect(ctx, C.d / 2 - C.tf, Beam.d / 2 - S / 2 - db / 2, C.tf + tp, db);
		mycad.drawFillRect(ctx, C.d / 2 - C.tf, Beam.d / 2 + S / 2 - db / 2, C.tf + tp, db);
		//col section
		var xc = 0,
			yc = lp + 100 + C.bf;
		mycad.Hsection(ctx, 0, yc, 90, C.bf, C.d, C.tw, C.tf, 10);
		mycad.drawRect(ctx, xc + C.d / 2, yc - Bp / 2, tp, Bp);
		mycad.drawFillRect(ctx, xc + C.d / 2 - C.tf, yc - g / 2 - db / 2 - 4, C.tf + tp, db);
		mycad.drawFillRect(ctx, xc + C.d / 2 - C.tf, yc + g / 2 - db / 2 - 4, C.tf + tp, db);
		mycad.drawFillRect(ctx, xc - C.d / 2 + C.tf + 6, yc - C.tw / 2 - td, C.d - 2 * (C.tf + 6), td);
		mycad.drawFillRect(ctx, xc - C.d / 2 + C.tf + 6, yc + C.tw / 2, C.d - 2 * (C.tf + 6), td);
		mycad.drawLeader(ctx, xc + C.d / 4, yc + C.tw / 2 + td, 0, C.d, C.bf / 2 + 20, "Web doubler plate " + td + " mm thick");
		mycad.drawLine(ctx, xc - C.d / 2 + C.tf, yc - Bp / 2, xc + C.d / 2 + C.tf, yc - Bp / 2);
		mycad.drawLine(ctx, xc - C.d / 2 + C.tf, yc + Bp / 2, xc + C.d / 2 + C.tf, yc + Bp / 2);
		mycad.drawLine(ctx, xc + C.d / 2 + tp, yc + Beam.bf / 2, xc + C.d / 2 + tp + Beam.d * 2, yc + Beam.bf / 2);
		mycad.drawLine(ctx, xc + C.d / 2 + tp, yc - Beam.bf / 2, xc + C.d / 2 + tp + Beam.d * 2, yc - Beam.bf / 2);
		mycad.drawContinueLine(ctx, xc + C.d / 2 + tp + Beam.d * 2, yc + Beam.bf / 2 + 100, xc + C.d / 2 + tp + Beam.d * 2, yc - Beam.bf / 2 - 100);
		mycad.centerText(ctx, C.d / 2 + tp + Beam.d, yc - 30, "Beam", 48 / lfac);
		mycad.centerText(ctx, C.d / 2 + tp + Beam.d, yc + 30, mycad.sectionName(Beam), 48 / lfac);
		mycad.drawLineWithArrows(ctx, xc, yc - Bp / 2, xc + C.d / 2 + tp, yc - C.bf / 2 - 80, 10, 24, true, false);
		mycad.drawLine(ctx, xc + C.d / 2 + tp, yc - C.bf / 2 - 80, xc + C.d / 2 + 120, yc - C.bf / 2 - 80);
		mycad.leftText(ctx, xc + C.d / 2 + 120, yc - C.bf / 2 - 80, "Stiffener " + ts + " mm thick", 48 / lfac);
		mycad.drawRoDim(ctx, xc - C.d / 2, yc + C.bf / 2, xc + C.d / 2, yc + C.bf / 2, 80);
		mycad.drawRoDim(ctx, xc + C.d / 2, yc + Bp / 2, xc + C.d / 2, yc - Bp / 2, 80);
		mycad.drawRoDim(ctx, xc + C.d / 2, yc + C.bf / 2, xc + C.d / 2, yc - C.bf / 2, 120);
		//beam section
		var xc = tp + 50 + C.d / 2 + Beam.d * 2 + C.bf / 2;
		var yc = Beam.d / 2;
		mycad.drawLine(ctx, xc - C.bf / 2, yc - Beam.d / 2 - (D1 + ED + 100), xc - C.bf / 2, yc - Beam.d / 2 + lp + 100);
		mycad.drawLine(ctx, xc + C.bf / 2, yc - Beam.d / 2 - (D1 + ED + 100), xc + C.bf / 2, yc - Beam.d / 2 + lp + 100);
		mycad.Hsection(ctx, xc, Beam.d / 2, 0, Beam.bf, Beam.d, Beam.tw, Beam.tf, 10);
		mycad.drawRect(ctx, xc - Bp / 2, -D1 - ED, Bp, lp);
		mycad.drawRoDim(ctx, xc - Bp / 2, yc + lp / 2, xc + Bp / 2, yc + lp / 2, 80);
		mycad.centerText(ctx, xc, yc + lp / 2 + D1 + ED + 160, "End Plate " + Bp + "x" + lp + "x" + tp, 48 / lfac);
		mycad.centerText(ctx, xc, yc + lp / 2 + D1 + ED + 220, boltType + " Type " + db + " Φmm Bolts", 48 / lfac);
		var vdimL = (C.bf - Bp) / 2 + 80;
		mycad.drawRoDim(ctx, xc + Bp / 2, yc + lp / 2, xc + Bp / 2, yc + lp / 2 - ED, vdimL);
		mycad.drawRoDim(ctx, xc + Bp / 2, yc + lp / 2 - ED, xc + Bp / 2, yc + lp / 2 - ED - S, vdimL);
		mycad.drawRoDim(ctx, xc + Bp / 2, yc + lp / 2 - ED - S, xc + Bp / 2, yc - lp / 2 + ED + S, vdimL);
		mycad.drawRoDim(ctx, xc + Bp / 2, yc - lp / 2 + ED + S, xc + Bp / 2, yc - lp / 2 + ED, vdimL);
		mycad.drawRoDim(ctx, xc + Bp / 2, yc - lp / 2 + ED, xc + Bp / 2, yc - lp / 2, vdimL);
		mycad.drawRoDim(ctx, xc + Bp / 2, yc + lp / 2, xc + Bp / 2, yc - lp / 2, vdimL + 40);
		mycad.drawHContinueLine(ctx, xc, yc - Beam.d / 2 - (D1 + ED + 100), C.bf + 200);
		mycad.drawHContinueLine(ctx, xc, yc + lp / 2 + D1 + ED + 100, C.bf + 200);
		mycad.drawFillCircle(ctx, xc - g / 2, yc - Beam.d / 2 - D1, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc + g / 2, yc - Beam.d / 2 - D1, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc - g / 2, yc - Beam.d / 2 - D1 + S, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc + g / 2, yc - Beam.d / 2 - D1 + S, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc - g / 2, yc - S / 2, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc - g / 2, yc + S / 2, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc + g / 2, yc - S / 2, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc + g / 2, yc + S / 2, db / 2 + 4);
		mycad.drawRoDim(ctx, xc - g / 2, yc - Beam.d / 2 - D1, xc + g / 2, yc - Beam.d / 2 - D1, -ED - 80);
		mycad.drawFillCircle(ctx, xc - g / 2, yc + Beam.d / 2 + D1, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc + g / 2, yc + Beam.d / 2 + D1, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc - g / 2, yc + Beam.d / 2 + D1 - S, db / 2 + 4);
		mycad.drawFillCircle(ctx, xc + g / 2, yc + Beam.d / 2 + D1 - S, db / 2 + 4);
		mycad.drawPoint(ctx, xc - g / 2, yc - Beam.d / 2 - D1, db + 16);
		mycad.drawPoint(ctx, xc + g / 2, yc - Beam.d / 2 - D1, db + 16);
		mycad.drawPoint(ctx, xc - g / 2, yc - Beam.d / 2 - D1 + S, db + 16);
		mycad.drawPoint(ctx, xc + g / 2, yc - Beam.d / 2 - D1 + S, db + 16);
		mycad.drawPoint(ctx, xc - g / 2, yc + Beam.d / 2 + D1, db + 16);
		mycad.drawPoint(ctx, xc + g / 2, yc + Beam.d / 2 + D1, db + 16);
		mycad.drawPoint(ctx, xc - g / 2, yc + Beam.d / 2 + D1 - S, db + 16);
		mycad.drawPoint(ctx, xc + g / 2, yc + Beam.d / 2 + D1 - S, db + 16);
		mycad.drawPoint(ctx, xc - g / 2, yc - S / 2, db + 16);
		mycad.drawPoint(ctx, xc - g / 2, yc + S / 2, db + 16);
		mycad.drawPoint(ctx, xc + g / 2, yc - S / 2, db + 16);
		mycad.drawPoint(ctx, xc + g / 2, yc + S / 2, db + 16);
		ctx.restore();
	}