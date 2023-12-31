# Obsidian Tempura

<img src="https://github.com/tadashi-aikawa/obsidian-tempura/blob/main/logo.png?raw=true" width="400" />

> **Note**
> The logo above was created by DALL-E3

> **Note**
> This repository is still pre-alpha version.

## Required

- [Obsidian]
- [Templater]

## API Documantation

https://tadashi-aikawa.github.io/obsidian-tempura/

## 2種類の使い方

Obsidian Tempuraには2種類の使い方があります。

1. [Script User Functions]として使う
2. Templater scriptの統合開発環境として使う

それぞれ、インストールの仕方や利用方法が異なります。

## Script User Functionsを使う場合

普通の使い方です。

### インストール

`fryTempura.js`を取得して`script files folder location`で指定されたパスの配下に配置するだけです。

`fryTempura.js`は以下のURLから取得できます。

https://raw.githubusercontent.com/tadashi-aikawa/obsidian-tempura/main/lib/fryTempura.js

### 使い方

`tp.user.fryTempura()`からObsidian Tempuraの関数群を利用できます。`const T = tp.user.fryTempura()` で宣言したTを利用してください。

```js
<%*
const T = tp.user.fryTempura()

T.insert("🦉Mimizou")
%>
```

> **Warning**
> 上記以外の書き方をすると、TypeScriptとしては問題なくても、tsファイルからmdファイルへの変換で動かなくなる可能性があります。

利用できる関数の定義は[API Documentation]をご覧ください。

## Templater scriptの統合開発環境として使う場合

以下のことができます。

- IDEによる型チェック/推論
- IDEによるオートコンプリート
- TypeScriptファイルをTemplater script(markdownファイル)に変換
- ホットリロード

バージョン管理やIDEでの開発を好むTypeScript/JavaScript開発者の方にオススメです。

Windows/Ubuntu環境で、Node.js v18の動作を確認しています。

### インストール

```console
npm install https://github.com/tadashi-aikawa/obsidian-tempura.git
npx tempura init
```

#### アップデートしたいときは

2023-11-19以後のものをバージョンアップする場合は以下のコマンドを実行します。

```console
npx tempura update
```

2023-11-19以前のものをバージョンする場合は、updateコマンドがないため以下の手順が必要です。

```console
npm update obsidian-tempura && npm install obsidian-tempura
npm install -D typescript@5.2 @tsconfig/node18 chokidar@3 @babel/core@7 @babel/plugin-transform-typescript@7 obsidian@^1.4.11
```

### 設定

`tempura init`で作成される`config.json`は以下です。

```json
{
  // TemplaterのScriptフォルダのパス
  // "script"を指定した場合、カレントディレクトリの`./script`以下に最新のスクリプト(jsファイル)が転送される
  "scriptFilesFolderLocation": "script",
  // tsファイルのディレクトリをキーに、mdファイル(Templater Script)のディレクトリパスを値に設定
  // "src": "dist"を指定した場合、カレントディレクトリの`src`配下にあるtsファイルがmdファイルに変換され、カレントディレクトリの`dist`配下に転送される
  "deployMap": {
    "src": "dist"
  }
}
```


実際に利用する際は、Vaultの設定にあわせて`config.json`の設定を変更しましょう。以下は具体例です。

```json
{
  "scriptFilesFolderLocation": "/home/tadashi-aikawa/vaults/minerva/templater/scripts",
  "deployMap": {
    "common": "/home/tadashi-aikawa/vaults/minerva/templater",
    "home": "/home/tadashi-aikawa/vaults/minerva/templater",
  }
}
```

`deployMap`の`common`と`home`が同じ設定値になっていますが、これはどちらの成果物も同じディレクトリ内部に転送されることを意味します。Obsidian Tempuraはファイル同期はしないため、`deployMap`の値に指定されたディレクトリのファイルが削除されることはありません。(ただし、同名ファイルは上書きされます)

### ビルド

以下のコマンドを実行すると、tsファイルに変更があった場合に自動でビルドして転送します。

```console
npx tempura
```

#### トリプルスラッシュの扱い

トリプルスラッシュ (`///`) でコメントアウトされたコードは、そのままコメント解除されます。たとえば、以下のコードをtsファイルとして書いた場合

```typescript
///<%*
// begin
const T = tp.user.fryTempura();
T.notify("hoge")
// end
///%>
```

以下のようにビルドされます。

```javascript
<%*
// begin
const T = tp.user.fryTempura();
T.notify("hoge")
// end
%>
```

これは[Templater tags]を指定するユースケースでの利用を想定しています。

#### early returnの書き方

early returnの書き方は少し特殊であり、マクロのようなルールがあります。early returnさせるには、以下のように引数なしで`T.exit()`の値をthrowしてください。

```typescript
const T = tp.user.fryTempura(); // Tにバインドする定義も必須です
throw T.exit();
```

このコードはビルド時に以下のように変換されます。

```javascript
return
```

もう少し実用的なサンプルコードは以下です。

```typescript
///<%*
const T = tp.user.fryTempura();
const props = T.getProperties();
if (!props) {
  throw T.exit();
}

T.notify(JSON.stringify(props));
///%>
```

これは以下のmdファイルに変換されます。

```javascript
<%*
const T = tp.user.fryTempura();
const props = T.getProperties();
if (!props) {
  return
}
T.notify(JSON.stringify(props));
%>
```

#### 例外処理の書き方

例外処理の書き方は少し特殊であり、マクロのようなルールがあります。処理の中断が必要な例外を発生させるには、以下のように引数ありで`T.exit()`の値をthrowしてください。

```typescript
const T = tp.user.fryTempura(); // Tにバインドする定義も必須です
throw T.exit("プロパティが存在しません");
```

このコードはビルド時に以下のように変換されます。

```javascript
T.notify("プロパティが存在しません"); return
```

もう少し実用的なサンプルコードは以下です。

```typescript
///<%*
const T = tp.user.fryTempura();
const props = T.getProperties();
if (!props) {
  throw T.exit("プロパティが存在しません");
}

T.notify(JSON.stringify(props));
///%>
```

これは以下のmdファイルに変換されます。

```javascript
<%*
const T = tp.user.fryTempura();
const props = T.getProperties();
if (!props) {
  T.notify("プロパティが存在しません"); return
}
T.notify(JSON.stringify(props));
%>
```

## ベータ版への道

- [x] tsファイルに型を記載できるようにする
    - [x] noImplicitAnyのオプションを削除
- [ ] 既存Templater Scriptsを移行しながら不足しているfunctionsを補っていく
- [ ] functionsのインターフェース整理
- [ ] docsの整理

## 🤖 開発者むけ

### Required

- [Bun] (v1.0.8 >=)

### Provisioning

```console
bun install
```

### Build

```console
bun run build
```

#### Artifacts

- `lib/fryTempura.js`

### Build docs

```console
bun run build:docs
```

#### Artifacts

- `docs`


[Obsidian]: https://obsidian.md/
[Templater]: https://github.com/SilentVoid13/Templater
[Script User Functions]: https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html
[Templater tags]: https://silentvoid13.github.io/Templater/commands/overview.html
[Bun]: https://bun.sh/

[release page]: https://github.com/tadashi-aikawa/obsidian-tempura/releases
[Script files folder location]: https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html?highlight=user%20scipts%20function#define-a-script-user-function

[API Documentation]: [#api-documentation]
