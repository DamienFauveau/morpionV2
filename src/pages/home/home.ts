import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	squares = Array(9).fill(null); //initialisation
	player = 'X';
	winner = null;
	nb = 0;

	constructor(public navCtrl: NavController, private alertCtrl: AlertController) {

	}

	get gameStatusMessage(){
		if(this.winner) {
			if(this.nb == 0) { // empeche boucle infinie
				this.presentConfirm();
				this.nb++;
			}
			return '"' + this.winner + '" a gagné !'; // si victoire
		}
		else {
			if(this.cellsEmpty()) { // si il reste des cases
				return 'Au tour de "' + this.player + '"';
			}
			if(this.nb == 0) { // empeche boucle infinie
				this.presentConfirm();
				this.nb++;
			}
			return 'Match nul'; // sinon match nul
		}
	}

	presentConfirm() {
		let alert = this.alertCtrl.create({ // quand la partie est finie
			title: 'Partie terminée',
			message: 'Voulez vous refaire une partie ?',
			buttons: [
			{
				text: 'Annuler', // ne fait rien
				role: 'cancel'
			},
			{
				text: 'Recommencer', // reinitialise la partie
				handler: () => {
					this.restartGame();
				}
			}
			]
		});
		alert.present();
	}

	handleMove(position) {
		if(!this.winner && !this.squares[position] ) { // si pas de gagnant et pas deja rempli
			this.squares[position] = this.player; // affecte la case au joueur
			if(this.winnigMove()) { // si le point fait gagner
				this.winner = this.player;
			}
			if (this.player == 'X') // sinon au tour du joueur suivant
				this.player = 'O';
			else
				this.player = 'X';
		}
		console.log(this.player);
	}

	iaTurn() {
		let rnd = 0;
		const conditions = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
		[0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
		[0, 4, 8], [2, 4, 6]             // diagonales
		];
		if(this.cellsEmpty()) { // si il reste des cases de libre
			do {
				rnd = Math.floor((Math.random()*8)); // nombre random
				for (let condition of conditions) { // parcourt les cases qui completent une rangée pour contrer le joueur adverse
					if ( this.squares[condition[0]] && this.squares[condition[0]] === this.squares[condition[1]] && this.squares[condition[1]] && !this.squares[condition[2]] && this.squares[condition[1]] != this.player) {
						rnd = condition[2];
					}
					else if ( this.squares[condition[0]] && this.squares[condition[0]] === this.squares[condition[2]] && this.squares[condition[2]] && !this.squares[condition[1]] && this.squares[condition[2]] != this.player) {
						rnd = condition[1];
					}
					else if ( this.squares[condition[1]] && this.squares[condition[1]] === this.squares[condition[2]] && this.squares[condition[2]] && !this.squares[condition[0]] && this.squares[condition[2]] != this.player) {
						rnd = condition[0];
					}
				}

				for (let condition of conditions) { // parcourt les cases qui completent une rangée pour faire gagner le joueur
					if ( this.squares[condition[0]] && this.squares[condition[0]] === this.squares[condition[1]] && this.squares[condition[1]] && !this.squares[condition[2]] && this.squares[condition[1]] == this.player) {
						rnd = condition[2];
					}
					else if ( this.squares[condition[0]] && this.squares[condition[0]] === this.squares[condition[2]] && this.squares[condition[2]] && !this.squares[condition[1]] && this.squares[condition[2]] == this.player) {
						rnd = condition[1];
					}
					else if ( this.squares[condition[1]] && this.squares[condition[1]] === this.squares[condition[2]] && this.squares[condition[2]] && !this.squares[condition[0]] && this.squares[condition[2]] == this.player) {
						rnd = condition[0];
					}
				}
			}
			while(this.squares[rnd]); // tant que la case n'est pas vide on recommence
			setTimeout(() => this.handleMove(rnd), 500); // on attend un peu avant de jouer
		}
	}

	cellsEmpty() {
		for(let i = 0 ; i < this.squares.length ; i++) { 
			if(!this.squares[i]) { // si il reste des cases
				return true;
			}
		}
		return false;
	}

	winnigMove() { // conditions pour gagner
		const conditions = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
		[0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
		[0, 4, 8], [2, 4, 6]             // diagonales
		];
		for (let condition of conditions) { // verifie si un joueur a gagné
			if ( this.squares[condition[0]] && this.squares[condition[0]] === this.squares[condition[1]] && this.squares[condition[1]] === this.squares[condition[2]]) {
				return true;
			}
		}
		return false;
	}

	restartGame() {
		this.squares = Array(9).fill(null); // reinitialisation
		this.player = 'X';
		this.winner = null;
		this.nb = 0;
	}

}