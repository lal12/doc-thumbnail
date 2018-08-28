import * as FS from "fs";
import * as Util from "util";
import Which = require("which");
import * as ChildProcess from "child_process";

export interface BaseConfig{
	width?: number;
	height?: number;
	imagemagickPath?: string;
}

export interface DocPreviewConf extends BaseConfig{
	unoconvPath?: string;
}

export function docPreview(filepath: string, conf?: DocPreviewConf): Promise<NodeJS.ReadableStream>;

export function imgPreview(filepath: string, conf?: BaseConfig): Promise<NodeJS.ReadableStream>;