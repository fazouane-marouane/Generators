// @ts-check
(function() {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
    "game-view"
  ));
  const ctx = canvas.getContext("2d");
  const gameScoreElement = document.getElementById("game-score");

  let oldGameState;
  let gameState;
  oldGameState = gameState = {
    player1Position: {
      x: 50,
      y: 0,
      w: 100,
      h: 30
    },
    player2Position: {
      x: 60,
      y: canvas.height - 30,
      w: 100,
      h: 30
    },
    ballPosition: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: 30,
      h: 30,
      direction: {
        x: 1,
        y: 1
      }
    },
    score: {
      p1: 0,
      p2: 0
    }
  };

  function drawItem(oldPosition, newPosition) {
    const height = 30;
    const modifier = (helper, position) =>
      helper(
        position.x - Math.floor(position.w / 2),
        position.y,
        position.w,
        position.h
      );
    oldPosition && modifier(ctx.clearRect.bind(ctx), oldPosition);
    modifier(ctx.fillRect.bind(ctx), newPosition);
  }

  function requestAnimationFrame() {
    return new Promise(window.requestAnimationFrame);
  }

  async function animate(f) {
    while (f(await requestAnimationFrame()));
  }

  function ease(current, target, progress) {
    function helper(current, target) {
      return Math.floor(current + ((target - current) * progress) / 100);
    }
    return {
      ...current,
      x: helper(current.x, target.x),
      y: helper(current.y, target.y)
    };
  }

  let lastToBeDrawn = {};
  async function render() {
    const currentGameState = gameState;
    const currentOldGameState = oldGameState;
    let start = undefined;
    const animationLoop = timestamp => {
      if (start === undefined) {
        start = timestamp;
      }
      function animationStep(target) {
        drawItem(lastToBeDrawn.ballPosition, target.ballPosition);
        drawItem(lastToBeDrawn.player1Position, target.player1Position);
        drawItem(lastToBeDrawn.player2Position, target.player2Position);
        lastToBeDrawn = target;
      }
      const progress = timestamp - start;
      if (progress > 100) {
        animationStep(currentGameState);
        return false;
      }
      const tmp = {
        ...currentGameState,
        player1Position: ease(
          currentOldGameState.player1Position,
          currentGameState.player1Position,
          progress
        ),
        player2Position: ease(
          currentOldGameState.player2Position,
          currentGameState.player2Position,
          progress
        ),
        ballPosition: ease(
          currentOldGameState.ballPosition,
          currentGameState.ballPosition,
          progress
        )
      };
      animationStep(tmp);
      return true;
    };

    await animate(animationLoop);
  }

  async function gameLoop() {
    // update 5 times every second
    let updateRate = 1000 / 5;
    let keyPresses = updateKeyPresses();
    while (true) {
      updateGameState(keyPresses);
      await render();
    }
  }

  function updateKeyPresses() {
    let keyPresses = {
      P1_left: 0,
      P1_right: 0,
      P2_left: 0,
      P2_right: 0,
      P1: 0,
      P2: 0
    };
    const mergeKeys = (left, right) => (!!left !== !!right ? left || right : 0);
    document.addEventListener("keydown", e => {
      switch (e.code) {
        case "ArrowLeft":
          keyPresses.P1_left = -1;
          break;
        case "ArrowRight":
          keyPresses.P1_right = 1;
          break;
        case "KeyC":
          keyPresses.P2_left = -1;
          break;
        case "KeyV":
          keyPresses.P2_right = 1;
          break;
      }
      keyPresses.P1 = mergeKeys(keyPresses.P1_left, keyPresses.P1_right);
      keyPresses.P2 = mergeKeys(keyPresses.P2_left, keyPresses.P2_right);
    });
    document.addEventListener("keyup", e => {
      switch (e.code) {
        case "ArrowLeft":
          keyPresses.P1_left = 0;
          break;
        case "ArrowRight":
          keyPresses.P1_right = 0;
          break;
        case "KeyC":
          keyPresses.P2_left = 0;
          break;
        case "KeyV":
          keyPresses.P2_right = 0;
      }
      keyPresses.P1 = mergeKeys(keyPresses.P1_left, keyPresses.P1_right);
      keyPresses.P2 = mergeKeys(keyPresses.P2_left, keyPresses.P2_right);
    });
    return keyPresses;
  }

  function updateGameState(keyPresses) {
    oldGameState = gameState;
    const step = 20;
    gameState = {
      ...gameState,
      ballPosition: {
        ...gameState.ballPosition,
        x: Math.floor(
          Math.min(
            Math.max(
              gameState.ballPosition.x +
                gameState.ballPosition.direction.x * step,
              gameState.ballPosition.w / 2
            ),
            canvas.width - gameState.ballPosition.w / 2
          )
        ),
        y: Math.floor(
          Math.min(
            Math.max(
              gameState.ballPosition.y +
                gameState.ballPosition.direction.y * step,
              0
            ),
            canvas.height - gameState.ballPosition.h
          )
        ),
        direction: {
          x:
            gameState.ballPosition.x <= gameState.ballPosition.w / 2
              ? 1
              : gameState.ballPosition.x >=
                canvas.width - gameState.ballPosition.w / 2
                ? -1
                : gameState.ballPosition.direction.x,
          y:
            gameState.ballPosition.y <= 0
              ? 1
              : gameState.ballPosition.y >=
                canvas.height - gameState.ballPosition.h
                ? -1
                : gameState.ballPosition.direction.y
        }
      },
      player1Position: {
        ...gameState.player1Position,
        x: Math.floor(
          Math.min(
            Math.max(
              gameState.player1Position.x + keyPresses.P1 * step,
              gameState.player1Position.w / 2
            ),
            canvas.width - gameState.player1Position.w / 2
          )
        )
      },
      player2Position: {
        ...gameState.player2Position,
        x: Math.floor(
          Math.min(
            Math.max(
              gameState.player2Position.x + keyPresses.P2 * step,
              gameState.player2Position.w / 2
            ),
            canvas.width - gameState.player2Position.w / 2
          )
        )
      }
    };
    if (
      gameState.ballPosition.direction.y === 1 &&
      gameState.ballPosition.y === 0 &&
      (gameState.player1Position.x + gameState.player1Position.w / 2 <
        gameState.ballPosition.x - gameState.ballPosition.w / 2 ||
        gameState.player1Position.x - gameState.player1Position.w / 2 >
          gameState.ballPosition.x + gameState.ballPosition.w / 2)
    ) {
      gameState.score = {
        ...gameState.score,
        p2: gameState.score.p2 + 1
      };
      gameScoreElement.innerHTML = `${gameState.score.p1}-${
        gameState.score.p2
      }`;
    }
    if (
      gameState.ballPosition.direction.y === 1 &&
      gameState.ballPosition.y === canvas.height - gameState.ballPosition.h &&
      (gameState.player2Position.x + gameState.player2Position.w / 2 <
        gameState.ballPosition.x - gameState.ballPosition.w / 2 ||
        gameState.player2Position.x - gameState.player2Position.w / 2 >
          gameState.ballPosition.x + gameState.ballPosition.w / 2)
    ) {
      gameState.score = {
        ...gameState.score,
        p1: gameState.score.p1 + 1
      };
      gameScoreElement.innerHTML = `${gameState.score.p1}-${
        gameState.score.p2
      }`;
    }
  }

  function pause(d) {
    return new Promise(resolve => setTimeout(resolve, d));
  }

  setTimeout(gameLoop);
})();
