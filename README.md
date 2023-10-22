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
const { insert } = tp.user.fryTempura()

insert("🦉Mimizou")
%>
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

- `dist/index.js`

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

