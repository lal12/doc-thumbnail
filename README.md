# doc-thumbnail

This utility creates a preview thumbnail from a document.
It requires `unoconv` and ImageMagick (`convert`) to be installed.

## Install

	npm i doc-thumbnail

## API

	interface BaseConfig{
		width?: number;
		height?: number;
		imagemagickPath?: string;
	}
	interface DocPreviewConf extends BaseConfig{
		unoconvPath?: string;
	}
	async function docPreview(filepath: string, conf: DocPreviewConf = {}): NodeJS.ReadableStream;
	async function imgPreview(filepath: string, conf: BaseConfig = {})

To generate a preview of a PDF file you can use the `imgPreview` function, since the underlying ImageMagick can handle PDF files directly.

## Example

	const {docPreview, imgPreview} = require("doc-thumbnail");
	let ws = FS.createWriteStream("example.odt.jpg");
	let ts = await docPreview("example.odt", {height: 200});
	ts.pipe(ws);

	let ws2 = FS.createWriteStream("example.png.jpg");
	let ts2 = await docPreview("example.png", {height: 200});
	ts2.pipe(ws2);
