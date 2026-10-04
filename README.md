# かまくら往来（鎌倉市 案内サイト）

## GitHub Pages への公開
1. このフォルダ内のファイル（*.html, style.css, ads.js, favicon.svg）をリポジトリ直下にアップロードします。
2. リポジトリの Settings → Pages で、Branch を「main」「/(root)」にして保存します。

## ページ構成
- index.html … トップ（見どころ・博物館・特産品・レクリエーション）
- map.html … 観光マップ（位置関係の模式図＋スポット一覧）
- kotsu.html … 交通（JR・江ノ電・湘南モノレール・路線バス）※時刻表なし
- matsuri.html … 祭り・行事
- areas.html … 地区紹介（5地域）
- shukuhaku.html … 宿泊ガイド
- ads.js … 広告表示スクリプト／kamakura_ads_sheet.xlsx … 広告管理シートのひな形
- unei.html … 運営者情報（運営者名・連絡先を記入してください）

## 広告枠（合計12枠・Googleスプレッドシートで管理）
広告は HTML に直接貼らず、Googleスプレッドシート（「ウェブに公開」したCSV）から `ads.js` が読み込んで表示します。
- 設定は `ads.js` の `SHEET_CSV_URL` の1行だけです。
- 管理シートは `kamakura_ads_sheet.xlsx`（ad1〜ad7、furusato1〜furusato5）。表示が OFF／空の枠は自動で非表示になります。
- 配置：index（furusato1〜3・ad1）／map（ad2）／kotsu（ad3）／matsuri（furusato4・ad4）／areas（ad5）／shukuhaku（ad6・furusato5・ad7）

## 著作権
イラスト・地図・路線図はすべて本サイト用に作成したオリジナルのSVGです。外部の地図画像・地図データ・写真は使用していません。
フォントは Google Fonts（Zen Kaku Gothic New / Zen Old Mincho：SIL Open Font License、無料）を読み込んでいます。
各スポットの「地図アプリで開く」は Googleマップの公式URL形式による検索リンクです（APIキー不要・無料）。

## 情報の確認時点
2026年9月（バスの系統：京急バス 2026年3月8日時点、江ノ電バス 2026年9月時点）
