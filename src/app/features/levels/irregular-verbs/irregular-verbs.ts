import { Component } from '@angular/core';
interface Verb {
  base: string;
  past: string;
  participle: string;
  translation: string;
}

@Component({
  selector: 'app-irregular-verbs',
  imports: [],
  templateUrl: './irregular-verbs.html',
  styleUrl: './irregular-verbs.scss',
})
export class IrregularVerbs {
  verbs: Verb[] = [
    { base: 'Be', past: 'Was/Were', participle: 'Been', translation: 'Ser / Estar' },
    { base: 'Become', past: 'Became', participle: 'Become', translation: 'Llegar a ser' },
    { base: 'Begin', past: 'Began', participle: 'Begun', translation: 'Empezar' },
    { base: 'Break', past: 'Broke', participle: 'Broken', translation: 'Romper' },
    { base: 'Bring', past: 'Brought', participle: 'Brought', translation: 'Traer' },
    { base: 'Build', past: 'Built', participle: 'Built', translation: 'Construir' },
    { base: 'Buy', past: 'Bought', participle: 'Bought', translation: 'Comprar' },
    { base: 'Choose', past: 'Chose', participle: 'Chosen', translation: 'Elegir' },
    { base: 'Come', past: 'Came', participle: 'Come', translation: 'Venir' },
    { base: 'Do', past: 'Did', participle: 'Done', translation: 'Hacer' },
    { base: 'Drink', past: 'Drank', participle: 'Drunk', translation: 'Beber' },
    { base: 'Drive', past: 'Drove', participle: 'Driven', translation: 'Conducir' },
    { base: 'Eat', past: 'Ate', participle: 'Eaten', translation: 'Comer' },
    { base: 'Feel', past: 'Felt', participle: 'Felt', translation: 'Sentir' },
    { base: 'Find', past: 'Found', participle: 'Found', translation: 'Encontrar' },
    { base: 'Forget', past: 'Forgot', participle: 'Forgotten', translation: 'Olvidar' },
    { base: 'Get', past: 'Got', participle: 'Gotten', translation: 'Conseguir' },
    { base: 'Give', past: 'Gave', participle: 'Given', translation: 'Dar' },
    { base: 'Go', past: 'Went', participle: 'Gone', translation: 'Ir' },
    { base: 'Have', past: 'Had', participle: 'Had', translation: 'Tener' },
    { base: 'Know', past: 'Knew', participle: 'Known', translation: 'Saber' },
    { base: 'Leave', past: 'Left', participle: 'Left', translation: 'Salir' },
    { base: 'Make', past: 'Made', participle: 'Made', translation: 'Hacer' },
    { base: 'Read', past: 'Read', participle: 'Read', translation: 'Leer' },
    { base: 'Run', past: 'Ran', participle: 'Run', translation: 'Correr' },
    { base: 'Say', past: 'Said', participle: 'Said', translation: 'Decir' },
    { base: 'See', past: 'Saw', participle: 'Seen', translation: 'Ver' },
    { base: 'Send', past: 'Sent', participle: 'Sent', translation: 'Enviar' },
    { base: 'Sing', past: 'Sang', participle: 'Sung', translation: 'Cantar' },
    { base: 'Sleep', past: 'Slept', participle: 'Slept', translation: 'Dormir' },
    { base: 'Speak', past: 'Spoke', participle: 'Spoken', translation: 'Hablar' },
    { base: 'Spend', past: 'Spent', participle: 'Spent', translation: 'Gastar' },
    { base: 'Swim', past: 'Swam', participle: 'Swum', translation: 'Nadar' },
    { base: 'Take', past: 'Took', participle: 'Taken', translation: 'Tomar' },
    { base: 'Teach', past: 'Taught', participle: 'Taught', translation: 'Enseñar' },
    { base: 'Tell', past: 'Told', participle: 'Told', translation: 'Contar' },
    { base: 'Think', past: 'Thought', participle: 'Thought', translation: 'Pensar' },
    { base: 'Understand', past: 'Understood', participle: 'Understood', translation: 'Entender' },
    { base: 'Wear', past: 'Wore', participle: 'Worn', translation: 'Llevar puesto' },
    { base: 'Write', past: 'Wrote', participle: 'Written', translation: 'Escribir' },
  ];

  rowsPerPage = 15;

  get paginatedVerbs(): Verb[][] {
    const pages: Verb[][] = [];

    for (let i = 0; i < this.verbs.length; i += this.rowsPerPage) {
      pages.push(this.verbs.slice(i, i + this.rowsPerPage));
    }

    return pages;
  }

  printPage(): void {
    window.print();
  }
}
