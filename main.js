// 澤井珈琲 ソーシャルギフト特集
(function () {
  'use strict';

  var ITEM_BASE = 'https://item.rakuten.co.jp/sawaicoffee-tea/';
  var GIFT_QUERY = '/?gift=social'; // 楽天の特集ページと同じ、ソーシャルギフト購入への導線

  // 1,000円 送料無料(メイン)。say=添えるひとこと
  var ITEMS_1000 = [
    { id: 'dp-tastingset', say: '昨日はごちそうさまでした。', name: '華の3種 飲みくらべ', sub: 'ドリップバッグ 9袋' },
    { id: 'dp-csr10p', say: '先日はありがとうございました。', name: '星降るブレンド 3種', sub: 'ドリップバッグ 10袋' },
    { id: 'flavortrialset', say: 'お誕生日おめでとう！', name: '甘い香りのフレーバーコーヒー', sub: 'バニラ・キャラメル・ヘーゼルナッツ 10袋' },
    { id: 'dp-13drip12', say: 'いつもお疲れさまです。', name: 'マグカップ派の13gドリップ', sub: '3種 10袋' },
    { id: 'dp-xsb80', say: '少し早いけどメリークリスマス！', name: 'クリスマスブレンド', sub: 'ドリップバッグ 10袋' },
    { id: 'dp-noncafedrip20p', say: '夜でも飲めるコーヒーをどうぞ。', name: 'カフェインレス飲みくらべ', sub: 'ドリップバッグ 3種 9袋' },
    { id: 'dp-bitter2s16', say: 'この前は助かりました！', name: 'ビター2種 飲みくらべ', sub: 'ドリップバッグ 16袋' },
    { id: '3in1cafe10p', say: 'コーヒーが苦手なあなたにも。', name: '3in1カフェ アソート', sub: 'カフェオレ・紅茶・ココア・抹茶など 10袋' }
  ];

  // 1,000円以上の人気ギフト(いずれもソーシャルギフト対応を確認済み 2026/11/5)
  var ITEMS_GIFT = [
    { id: 'dp-10pgift', name: 'ドリップバッグ ギフト', sub: '10袋', price: '1,760', from: true },
    { id: 'dp-dandy20gift', name: 'DANDY 13gドリップ', sub: '3種 20袋', price: '2,180' },
    { id: 'stickcakeset', name: 'ドリップ＆スティックケーキ', sub: 'コーヒー3種・ケーキ4本', price: '2,540' },
    { id: 'coffeegift200704', name: '氷温甘熟ドリップ ギフト', sub: '3箱セット', price: '2,800' },
    { id: 'picejellyset', name: 'アイスコーヒー＆珈琲ゼリー', sub: '選べる3セット', price: '2,880', from: true },
    { id: '6dripassortgift', name: 'ドリップ アソートギフト', sub: '6種 24袋', price: '2,980' },
    { id: 'gppgiftset', name: 'ドリップ＆3種のフィナンシェ', sub: '抹茶・カフェモカ・レモン', price: '3,060' },
    { id: 'dqgiftset', name: 'ドリップ＆ダックワーズ', sub: 'コーヒー2種・スイーツ2種', price: '3,080' }
  ];

  // FVのスマホ内で流す会話
  var CHATS = [
    { to: '先輩', say: '昨日はごちそうさまでした。', img: 'dp-tastingset', reply: 'わざわざありがとう！' },
    { to: '佐藤さん', say: '先日はありがとうございました。', img: 'dp-csr10p', reply: 'こちらこそ！うれしいです' },
    { to: 'ゆか', say: 'お誕生日おめでとう！', img: 'flavortrialset', reply: 'えっ、覚えててくれたの' }
  ];

  var TIMING = { typing: 900, gift: 900, reply: 1100, hold: 2600 };
  var CONFETTI_COUNT = 10;
  var CONFETTI_COLORS = ['#E60F2D', '#FFD23F', '#9BD236', '#8FD8EE', '#FFB6A8'];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html) node.innerHTML = html;
    return node;
  }

  function itemCard(item, withSay) {
    var a = el('a', 'item reveal');
    a.href = ITEM_BASE + item.id + GIFT_QUERY;
    var price = withSay
      ? '<b>1,000</b>円 <small>送料無料</small>'
      : '<b>' + item.price + '</b>円' + (item.from ? '〜' : '');
    a.innerHTML =
      (withSay ? '<p class="item-say">' + item.say + '</p>' : '') +
      '<div class="item-img"><img src="img/' + item.id + '.jpg" alt="' + item.name + '" width="640" height="640" loading="lazy"></div>' +
      '<p class="item-name">' + item.name + '</p>' +
      '<p class="item-sub">' + item.sub + '</p>' +
      '<p class="item-price">' + price + '</p>';
    return a;
  }

  function renderGrid(id, items, withSay) {
    var grid = document.getElementById(id);
    items.forEach(function (item) { grid.appendChild(itemCard(item, withSay)); });
  }

  function giftBubble(c) {
    return el('div', 'msg-gift',
      '<img src="img/' + c.img + '.jpg" alt="">' +
      '<p>コーヒーのギフトが届きました</p><span>ギフトを受け取る</span>');
  }

  function showChatStatic(chat, c) {
    chat.appendChild(el('div', 'msg msg-me', c.say));
    chat.appendChild(giftBubble(c));
    chat.appendChild(el('div', 'msg msg-you', c.reply));
  }

  function startChat() {
    var chat = document.getElementById('chat');
    var name = document.getElementById('chatName');
    var index = 0;

    if (reduceMotion) { showChatStatic(chat, CHATS[0]); return; }

    function play() {
      var c = CHATS[index];
      index = (index + 1) % CHATS.length;
      chat.innerHTML = '';
      name.textContent = c.to;
      var typing = el('div', 'typing', '<i></i><i></i><i></i>');
      chat.appendChild(typing);
      setTimeout(function () {
        chat.removeChild(typing);
        chat.appendChild(el('div', 'msg msg-me', c.say));
      }, TIMING.typing);
      setTimeout(function () { chat.appendChild(giftBubble(c)); }, TIMING.typing + TIMING.gift);
      setTimeout(function () { chat.appendChild(el('div', 'msg msg-you', c.reply)); },
        TIMING.typing + TIMING.gift + TIMING.reply);
      setTimeout(play, TIMING.typing + TIMING.gift + TIMING.reply + TIMING.hold);
    }
    play();
  }

  function startConfetti() {
    if (reduceMotion) return;
    var box = document.querySelector('.confetti');
    for (var i = 0; i < CONFETTI_COUNT; i++) {
      var p = document.createElement('i');
      var size = 8 + (i % 3) * 3;
      p.style.left = ((i * 100) / CONFETTI_COUNT + (i % 4)) + '%';
      p.style.width = size + 'px';
      p.style.height = (i % 2 ? size : size * 0.55) + 'px';
      p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      p.style.animationDuration = (11 + (i * 7) % 8) + 's';
      p.style.animationDelay = (-(i * 3.1) % 15) + 's';
      box.appendChild(p);
    }
  }

  function startReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function startFloatCta() {
    var cta = document.getElementById('floatCta');
    var fv = document.querySelector('.fv');
    var foot = document.querySelector('.foot');
    function update() {
      var pastFv = window.scrollY > fv.offsetHeight * 0.6;
      var atFoot = foot.getBoundingClientRect().top < window.innerHeight;
      cta.classList.toggle('show', pastFv && !atFoot);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  var CAMPAIGN_END = new Date('2026-12-01T09:59:00+09:00');
  var DAY_MS = 86400000;
  var HOUR_MS = 3600000;

  function startEventCountdown() {
    var left = document.getElementById('eventLeft');
    var remain = CAMPAIGN_END - new Date();
    if (remain <= 0) return;
    left.textContent = remain < DAY_MS
      ? 'あと' + Math.ceil(remain / HOUR_MS) + '時間'
      : 'あと' + Math.ceil(remain / DAY_MS) + '日';
    left.hidden = false;
  }

  renderGrid('grid1000', ITEMS_1000, true);
  renderGrid('gridGift', ITEMS_GIFT, false);
  startChat();
  startConfetti();
  startReveal();
  startFloatCta();
  startEventCountdown();
})();
