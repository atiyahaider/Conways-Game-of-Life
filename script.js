function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const SLOW = 800;
const MED = 500;
const FAST = 100;
const DEFAULT_ROWS = 30;
const DEFAULT_COLS = 50;

const Controls = ({
  startStop,
  clearBoard,
  randomizeSeed,
  selectSpeed,
  selectGrid,
  generation }) =>
{
  const handleSelectSpeed = e => {
    selectSpeed(e.target.value);
  };

  const handleSelectGrid = e => {
    selectGrid(e.target.value);
  };

  return (
    React.createElement("div", { id: "controls" },
    React.createElement("button", { onClick: startStop }, "Start/Stop"),
    React.createElement("button", { onClick: clearBoard }, "Clear"),
    React.createElement("button", { onClick: randomizeSeed }, "Random"),
    React.createElement("select", { onChange: handleSelectSpeed },
    React.createElement("option", { value: "0", selected: "selected" }, "Speed"),

    React.createElement("option", { value: "1" }, "Slow"),
    React.createElement("option", { value: "2" }, "Medium"),
    React.createElement("option", { value: "3" }, "Fast")),

    React.createElement("select", { onChange: handleSelectGrid },
    React.createElement("option", { value: "0", selected: "selected" }, "Grid Size"),

    React.createElement("option", { value: "1" }, "20x10"),
    React.createElement("option", { value: "2" }, "50x30"),
    React.createElement("option", { value: "3" }, "70x50")),

    React.createElement("h2", { id: "generation" }, "Generations: ",
    React.createElement("span", null, generation))));
};

const Cell = ({ id, value, selectCell }) => {
  const handleClick = e => {
    selectCell(e.target.getAttribute("id"));
  };

  return (
    //depending on the value of the cell, class is set to either alive or dead
    React.createElement("div", {
      id: id,
      className: "cell " + (value ? "cell-alive" : "cell-dead"),
      onClick: handleClick }));
};

const GameBoard = ({ board, cols, selectCell }) => {
  return (
    //each cell is 15px * 15px and has a border of 1px on each side, so total width of a cell will be 17px
    //Multiply 17px by the number of colummns to get the width of the board
    React.createElement("div", {
      id: "board",
      style: {
        width: cols * 17 + "px",
        gridTemplateColumns: "repeat(" + cols + ", 1fr)" } },

    board.map((row, i) =>
    row.map((val, j) =>
    React.createElement(Cell, { id: i + "_" + j, value: val, selectCell: selectCell })))));
};

class GameOfLife extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "selectCell",
    id => {
      let idArr = id.split("_");
      let boardCopy = cloneArray(this.state.board);
      boardCopy[idArr[0]][idArr[1]] = !boardCopy[idArr[0]][idArr[1]];
      this.setState({ board: boardCopy });
    });_defineProperty(this, "startStop",

    () => {
      if (this.state.running) {
        clearInterval(this.intervalId);
        this.setState({ running: false });
      } else this.playGame();
    });_defineProperty(this, "clearBoard",

    () => {
      clearInterval(this.intervalId);
      this.setState({
        board: Array(this.rows).
        fill().
        map(() => Array(this.cols).fill(0)),
        generation: 0,
        running: false });

    });_defineProperty(this, "randomizeSeed",

    async () => {
      await this.clearBoard();
      let boardCopy = cloneArray(this.state.board);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          if (Math.floor(Math.random() * 4) === 1) boardCopy[i][j] = 1;
        }
      }

      this.setState({ board: boardCopy });
      this.playGame();
    });_defineProperty(this, "selectSpeed",

    speed => {
      switch (speed) {
        case "1":
          this.speed = SLOW;
          this.playGame();
          break;
        case "2":
          this.speed = MED;
          this.playGame();
          break;
        case "3":
          this.speed = FAST;
          this.playGame();
          break;
        default:
          this.speed = FAST;
          this.playGame();}

    });_defineProperty(this, "selectGrid",

    async size => {
      switch (size) {
        case "1":
          this.rows = 10;
          this.cols = 20;
          break;
        case "2":
          this.rows = 30;
          this.cols = 50;
          break;
        case "3":
          this.rows = 50;
          this.cols = 70;
          break;
        default:
          this.rows = 30;
          this.cols = 50;}

      this.clearBoard();
    });_defineProperty(this, "playGame",

    () => {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.play, this.speed);
    });_defineProperty(this, "play",
    () => {
      let board = this.state.board;
      let boardCopy = cloneArray(this.state.board);

      //check neighbouring cells, to count the live neighbours for each cell
      //check for boundaries
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          let neighbour = 0;
          if (i > 0) {
            if (board[i - 1][j])
              //top
              neighbour++;
            if (j > 0 && board[i - 1][j - 1])
              //top left diagonal
              neighbour++;
            if (j < this.cols - 1 && board[i - 1][j + 1])
              //top right diagonal
              neighbour++;
          }
          if (j > 0 && board[i][j - 1])
            //left
            neighbour++;
          if (j < this.cols - 1 && board[i][j + 1])
            //right
            neighbour++;
          if (i < this.rows - 1) {
            if (board[i + 1][j])
              //bottom
              neighbour++;
            if (j > 0 && board[i + 1][j - 1])
              //bottom left diagonal
              neighbour++;
            if (j < this.cols - 1 && board[i + 1][j + 1])
              //bottom right diagonal
              neighbour++;
          }

          //determine if a cell should live or die
          if (board[i][j] && (neighbour < 2 || neighbour > 3))
            //live cell with less than 2 or more than 3 neighbours dies
            boardCopy[i][j] = 0;
          if (!board[i][j] && neighbour === 3)
            //dead cell with 3 neighbours becomes alive
            boardCopy[i][j] = 1;
        }
      }

      this.setState({
        board: boardCopy,
        generation: this.state.generation + 1,
        running: true });

    });_defineProperty(this, "displayInfo",

    () => {
      this.setState({ showInfo: true });
    });_defineProperty(this, "closeInfo",

    () => {
      this.setState({ showInfo: false });
    });this.rows = DEFAULT_ROWS;this.cols = DEFAULT_COLS;this.speed = FAST;this.intervalId = "";this.state = { board: Array(this.rows).fill().map(() => Array(this.cols).fill(0)), generation: 0, running: false, showInfo: false };}componentDidMount() {this.randomizeSeed();}

  render() {
    return (
      React.createElement("div", null,
      React.createElement("header", null,
      React.createElement("h1", null, "Conway's Game Of Life"),
      React.createElement("div", { id: "info", onClick: this.displayInfo },
      React.createElement("i", { className: "fas fa-info-circle fa-2x" }))),

      React.createElement("div", { id: "canvas" },
      React.createElement(Controls, {
        startStop: this.startStop,
        clearBoard: this.clearBoard,
        randomizeSeed: this.randomizeSeed,
        selectSpeed: this.selectSpeed,
        selectGrid: this.selectGrid,
        generation: this.state.generation }),

      React.createElement(GameBoard, {
        board: this.state.board,
        cols: this.cols,
        selectCell: this.selectCell }),

      React.createElement(ReactModal, {
        isOpen: this.state.showInfo,
        contentLabel: "Information",
        onRequestClose: this.closeInfo,
        shouldCloseOnOverlayClick: true,
        style: {
          overlay: {
            backgroundColor: "rgba(255, 255, 255, 0.85)" },

          content: {
            background: "gray",
            color: "black" } } },

      React.createElement("div", { id: "close-div", onClick: this.closeInfo },
      React.createElement("i", { id: "close", class: "fas fa-times" })),

      React.createElement("div", null,
      React.createElement("h1", { className: "info-heading" }, "Information"), React.createElement("br", null),
      React.createElement("p", null, "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. The game is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves, or, for advanced players, by creating patterns with particular properties."),

      React.createElement("br", null), React.createElement("br", null),
      React.createElement("h2", { className: "info-heading" }, "Rules"), React.createElement("br", null),
      React.createElement("p", null, "The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:"),

      React.createElement("br", null),
      React.createElement("ul", null,
      React.createElement("li", null, "Any live cell with fewer than two live neighbours dies, as if by underpopulation."),
      React.createElement("li", null, "Any live cell with two or three live neighbours lives on to the next generation."),
      React.createElement("li", null, "Any live cell with more than three live neighbours dies, as if by overpopulation."),
      React.createElement("li", null, "Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.")),
      React.createElement("br", null),
      React.createElement("p", null, "The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations."),
      React.createElement("br", null),
      React.createElement("p", null, "Learn more about ", React.createElement("strong", null, "Conway's Game of Life"), " at ", React.createElement("a", { target: "_blank",
        href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" }, "Wikipedia.")))))));
  }}


const Footer = () => {
  return (
    React.createElement("div", { id: "footer" },
    React.createElement("p", null, "Designed and coded by"),
    React.createElement("a", {
      target: "_blank",
      href: "https://s.codepen.io/atiyahaider/debug/oaZxeb/dGrXWdOKgPWM" }, "Atiya Haider")));
};

const GameOfLifeWrapper = () => {
  return (
    React.createElement("div", null,
    React.createElement(GameOfLife, null),
    React.createElement(Footer, null)));
};

ReactDOM.render(React.createElement(GameOfLifeWrapper, null), document.getElementById("gameOfLife"));

function cloneArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}