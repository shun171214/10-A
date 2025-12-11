const c = document.getElementById('c');
const ctx = c.getContext('2d');

// ===== パラメータだけで遊べる CONFIG =====
const CONFIG = {
  radius: 16,              // ボール半径
  speed:  220,             // 1秒あたりの速さ(px/sec)
  dir:    { x: 1, y: -1 }, // 初期方向（正/負）
  color:  '',       // ボール色
  trail:  0.0              // 0.0: 残像なし, 0.15 で残像演出
};

// ===== 状態 =====
let x = c.width * 0.25, y = c.height * 0.5;
let vx = CONFIG.speed * CONFIG.dir.x;
let vy = CONFIG.speed * CONFIG.dir.y;

let last = performance.now();

function update(dt) {

  //自分ルール　白なら停止
  if (rgb.r === 255 && rgb.g === 255 && rgb.b === 255) {
    vx = 0;
    vy = 0;
  }

  // 位置更新（dt は “秒”）
  x += vx * dt;
  y += vy * dt;
  

  // ===== TODO-1: 左右の壁で反射（vx を反転 & めり込み補正） =====
  const r = CONFIG.radius;

  if (x + r > c.width || x - r < 0)  vx *= -1;

  // ===== TODO-2: 上下の壁で反射（vy を反転 & めり込み補正） =====

    if (y + r > c.height || y - r < 0) vy *= -1;

}


function draw() {
  // クリア or 残像
  if (CONFIG.trail > 0) {
    ctx.fillStyle = `rgba(15,23,48,${CONFIG.trail})`;
    ctx.fillRect(0,0,c.width,c.height);
  } else {
    ctx.clearRect(0,0,c.width,c.height);
  }

  // ボール
  ctx.fillStyle = CONFIG.color;
  ctx.beginPath();
  ctx.arc(x, y, CONFIG.radius, 0, Math.PI*2);
  ctx.fill();
}

function loop(now) {
  const dt = (now - last) / 1000; // 秒
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

//色彩調整
    const rgbkey = { r: false, g: false, b: false };//各キーが押されているか判定
    const rgb = { r: 0, g: 0, b: 0 };
    const rgbspeed = 1; // 色要素の増加速度

    document.addEventListener('keydown', (e) => {
      const key = e.key;
      rgbkey[key] = true;

      //スペースで色と速度をリセット
      if (key === ' ') {
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = 0;

        vx = CONFIG.speed * CONFIG.dir.x;
        vy = CONFIG.speed * CONFIG.dir.y;
      }

    });

    document.addEventListener('keyup', (e) => {
      const key = e.key;
      rgbkey[key] = false;
    });

    function updatecolor() {
      for (const key in rgbkey) {
        if (rgbkey[key]) {
          rgb[key] = Math.min(255, rgb[key] + rgbspeed);
        }
      }

      CONFIG.color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

      requestAnimationFrame(updatecolor);
    }

    updatecolor();


// ==== TODO-3:キーで微調整（任意）：上下で速さ、左右で半径 ====
addEventListener('keydown', e=>{
  if (e.key === 'ArrowUp')    { CONFIG.speed += 20;  const s = CONFIG.speed/Math.hypot(vx,vy); vx*=s; vy*=s; }
  if (e.key === 'ArrowDown')  { CONFIG.speed = Math.max(40, CONFIG.speed-20); const s=CONFIG.speed/Math.hypot(vx,vy); vx*=s; vy*=s; }
  if (e.key === 'ArrowLeft')  { CONFIG.radius = Math.max(6, CONFIG.radius-2); }
  if (e.key === 'ArrowRight') { CONFIG.radius = Math.min(60, CONFIG.radius+2); }
});
