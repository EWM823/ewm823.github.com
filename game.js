water = "#191970";
road =  "#000000";
green = "#00FF00";

// all of the following global variables are used to determine the
// initial locations of the items in the sprite sheet.

var num_lives = 2;
var high_score = 0;
var score = 0;
var level = 1;
var num_success = 0;

var row_reached = [0,0,0,0,0,0,0,0,0,0,0,0,0];

//each log element has [x, y, width, height, speed] heights in order are 125, 150, 182, 214, 247
var logs_1 = [[1, 125, 90, 25, 2], [150, 125, 90, 25, 2], [350, 125, 90, 25, 2]];
var logs_2 = [[1, 150, 186, 32, 4], [225, 150, 186, 32, 4]];
var logs_3 = [[200, 182, 127, 25, 3], [0, 182, 127, 25, 3], [340, 182, 127, 25, 3]];
var logs_4 = [[50, 214, 90, 25, 2], [300, 214, 90, 25, 2], [-60, 214, 90, 25, 2]];
var logs_5 = [[120, 247, 186, 32, 4], [370, 247, 186, 32, 4]];

//sprites holds the key of the item being grabbed, and an array [x, y, width, height]
var sprite = {"title": [1, 1, 350, 50], "grass": [1, 50, 398, 65], 
		      "road_top": [1, 113, 398, 45], "road_bot": [1, 113, 398, 45],
		      "life_1": [42, 334, 33, 28], "life_2": [42, 334, 33, 28],
		      "frogger": [46, 365, 22, 25], "logs_l": [1, 160, 186, 32],
		      "logs_m": [9, 193, 127, 25], "logs_s": [12, 225, 90, 25],
   		      "car_L1": [110, 298, 47, 31], "car_R1": [43, 261, 31, 29],
   		      "car_L2": [9, 262, 32, 23], "car_R2": [71, 297, 27, 26],  
   		      "car_L3": [85, 260, 23, 29], "fly": [144,232,25,24]
   		      };
//indices holds values of the static indices on the canvas--title, grass, highscore, etc.
//array holds elements [x, y, width, height]
var indices = {"title": [25, 1, 350, 50], "grass": [1, 60, 398, 65],
			  "road_top": [1, 270, 398, 45], "road_bot": [1, 472, 398, 45],
			  "life_1": [1, 512, 33, 28], "life_2": [36, 512, 33, 28],
			  "life_3": [71, 512, 33, 28], "life_4": [106, 512, 33, 28]};
//array of possible fly locations
var fly_visible = [1,1,1,1];
var fly_locs = [[17, 85, 25, 24], [103, 85, 25, 24], [187, 85, 25, 24], [271, 85, 25, 24], [356, 85, 25, 24], [100, 182, 25, 24], [50, 247, 25, 24], [200, 214, 25, 24], [100, 407, 25, 24]];
var rand = Math.floor((Math.random()*fly_locs.length)+1);
//randomized index generator for fly locations
var fly_index = [rand, (rand + 1)%fly_locs.length, (rand + 1) % fly_locs.length, ((rand + 1) % fly_locs.length)];
//index to above randomized index generator
var index_in_f_i = 0;
var frogger = [190, 480, 22, 25, 0];
var frogger_start = [190, 480, 22, 25, 0];
//variables holding the cars--L/R indicates the direction it moves, 
var cars_L1 = [[350,316,47,31,3], [250,316,47,31,3], [100,316,47,31,3]];
var cars_L2 = [[300, 375,32,23, 2], [125, 375,32,23, 2], [20, 375,32,23, 2]];
var cars_L3 = [[375, 440, 23, 29, 2], [150, 440, 23, 29, 2], [10, 440, 23, 29, 2]];
var cars_R1 = [[1, 342, 31, 29, 4], [100, 342, 31, 29, 4], [250, 342, 31, 29, 4]];
var cars_R2 = [[1, 407, 27, 26, 1], [150, 407, 27, 26, 1], [280, 407, 27, 26, 1]];

//array that holds the x coordinate of the lily pads (where frogger can safely land to win)
var lilypads = [17, 103, 187, 271, 356];

//contains indices of y-axis rows that frogger can jump between.
//index 0 is start, and as indices increase position moves up.
var index_in_row = 0; //if index is 1-5, frogger is in road. if in 7-11, in river.
var rows = [480, 445, 407, 375, 346, 316, 280, 247, 214, 182, 150, 125, 85];

var x_level_text = 150;
var y_level_text = 533;

var x_score_text = 1;
var y_score_text = 550;

var x_highscore_text = 103;
var y_highscore_text = 550;


function move_frog() {
	$(document).keydown(function(event){
		if (event.keyCode == 37) { 	    //left
	    	document.getElementById("jump").play();
			if (frogger[0] >= frogger[2] + 1) {
				frogger[0] -= frogger[2];
			}
			else {
				frogger[0] = 1; //set frogger to edge of canvas
			}
		}
		else if (event.keyCode == 38) { //up
	    	document.getElementById("jump").play();
			if (index_in_row >= 0 && index_in_row < (rows.length - 1)) {
				index_in_row++;
				frogger[1] = (rows[index_in_row]);
				if (row_reached[index_in_row] == 0) {
					score+= 10;
				row_reached[index_in_row] = 1;	
				}			
			}
		}
		else if (event.keyCode == 40) { //down
	    	document.getElementById("jump").play();
			if (index_in_row > 0 && index_in_row < rows.length) {
				index_in_row--;
				frogger[1] = (rows[index_in_row]);
			}
		}
		else if (event.keyCode == 39) { // right
	    	document.getElementById("jump").play();		
			if (frogger[0] <= (399 - (frogger[2] + 13))) {
				frogger[0] += frogger[2];
			}
			else {
				frogger[0] = 399 - (frogger[2]);
			}
		}
	})
}

function start_game() {

    spreadsheet = new Image();
    spreadsheet.src = 'assets/frogger_sprites.png';
	spreadsheet.onload = function() {
	draw();
    }
		delay = 40;
		move_frog();
		draw();
		setInterval(draw, delay);
}

function draw() {

		move_logs();
		move_cars();
		move_frogger();
        canvas = document.getElementById('game');
        if (canvas.getContext) {
                ctx = canvas.getContext('2d');
                //draw water and road colors`
                ctx.fillStyle = water;
                ctx.fillRect(0, 0, 399, 290);
                ctx.fillStyle = road;
                ctx.fillRect(0, 290, 399, 275);

                //draw title 
                ctx.drawImage(spreadsheet, sprite["title"][0], sprite["title"][1], sprite["title"][2], 
                              sprite["title"][3], indices["title"][0], indices["title"][1], indices["title"][2], 
                              indices["title"][3]); 
                //draw grass
                ctx.drawImage(spreadsheet, sprite["grass"][0], sprite["grass"][1], sprite["grass"][2], 
                              sprite["grass"][3], indices["grass"][0], indices["grass"][1], indices["grass"][2], 
                              indices["grass"][3]); 
                              
 

                //draw top road barrier
                ctx.drawImage(spreadsheet, sprite["road_top"][0], sprite["road_top"][1], sprite["road_top"][2], 
                              sprite["road_top"][3], indices["road_top"][0], indices["road_top"][1], 
                              indices["road_top"][2], indices["road_top"][3]); 
                //draw bottom road barrier
                ctx.drawImage(spreadsheet, sprite["road_bot"][0], sprite["road_bot"][1], sprite["road_bot"][2], 
                              sprite["road_bot"][3], indices["road_bot"][0], indices["road_bot"][1], 
                              indices["road_bot"][2], indices["road_bot"][3]); 
        	    //draw logs row 1
        	    for (var i in logs_1) {
        	    	ctx.drawImage(spreadsheet, sprite["logs_s"][0], sprite["logs_s"][1], sprite["logs_s"][2], 
    	                          sprite["logs_s"][3], logs_1[i][0], logs_1[i][1], logs_1[i][2],
        	                      logs_1[i][3]);
        	    }
        	    //draw logs row 2
        	    for (var i in logs_2) {
        	    	ctx.drawImage(spreadsheet, sprite["logs_l"][0], sprite["logs_l"][1], sprite["logs_l"][2], 
    	                          sprite["logs_l"][3], logs_2[i][0], logs_2[i][1], logs_2[i][2],
        	                      logs_2[i][3]);
        	    }
        	    //draw logs row 3        	    
        	    for (var i in logs_3) {
        	    	ctx.drawImage(spreadsheet, sprite["logs_m"][0], sprite["logs_m"][1], sprite["logs_m"][2], 
    	                          sprite["logs_m"][3], logs_3[i][0], logs_3[i][1], logs_3[i][2],
        	                      logs_3[i][3]);
        	    }
        	    //draw logs row 4        	    
        	    for (var i in logs_4) {
        	    	ctx.drawImage(spreadsheet, sprite["logs_s"][0], sprite["logs_s"][1], sprite["logs_s"][2], 
    	                          sprite["logs_s"][3], logs_4[i][0], logs_4[i][1], logs_4[i][2],
        	                      logs_4[i][3]);
        	    }
        	    //draw logs row 5        	    
        	    for (var i in logs_5) {
        	    	ctx.drawImage(spreadsheet, sprite["logs_l"][0], sprite["logs_l"][1], sprite["logs_l"][2], 
    	                          sprite["logs_l"][3], logs_5[i][0], logs_5[i][1], logs_5[i][2],
        	                      logs_5[i][3]);
        	    }
                //draw cars
                for (var i in cars_L1) {
                ctx.drawImage(spreadsheet, sprite["car_L1"][0], sprite["car_L1"][1], 
                              sprite["car_L1"][2], sprite["car_L1"][3], cars_L1[i][0], 
                              cars_L1[i][1], cars_L1[i][2], cars_L1[i][3]); 
                }
                for (var i in cars_L2) {
                ctx.drawImage(spreadsheet, sprite["car_L2"][0], sprite["car_L2"][1], 
                              sprite["car_L2"][2], sprite["car_L2"][3],  cars_L2[i][0], 
                              cars_L2[i][1], cars_L2[i][2], cars_L2[i][3]);
                }
                for (var i in cars_L3) {
                ctx.drawImage(spreadsheet, sprite["car_L3"][0], sprite["car_L3"][1], 
                              sprite["car_L3"][2], sprite["car_L3"][3],  cars_L3[i][0], 
                              cars_L3[i][1], cars_L3[i][2], cars_L3[i][3]);
                }
                for (var i in cars_R1) {
                ctx.drawImage(spreadsheet, sprite["car_R1"][0], sprite["car_R1"][1], 
                              sprite["car_R1"][2], sprite["car_R1"][3],  cars_R1[i][0], 
                              cars_R1[i][1], cars_R1[i][2], cars_R1[i][3]);
                }
                for (var i in cars_R2) {
                ctx.drawImage(spreadsheet, sprite["car_R2"][0], sprite["car_R2"][1], 
                              sprite["car_R2"][2], sprite["car_R2"][3],  cars_R2[i][0], 
                              cars_R2[i][1], cars_R2[i][2], cars_R2[i][3]);
                }
                //draw frogger 
                ctx.drawImage(spreadsheet, sprite["frogger"][0], sprite["frogger"][1], sprite["frogger"][2], 
                              sprite["frogger"][3], frogger[0], frogger[1], frogger[2],
                              frogger[3]);
                //draw fly
                if (score > 200 && score < 500) {
                	index_in_f_i = 0;
                	if (fly_visible[index_in_f_i] == 1) {
	                ctx.drawImage(spreadsheet, sprite["fly"][0], sprite["fly"][1], sprite["fly"][2], 
    	                          sprite["fly"][3], fly_locs[fly_index[0]][0], fly_locs[fly_index[0]][1], fly_locs[fly_index[0]][2],
        	                      fly_locs[fly_index[0]][3]);
        	        }
        	    }
        	    if (score > 700 && score < 2300) {
                  	index_in_f_i = 1;
                	if (fly_visible[index_in_f_i] == 1) {                  	
                    ctx.drawImage(spreadsheet, sprite["fly"][0], sprite["fly"][1], sprite["fly"][2], 
    	                          sprite["fly"][3], fly_locs[fly_index[1]][0], fly_locs[fly_index[1]][1], fly_locs[fly_index[1]][2],
	      	                      fly_locs[fly_index[1]][3]);
	      	    	}
	      	    }

	      	    if (score > 2500 && score < 3500) {
                  	index_in_f_i = 2;
                	if (fly_visible[index_in_f_i] == 1) {
                    	ctx.drawImage(spreadsheet, sprite["fly"][0], sprite["fly"][1], sprite["fly"][2], 
    	                	          sprite["fly"][3], fly_locs[fly_index[2]][0], fly_locs[fly_index[2]][1], fly_locs[fly_index[2]][2],
	      	                	      fly_locs[fly_index[2]][3]);	      	    
			        }
			    }  	
	      	    if (score > 4500 && score < 6000) {
	      	    	index_in_f_i = 3;
                	if (fly_visible[index_in_f_i] == 1) {	      	    	
	                    ctx.drawImage(spreadsheet, sprite["fly"][0], sprite["fly"][1], sprite["fly"][2], 
    		                          sprite["fly"][3], fly_locs[fly_index[3]][0], fly_locs[fly_index[3]][1], fly_locs[fly_index[3]][2],
	    	  	                      fly_locs[fly_index[3]][3]);
	      		    }
	      		}
                //draw frogger-lives
                if (num_lives > 0) {
                ctx.drawImage(spreadsheet, sprite["life_1"][0], sprite["life_1"][1], sprite["life_1"][2], 
                              sprite["life_1"][3], indices["life_1"][0], indices["life_1"][1], indices["life_1"][2],
                              indices["life_1"][3]);
                }
                if (num_lives > 1) {
                ctx.drawImage(spreadsheet, sprite["life_2"][0], sprite["life_2"][1], sprite["life_2"][2], 
                              sprite["life_2"][3], indices["life_2"][0], indices["life_2"][1], indices["life_2"][2],
                              indices["life_2"][3]);
                }
                if (num_lives > 2) {
                ctx.drawImage(spreadsheet, sprite["life_2"][0], sprite["life_2"][1], sprite["life_2"][2], 
                              sprite["life_2"][3], indices["life_3"][0], indices["life_3"][1], indices["life_3"][2],
                              indices["life_3"][3]);
                }
                if (num_lives > 3) {
                ctx.drawImage(spreadsheet, sprite["life_2"][0], sprite["life_2"][1], sprite["life_2"][2], 
                              sprite["life_2"][3], indices["life_4"][0], indices["life_4"][1], indices["life_4"][2],
                              indices["life_4"][3]);
                }
                detect_collisions(); 
                
                ctx.font="24px Tahoma";
                ctx.fillStyle = green;
                //draw level 1 text
                ctx.fillText("Level " + level, x_level_text, y_level_text);
                //draw score text
                ctx.font="12px Tahoma";
                ctx.fillText("Score: " + score, x_score_text, y_score_text);
                //draw highscore text
                ctx.fillText("Highscore: " + high_score, x_highscore_text, y_highscore_text);
   		        check_game_status();
   		        }

}

function check_game_status() {
	check_new_life();
	if (num_lives < 0) {
		check_highscore();
		reset_board();
	}
}

function check_new_life() {
	if (score >= 10000) {
		if (num_lives <=4){
			num_lives++;
		}
	}
}
function check_highscore() {
	if (score > high_score) {
		high_score = score;
	}
}

function reset_board() {

/*"http://powerful-oasis-7334.herokuapp.com/submit.json"*/
   var player_name = prompt("you lost. now enter your name, homie.","name");
   $.post("http://powerful-oasis-7334.herokuapp.com/submit.json",{game_title: "Frogger", name: player_name, score: 2000 + score, created_at: new Date()});
    num_lives = 2;
	score = 0;
	level = 1;
	row_reached = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	for (var i in cars_L1) {
		cars_L1[i][4] = 3;
	}
	for (var i in cars_L2) {
		cars_L2[i][4] = 2;
	}
	for (var i in cars_L3) {
		cars_L3[i][4] = 2;
	}
	for (var i in cars_R1) {
		cars_R1[i][4] = 4;
	}
	for (var i in cars_R2) {
		cars_R2[i][4] = 1;
	}
	for (var i in logs_1) {
		logs_1[i][4] = 2;
	}
	for (var i in logs_2) {
		logs_2[i][4] = 4;
	}
	for (var i in logs_3) {
		logs_3[i][4] = 3;
	}
	for (var i in logs_4) {
		logs_4[i][4] = 2;
	}
	for (var i in logs_5) {
		logs_5[i][4] = 4;
	}
    fly_visible = [1,1,1,1];
    index_in_f_i = 0;
}
	

function move_logs() {

	for (var i in logs_1) {
		if (logs_1[i][0] >= 399) { //399 is canvas width
			logs_1[i][0] = (0 - logs_1[i][2]); //end of log gets beginning of river 
		}
		else {
			logs_1[i][0]+= logs_1[i][4];	//increment it by speed
		}
	}
	for (var i in logs_2) {
		if (logs_2[i][0] >= 399) { //399 is canvas width
			logs_2[i][0] = (0 - logs_2[i][2]); //end of log gets beginning of river 
		}
		else {
			logs_2[i][0]+= logs_2[i][4];	//increment it by speed
		}
	}
	for (var i in logs_3) {
		if (logs_3[i][0] >= 399) { //399 is canvas width
			logs_3[i][0] = (0 - logs_3[i][2]); //end of log gets beginning of river 
		}
		else {
			logs_3[i][0]+= logs_3[i][4];	//increment it by speed
		}
	}
	for (var i in logs_4) {
		if (logs_4[i][0] >= 399) { //399 is canvas width
			logs_4[i][0] = (0 - logs_4[i][2]); //end of log gets beginning of river 
		}
		else {
			logs_4[i][0]+= logs_4[i][4];	//increment it by speed
		}
	}
	for (var i in logs_5) {
		if (logs_5[i][0] >= 399) { //399 is canvas width
			logs_5[i][0] = (0 - logs_5[i][2]); //end of log gets beginning of river 
		}
		else {
			logs_5[i][0]+= logs_5[i][4];	//increment it by speed
		}
	}
}

function move_cars() {
	for (var i in cars_L1) {
		if (cars_L1[i][0] + cars_L1[i][2] <=0) {
			cars_L1[i][0] = (399); //right edge of canvas
		}
		else {
			cars_L1[i][0] -= cars_L1[i][4];
		}
	}
	for (var i in cars_L2) {
		if (cars_L2[i][0] + cars_L2[i][2] <=0) {
			cars_L2[i][0] = (399); //right edge of canvas
		}
		else {
			cars_L2[i][0] -= cars_L2[i][4];
		}
	}
	for (var i in cars_L3) {
		if (cars_L3[i][0] + cars_L3[i][2] <=0) {
			cars_L3[i][0] = (399); //right edge of canvas
		}
		else {
			cars_L3[i][0] -= cars_L3[i][4];
		}
	}
	for (var i in cars_R1) {
		if (cars_R1[i][0] >=399) {
			cars_R1[i][0] = (0 - cars_R1[i][2]); //right edge of canvas
		}
		else {
			cars_R1[i][0] += cars_R1[i][4];
		}
	}
	for (var i in cars_R2) {
		if (cars_R2[i][0] >=399) {
			cars_R2[i][0] = (0 - cars_R2[i][2]); //right edge of canvas
		}
		else {
			cars_R2[i][0] += cars_R2[i][4];
		}
	}
}

function detect_collisions() {
	detect_fly();
	if (index_in_row < 6) {
		detect_car_hit();
	}
	else if (index_in_row < 12) {
		detect_log_hit();
	}
	else {
		detect_win();
	}
}

function detect_fly() {
	var temp_indx = fly_index[index_in_f_i];
		if ((frogger[0] >= fly_locs[temp_indx][0] && frogger[0]) < (fly_locs[temp_indx][0] + fly_locs[temp_indx][2])
			&& (frogger[1] == fly_locs[temp_indx][1]) && (fly_visible[index_in_f_i] == 1)) { //if frogger and fly collide
			score += 200;
			fly_visible[index_in_f_i] = 0;
		}
		
}

function detect_win() {
	if (index_in_row == 12) {
		if (frogger[0] < 37 && frogger[0] > 1) {
			frogger[0] = lilypads[0];
			frogger[4] = 0;
			win_round();
		}
		else if (frogger[0] < 121 && frogger[0] > 88) {
			frogger[0] = lilypads[1];
			frogger[4] = 0;			
			win_round();
		}
		else if (frogger[0] < 207 && frogger[0] > 167) {
			frogger[0] = lilypads[2];
			frogger[4] = 0;
			win_round();
		}
		else if (frogger[0] < 291 && frogger[0] > 251) {
			frogger[0] = lilypads[3];
			frogger[4] = 0;
			win_round();
		}
		else if (frogger[0] < 371 && frogger[0] > 343) {
			frogger[0] = lilypads[4];
			frogger[4] = 0;
			win_round();
		}
		else {
			kill_frogger();
		}
	}
}		
		
function win_round(){
	row_reached = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	for (var j in frogger) {
		frogger[j] = frogger_start[j];
	}
	score += 50;
	if (num_success != 4) {
		num_success++;
	}
	else {
		num_success = 0;
		score += 1000;
		increase_level();
	}
	index_in_row = 0;
}	
function increase_level() {

	level++;
	for (var i in cars_L1) {
		cars_L1[i][4]++;
	}
	for (var i in cars_L2) {
		cars_L2[i][4]++;
	}
	for (var i in cars_L3) {
		cars_L3[i][4]++;
	}
	for (var i in cars_R1) {
		cars_R1[i][4]++;
	}
	for (var i in cars_R2) {
		cars_R2[i][4]++;
	}
	for (var i in logs_1) {
		logs_1[i][4]++;
	}
	for (var i in logs_2) {
		logs_2[i][4]++;
	}
	for (var i in logs_3) {
		logs_3[i][4]++;
	}
	for (var i in logs_4) {
		logs_4[i][4]++;
	}
	for (var i in logs_5) {
		logs_5[i][4]++;
	}
}
function detect_log_hit() {
	var on_log = 0;
	if (index_in_row == 6 || index_in_row == 12) {
		frogger[4] = 0;
	}
	if (index_in_row == 7) {
		for (var i in logs_5) {	
			if ((frogger[0] < logs_5[i][0] + logs_5[i][2]) &&
				((frogger[0] + frogger[2]) > logs_5[i][0])){
				frogger[4] = logs_5[i][4];
				on_log = 1;
				break;
			}
		}
		if (on_log == 0){
			kill_frogger();
		}
	}
	else if (index_in_row == 8) {
		for (var i in logs_4) {	
			if ((frogger[0] < logs_4[i][0] + logs_4[i][2]) &&
				((frogger[0] + frogger[2]) > logs_4[i][0])){
				frogger[4] = logs_4[i][4];
				on_log = 1;
				break;
			}
		}
		if (on_log == 0){
			kill_frogger();
		}
	}
	else if (index_in_row == 9) {
		for (var i in logs_3) {	
			if ((frogger[0] < logs_3[i][0] + logs_3[i][2]) &&
				((frogger[0] + frogger[2]) > logs_3[i][0])){
				frogger[4] = logs_3[i][4];
				on_log = 1;
				break;
			}
		}
		if (on_log == 0){
			kill_frogger();
		}
	}
	else if (index_in_row == 10) {
		for (var i in logs_2) {	
			if ((frogger[0] < logs_2[i][0] + logs_2[i][2]) &&
				((frogger[0] + frogger[2]) > logs_2[i][0])){
				frogger[4] = logs_2[i][4];
				on_log = 1;
				break;
			}
		}
		if (on_log == 0){
			kill_frogger();
		}
	}
	else if (index_in_row == 11) {
		for (var i in logs_1) {	
			if ((frogger[0] < logs_1[i][0] + logs_1[i][2]) &&
				((frogger[0] + frogger[2]) > logs_1[i][0])){
				frogger[4] = logs_1[i][4];
				on_log = 1;
				break;
			}
		}
		if (on_log == 0){
			kill_frogger();
		}
	}
}

function detect_car_hit() {
	if (index_in_row == 1) {
		for (var i in cars_L3) {
			if ((frogger[0] < cars_L3[i][0] + cars_L3[i][2]) &&
				((frogger[0] + frogger[2]) > cars_L3[i][0])){
				kill_frogger();
				break;
			}
		}
	}
	if (index_in_row == 2) {
		for (var i in cars_R2) {
			if ((frogger[0] < cars_R2[i][0] + cars_R2[i][2]) &&
				((frogger[0] + frogger[2]) > cars_R2[i][0])){
				kill_frogger();
				break;
			}
		}
	}
	if (index_in_row == 3) {
		for (var i in cars_L2) {
			if ((frogger[0] < cars_L2[i][0] + cars_L2[i][2]) &&
				((frogger[0] + frogger[2]) > cars_L2[i][0])){
				kill_frogger();
				break;
			}
		}
	}
	if (index_in_row == 4) {
		for (var i in cars_R1) {
			if ((frogger[0] < cars_R1[i][0] + cars_R1[i][2]) &&
				((frogger[0] + frogger[2]) > cars_R1[i][0])){
				kill_frogger();
				break;
			}
		}
	}
	if (index_in_row == 5) {
		for (var i in cars_L1) {
			if ((frogger[0] < cars_L1[i][0] + cars_L1[i][2]) &&
				((frogger[0] + frogger[2]) > cars_L1[i][0])){
				kill_frogger();
				break;
			}
		}
	}
}

function move_frogger() {
	frogger[0] += frogger[4];
}

function kill_frogger() {
	for (var j in frogger) {
		frogger[j] = frogger_start[j];
	}
	index_in_row = 0;
	num_lives--;
	row_reached = [0,0,0,0,0,0,0,0,0,0,0,0,0];
}


