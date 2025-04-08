# Super X and O

## Overview
Super X and O is an advanced version of the classic Tic-Tac-Toe game. This project introduces new rules and mechanics to make the game more engaging and strategic. The game is designed for two players and can be played on a larger grid with additional winning conditions.

## Rules of Super X and O

1. **Super Board Structure**: The game is played on a 3x3 Super Board, where each cell contains a smaller Tic-Tac-Toe game (Mini Board).
2. **Turn-Based Play**: Players take turns placing their symbol (X or O) in one of the cells of a Mini Board.
3. **Mini Board Navigation**: The cell chosen by a player in the current Mini Board determines the Mini Board where the next player must play.
4. **Blocked Mini Boards**: If the determined Mini Board is already completed (either won or drawn), the next player can choose any other available Mini Board.
5. **Winning a Mini Board**: A Mini Board is won when a player aligns 3 of their symbols horizontally, vertically, or diagonally within that Mini Board.
6. **Winning the Super Board**: A player wins the game by achieving a line of 3 Mini Board wins (horizontally, vertically, or diagonally) on the Super Board.
7. **Draw Condition**: If all Mini Boards are completed and no player achieves a winning line on the Super Board, the game ends in a draw.


### Steps to Download
1. Open a terminal or command prompt.
2. Clone the repository using the following command:
  ```bash
  git clone https://github.com/your-HarshilD05/super_xo.git
  ```
3. Navigate to the project directory:
  ```bash
  cd super_xo
  ```

### Steps to Run
1. Install the required dependencies by running:
  ```bash
  npm install
  ```
2. Start the development server:
  ```bash
  npm run dev
  ```
3. Open your browser and navigate to the provided local development URL to start playing Super X and O.

## License
This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code as per the license terms.

## Enjoy playing Super X and O!