# POSIIβ 版

GitHub に POSIIβ 版のコードを公開しました。  
CircleCI で自動デプロイが可能です。  
設定は、.circleci/config.yml で行っています。

## 開発にご協力いただきたい機能

・リファクタリング(コードの簡略化、react-redux-firebase 不使用へ)  
・TypeScript の導入  
・インフィニティスクロール  
・セキュリティルールの見直し  
・テストコードの作成  
・通知機能の件数表示

他にもお気軽に、プルリクエストをいただければ幸いです。

## インストール・起動と開発

React と Firebase で開発しています。  
yarn 自体がインストールされていれば、コマンド「yarn」、「yarn start」のみで起動します。  
また、Firebase の設定を変更いただければ、ご用意いただいたデータベースでも動作します。  
src/config.sample.js で apiKey 等を修正してください。  
Firebase 側でも設定が必要です。  
Extension から Resize Images の設定をお願いします。  
主な設定は、  
Sizes of resized images：200x200,1000x1000、  
Cloud Storage path for resized images：thumbnails  
です。

## 開発の参考にしたページ

yarn インストール  
<https://classic.yarnpkg.com/ja/docs/install/>

React 公式チュートリアル  
<https://ja.reactjs.org/tutorial/tutorial.html>

Firebase 公式ドキュメント  
<https://firebase.google.com/docs?hl=ja>

Material UI  
<https://material-ui.com/>

react-redux-firebase  
<http://react-redux-firebase.com/>

掲示板チュートリアル  
<https://qiita.com/momosuke/items/245eabb8dbdc3493aac0>
