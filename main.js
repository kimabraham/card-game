const startSound = new Audio('./sound/start_sound.mp3');
const stopSound = new Audio('./sound/stop_sound.mp3');
const playingSound = new Audio('./sound/play_sound.mp3');
const collectSound = new Audio('./sound/collect_sound.mp3');
const winSound = new Audio('./sound/win_sound.mp3');
const loseSound = new Audio('./sound/lose_sound.wav');

const startBtn = document.getElementById('startBtn');
const mainEl = document.getElementById('main');
const cardContainer = document.getElementById('cardContainer');
const footer = document.getElementById('footer');
const cards = document.querySelectorAll('.card');

let isStart = 'ready';
let timer;
let leftTime = 29;
let leftCard = 8;
let isFirst = true;
let first = '';

const characters = [
  'Apeach',
  'Frodo',
  'JayG',
  'Kon',
  'Muzi',
  'Neo',
  'Ryan',
  'Tube',
];

function playTimeFunc() {
  document.getElementById('leftTime').innerText = leftTime--;
  if (leftTime < 0 && leftCard) {
    loseSound.play();
    clearInterval(timer);
    cardContainer.style.display = 'none';
    addImgEl('fail');
    footer.innerHTML = '<h1 class="fail">실패</h1>';
    startBtn.innerText = 'PLAY AGAIN';
    isStart = 'end';
  }
}

function removeEl(id) {
  document.getElementById(id).remove();
}

function cardShuffle() {
  const randomArray = [...new Array(16)].map((_, i, arr) =>
    i < 8 ? i + 1 : Number(`${arr.length - i}${arr.length - i}`)
  );
  randomArray.sort(() => Math.random() - 0.5);
  cards.forEach((card, i) => (card.id = randomArray[i]));
  cards.forEach((card) => {
    card.addEventListener('click', click);
    card.children[1].style.backgroundImage = `url('./imgs/${
      characters[Number(card.id[0]) - 1]
    }.jpg')`;
    card.style.transform = `rotateY(0deg)`;
  });
}

function addImgEl(type) {
  const imgEl = document.createElement('img');
  imgEl.setAttribute('src', `./imgs/${type}.jpg`);
  imgEl.setAttribute('draggable', false);
  imgEl.id = 'startImg';
  mainEl.append(imgEl);
}

function startGame() {
  if (isStart === 'ready') {
    leftTime = 29;
    playingSound.play();
    leftCard = 8;
    cardContainer.style.display = '';
    cardShuffle();
    isStart = 'ing';
    timer = setInterval(playTimeFunc, 1000);
    removeEl('startImg');
    startBtn.innerText = 'RESTART';
    return;
  }
  if (isStart === 'ing') {
    playingSound.pause();
    playingSound.currentTime = 0;
    // stopSound.play();
    leftTime = 30;
    document.getElementById('leftTime').innerText = 30;
    clearInterval(timer);
    startBtn.innerText = 'PLAY';
    cardContainer.style.display = 'none';
    addImgEl('welcome');
    isStart = 'ready';
    return;
  }
  if (isStart === 'end') {
    startBtn.innerText = 'PLAY';
    removeEl('startImg');
    addImgEl('welcome');
    footer.innerHTML = `
    <div>
      <span>TIME : </span>
      <span class="leftTime" id="leftTime">30</span>
    </div>
    <div>
      <span>LEFT CARDS : </span>
      <span class="leftCard" id="leftCard">8</span>
    </div>`;
    isStart = 'ready';
    return;
  }
}

function cardFlip(el, ang) {
  if (ang) {
    el.style.transform = `rotateY(${ang}deg)`;
  } else {
    setTimeout(() => (el.style.transform = `rotateY(${ang}deg)`), 400);
  }
}

function click(event) {
  let elem = event.currentTarget;
  if (elem.id === 'done') return;
  if (isFirst) {
    isFirst = false;
    first = elem.id;
    cardFlip(elem, 180);
  } else {
    isFirst = true;
    let elem = event.currentTarget;
    cardFlip(elem, 180);
    if (first[0] === elem.id[0]) {
      collectSound.play();
      collectSound.currentTime = 0;
      document.getElementById(first).id = 'done';
      document.getElementById(elem.id).id = 'done';
      leftCard--;
      document.getElementById('leftCard').innerText = leftCard;
      if (leftTime >= 0 && leftCard === 0) {
        playingSound.pause();
        playingSound.currentTime = 0;
        winSound.play();
        cardContainer.style.display = 'none';
        addImgEl('success');
        footer.innerHTML = '<h1 class="success">성공</h1>';
        clearInterval(timer);
        isStart = 'end';
      }
    } else {
      let firstEl = document.getElementById(first);
      cardFlip(firstEl, 0);
      cardFlip(elem, 0);
      first = null;
    }
  }
}

cardContainer.style.display = 'none';
startBtn.addEventListener('click', startGame);
