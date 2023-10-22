# obsidian-templater-use

## Required

- [Obsidian]
- [Templater]

## Installation

1. Download `useObsidian.js` from the [release page]
2. Place `useObsidian.js` under the path set by "[Script files folder location]"

## Usages

```js
<%*
const { insert } = tp.user.useObsidian()

insert("🦉Mimizou")
%>
```

## API Documantation

https://tadashi-aikawa.github.io/obsidian-templater-use/

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

[release page]: https://github.com/tadashi-aikawa/obsidian-templater-use/releases
[Script files folder location]: https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html?highlight=user%20scipts%20function#define-a-script-user-function

