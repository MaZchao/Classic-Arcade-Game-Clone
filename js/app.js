// 这是我们的玩家要躲避的敌人 
var Enemy = function ({ id, position, line, speed }) {
  // 要应用到每个敌人的实例的变量写在这里
  // 我们已经提供了一个来帮助你实现更多
  this.id = id;
  this.position = position;
  if (position === 'left') { // 虫子的起始位置
    this.x = -100;
  } else {
    this.x = 500;
  }
  this.y = line * 80; // 虫子所在的列数
  this.speed = speed;
  // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
  this.sprite = position === 'left' ? 'images/enemy-bug.png' : 'images/enemy-bug-right.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function (dt) {
  // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
  // 都是以同样的速度运行的
  if (this.isOut()) { // 如果虫子已经移动出了边界，则在allEnemies数组中删除掉他
    this.destroy();
  }
  if (player) {
    if (this.y === player.y && Math.abs(player.x - this.x) <= 30) { // 玩家碰上了虫子
      player.reset();
    }
  }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  if (!this.isMoving) this.startMoving();
};

/** 
 * 虫子开始移动
 */
Enemy.prototype.startMoving = function () {
  this.isMoving = true;
  const speed = this.speed;
  setInterval(() => { // 根据位置决定向左还是向右移动，根据speed决定移动的速度。
    if (this.position === 'left') {
      this.x += (2 * this.speed);
    } else if (this.position === 'right') {
      this.x -= (2 * this.speed);
    }
  }, 15)
}

/** 
 * 判断虫子是否已经出了边界
 */
Enemy.prototype.isOut = function () {
  if (this.position === 'left') {
    return this.x > 500;
  } else if (this.position === 'right') {
    return this.x < -100;
  }
}

/** 
 * 从allEnemies数组中删除掉此实例
 */
Enemy.prototype.destroy = function () {
  const index = allEnemies.findIndex((item) => {
    return item.id === this.id;
  })
  allEnemies.splice(index, 1);
}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
class Player {
  constructor(x, y) {
    this.sprite = 'images/char-boy.png';
    this.startPoint = { x: 200, y: 400 };
    this.x = this.startPoint.x;
    this.y = this.startPoint.y;
  }

  update(dt) {
    if (this.y === 0) { // 走到了最上方
      gameSuccess();
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(key) {
    if (!key) return
    switch (key) {
      case 'up':
        if (this.y > 0) { // 不能移出边界
          this.y -= 80;
        }
        break;
      case 'down':
        if (this.y < 400) {
          this.y += 80;
        }
        break;
      case 'left':
        if (this.x > 0) {
          this.x -= 100;
        }
        break;
      case 'right':
        if (this.x < 400) {
          this.x += 100;
        }
        break;
      default:
        break;
    }
  }

  /** 
   * 将玩家放回起始位置。
  */
  reset() {
    this.x = this.startPoint.x;
    this.y = this.startPoint.y;
  }
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
const player = new Player();
const allEnemies = [];
createEnemies();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

let enemyId = 1;
/** 
 * 每隔一段随机的时间生成一个随机的虫子（200ms-1800ms之间生成），这些虫子具有不同的：
 * id：标识。
 * position-位置：从地图的左边或者右边出现。
 * line-行数：1-3行。
 * speed-速度：1速-3速，每个档位相应增加2/15ms的移动速度。
 */
function createEnemies() {
  (function createEnemy() {
    const randomInterval = Math.round(Math.random() * (2000 - 200)) + 200;
    setTimeout(() => {
      const position = Math.random() >= 0.5 ? 'left' : 'right';
      const line = Math.round(Math.random() * (3 - 1)) + 1;
      const speed = Math.round(Math.random() * (3 - 1)) + 1;
      const id = enemyId;
      allEnemies.push(new Enemy({ id, position, line, speed }));
      enemyId++;
      createEnemy();
    }, randomInterval)
  }())
}

// 再来一局按钮的事件绑定
document.getElementById('restart-button').addEventListener('click', () => {
  restart();
})

// 重新开始
function restart() {
  player.reset();
  removeClass(document.getElementById('success-toast'), 'show');
}

// 游戏成功弹窗
function gameSuccess() {
  addClass(document.getElementById('success-toast'), 'show');
}

function hasClass(el, className) {
  var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

function addClass(el, className) {
  if (!hasClass(el, className)) {
    var newClasses = el.className.split(' ');
    newClasses.push(className);
    el.className = newClasses.join(' ');
  }
}

function removeClass(el, className) {
  if (hasClass(el, className)) {
    var oldClasses = el.className.split(' ');
    var newClasses = [];
    for (var i = 0; i < oldClasses.length; i++) {
      if (oldClasses[i] !== className) {
        newClasses.push(oldClasses[i]);
      }
    }
    el.className = newClasses.join(' ');
  }
}
