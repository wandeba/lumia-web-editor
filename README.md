# Lumia Web Editor

A touch-friendly HTML, CSS and JavaScript editor prototype intended for small screens, with the Lumia 650 / Windows 10 Mobile as the target device.

## Current stage

This repository starts with a lightweight browser-based prototype. It provides:
- HTML, CSS and JavaScript tabs
- An editable code area
- A live preview
- A simple dark, touch-friendly layout

**Important:** this prototype is not yet a native Windows 10 Mobile APPX package. A browser prototype and a deployable ARM32/UWP package are different things. We will verify a compatible packaging route before claiming it can be installed on the Lumia.

## Try it on Ubuntu

Open `App/index.html` in a modern browser, or serve the repository folder locally:

```bash
python3 -m http.server 8000
```

Then visit `http://127.0.0.1:8000/App/`.

## Roadmap

1. Build and test the editor interface.
2. Improve touch editing, file switching, and preview behavior for small screens.
3. Investigate a genuine Windows 10 Mobile ARM32 package path and test on-device deployment.
4. Add project save/load only after choosing a reliable storage approach for the target browser/runtime.

## Target device

- Microsoft Lumia 650
- Windows 10 Mobile, build 10.0.15254.603

## License

Not selected yet.
