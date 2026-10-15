/*
 * かまくら往来 広告表示スクリプト
 * Googleスプレッドシート（「ウェブに公開」したCSV）から広告の内容を読み込み、
 * 各ページの広告枠（data-ad-slot="ad1" など）に表示します。
 *
 * ★設定するのは、下の1行だけです。
 *   '' の中に、スプレッドシートを「ウェブに公開」して得たCSVのURLを貼り付けてください。
 */
var SHEET_CSV_URL ='https://docs.google.com/spreadsheets/d/e/2PACX-1vQA2oCzrL35x4e3nfjBB5_a-7u4Fksa20ilXN0E5ok1a8KeURvRC9vGXZNOZUMH3cL9W1fDdiJlRwwf/pub?gid=1100192650&single=true&output=csv';

(function () {
  var slots = document.querySelectorAll('[data-ad-slot]');
  if (!slots.length) return;

  // URLが未設定のあいだは、広告枠の目印（点線の枠）をそのまま表示します
  if (!SHEET_CSV_URL) {
    if (window.console) console.warn('ads.js: SHEET_CSV_URL が未設定です');
    return;
  }

  // 読み込みが終わるまで（失敗したときも）、広告枠は表示しません
  Array.prototype.forEach.call(slots, function (s) { s.hidden = true; });

  // CSV（カンマ区切り）を読み取ります。セル内の改行・引用符にも対応
  function parseCSV(t) {
    t = t.replace(/^\uFEFF/, '');
    var rows = [], row = [], f = '', q = false, i, c;
    for (i = 0; i < t.length; i++) {
      c = t.charAt(i);
      if (q) {
        if (c === '"') { if (t.charAt(i + 1) === '"') { f += '"'; i++; } else { q = false; } }
        else { f += c; }
      } else if (c === '"') { q = true; }
      else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
      else if (c !== '\r') { f += c; }
    }
    if (f !== '' || row.length) { row.push(f); rows.push(row); }
    return rows;
  }

  // シートの行 → { 枠ID: {on, code, url, text} }
  // 列：A=枠ID / B=掲載場所（メモ） / C=表示（ON・OFF） / D=広告コード / E=リンクURL / F=リンク文言
  function toMap(csv) {
    var map = {}, found = false;
    parseCSV(csv).forEach(function (r) {
      var id = (r[0] || '').trim().toLowerCase();
      if (!/^(ad|furusato)\d+$/.test(id)) return;   // 見出し行・説明行は無視
      found = true;
      map[id] = {
        on: (r[2] || '').trim().toUpperCase() === 'ON',
        code: (r[3] || '').trim(),
        url: (r[4] || '').trim(),
        text: (r[5] || '').trim()
      };
    });
    return found ? map : null;
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 表示するHTMLを決めます（広告コードを優先。なければ簡易リンク）
  function buildHTML(rec) {
    if (!rec || !rec.on) return '';
    if (rec.code) return rec.code;
    if (/^https?:\/\//i.test(rec.url)) {
      return '<a href="' + esc(rec.url) + '" target="_blank" rel="nofollow sponsored noopener">' +
             esc(rec.text || rec.url) + '</a>';
    }
    return '';
  }

  // innerHTMLでは動かない <script> を動くように作り直します
  function setHTML(el, html) {
    el.innerHTML = html;
    Array.prototype.forEach.call(el.querySelectorAll('script'), function (old) {
      var s = document.createElement('script');
      Array.prototype.forEach.call(old.attributes, function (a) { s.setAttribute(a.name, a.value); });
      s.text = old.text;
      old.parentNode.replaceChild(s, old);
    });
  }

  function apply(map) {
    var grids = [];
    Array.prototype.forEach.call(slots, function (slot) {
      var id = slot.getAttribute('data-ad-slot').toLowerCase();
      var html = buildHTML(map[id]);
      var body = slot.querySelector('.ad-body') || slot;
      if (!html) { slot.hidden = true; }
      else {
        setHTML(body, html);
        slot.classList.add('has-ad');
        slot.hidden = false;
      }
      var g = slot.closest('.furusato-grid');
      if (g && grids.indexOf(g) < 0) grids.push(g);
    });
    // ふるさと納税の並びは、中の広告が1つも表示されないときは、まとめて隠します
    grids.forEach(function (g) { g.hidden = !g.querySelector('[data-ad-slot]:not([hidden])'); });
  }

  fetch(SHEET_CSV_URL)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (text) {
      var m = toMap(text);
      if (!m) throw new Error('広告データが見つかりません');
      apply(m);
    })
    .catch(function (e) {
      if (window.console) console.warn('ads.js:', e);
      Array.prototype.forEach.call(document.querySelectorAll('.furusato-grid'), function (g) { g.hidden = true; });
    });
})();
