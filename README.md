# Image to PDF

A small, browser-only tool for converting **one JPG or PNG image to one PDF**. Drop an image, choose a file, or paste a screenshot with Ctrl+V (Command+V on macOS). A new image replaces the previous one.

**Use online:** https://stoney239.github.io/image-to-pdf/

**Use offline:** download `index.html` and open it in a modern browser. The PDF library is embedded in the file. No installation, server, CDN, or network connection is needed.

## Languages

- Browser language beginning with `zh`: Chinese.
- Browser language beginning with `ja`: Japanese.
- Every other browser language: English.
- The selector offers Auto, 中文, 日本語, and English. A manual selection is remembered when browser storage is available. Select Auto to return to browser-language detection.

The primary browser language determines the default. Lower-priority languages do not override an English or other primary language.

## Privacy and output

Images are processed locally in the browser and never uploaded. Clipboard access happens only when you paste. The clipboard must contain image data; a path, URL or text alone cannot be converted.

Each PDF contains one page matching the image proportions. Transparent pixels become white. The rendered image is embedded losslessly as PNG without adding JPEG compression, so a PDF may be larger than the original JPEG. Images above 50 megapixels are rejected to limit memory use. Downloads use the browser's usual save location or save dialog.

Selected or dropped files retain their original base name: `photo.jpg` becomes `photo.pdf`. Pasted images use `clipboard-YYYYMMDD-HHmmss.pdf`, using the user's local date and time when the image is pasted. That name stays the same when the same image is saved again or the interface language changes. Pasting a new image captures a new timestamp. The browser handles any remaining filename collisions.

## Source and rebuilding

The published `index.html` works as-is. To edit the readable sources, update `src/template.html` or `src/app.js`, then run:

```sh
python build.py
```

Python is only needed to rebuild the development sources; users of the HTML do not need it. `vendor/jspdf.umd.min.js` is the bundled jsPDF 3.0.4 distribution, with its license notices preserved in the source and generated HTML.

GitHub Pages publishes from the root of the `main` branch. `.nojekyll` disables Jekyll processing.

## 中文 / 日本語

双击下载的 `index.html` 即可离线使用。拖入、点击选择或粘贴一张图片，再点击“保存 PDF”。浏览器语言为中文或日文时自动使用对应语言，其余默认英语；也可以手动切换。

ダウンロードした `index.html` をダブルクリックしてオフラインで使用できます。画像を1枚ドロップ・選択・貼り付けして「PDF を保存」をクリックしてください。ブラウザーの言語が中国語または日本語ならその言語を使い、それ以外は英語になります。手動切り替えも可能です。
