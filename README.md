# Obsidian Tempura

<img src="https://github.com/tadashi-aikawa/obsidian-tempura/blob/main/logo.png?raw=true" width="400" />

> **Note**
> The logo above was created by DALL-E3

## Required

- [Obsidian]
- [Templater]

## Installation

1. Download `fryTempura.js` from the [release page]
2. Place `fryTempura.js` under the path set by "[Script files folder location]"

## Usages

```js
<%*
const T = tp.user.fryTempura()

T.insert("🦉Mimizou")
%>
```

OR

```js
<%*
const { insert } = tp.user.fryTempura()

insert("🦉Mimizou")
%>
```

## Use Obsidian Tempura CLI

TempuraのCLIを利用するとTemplater Scriptをnpmプロジェクトのように開発できます。

- IDE上で型チェックや補完の恩恵を受けられます
- TypeScriptファイルを[Templater Script]のマークダウンファイルに変換できます
  - 変更があったファイルのみを素早く変換することも可能です
- Vault内部に、[Templater Script]や最新の[Obsidian Tempura]を送り込めます

### インストール

```console
npm install https://github.com/tadashi-aikawa/obsidian-tempura.git
npx tempura init
```

### 設定

`config.json`の設定を変更しましょう。

```json
{
  "templater": {
    "templateFolderLocation": "Templaterのtemplate folder locationで指定したパス",
    "scriptFilesFolderLocation": "Templaterのscript files folder locationで指定したパス"
  }
}
```

### ビルド

scr配下のtsファイルをmdファイルに変換し、`templater.templateFolderLocation`で指定したディレクトリ内に転送します。

```console
npx tempura build
```

watchモードでは変更があったtsファイルのみを即座に対象とします。

```console
npx tempura watch
```

## API Documantation

https://tadashi-aikawa.github.io/obsidian-tempura/

## For developers

### Required

- [Bun] (v1.0.7 >=)

### Provisioning

```console
bun install
```

### Build

```console
bun build
```

#### Artifacts

- `lib/fryTempura.js`

### Build docs

```console
bun build:docs
```

#### Artifacts

- `docs`

### Release

```console
VERSION=20231021.1 bun release
```

[Obsidian]: https://obsidian.md/
[Templater]: https://github.com/SilentVoid13/Templater
[Bun]: https://bun.sh/

[release page]: https://github.com/tadashi-aikawa/obsidian-tempura/releases
[Script files folder location]: https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html?highlight=user%20scipts%20function#define-a-script-user-function

