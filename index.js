const FS = require("fs");
const Util = require("util");
const Path = require("path");
const Which = require("which");
const ChildProcess = require("child_process");
const isexe = require('isexe');

async function getExecPath(name){
	if(name.indexOf("/") > -1){
		if(await Util.promisify(isexe)(name)){
			return name;
		}else{
			return null;
		}
	}else{
		let path = await Util.promisify(Which)(name);
		if(path)
			return path;
		else
			return null;
	}
}

async function docPreview(filepath, conf){
	if(!conf)
		conf = {};
	let stat = await Util.promisify(FS.stat)(filepath);
	if(!stat.isFile()){
		throw new Error("Path is not a file: "+filepath);
	}
	let unoconv = await getExecPath(conf.unoconvPath ? conf.unoconvPath : "unoconv")
	if(!unoconv)
		throw new Error("unoconv not available!");
	let imagemagick = await getExecPath(conf.imagemagickPath ? conf.imagemagickPath : "convert")
	if(!imagemagick)
		throw new Error("imagemagick convert not available!");
	let outpdf = ChildProcess.spawn(unoconv, [
		"-f", "pdf",
		"-e", "PageRange=1",
		"--stdout",
		filepath
	],{
		stdio: ['ignore', 'pipe', 'ignore']
	});
	let size = "x";
	if(!conf.width && !conf.height)
		size = "x300";
	else
		size = (conf.width ? conf.width : "") + "x" + (conf.height ? conf.height : "");
	let thumbout = ChildProcess.spawn(imagemagick, [
		"-thumbnail", size,
		"-background", "white",
		"-alpha", "remove",
		"pdf:-",
		"jpeg:-"
	], {
		stdio: [outpdf.stdout, 'pipe', 'ignore']
	});
	return thumbout.stdout;
}

async function imgPreview(filepath, conf = {}){
	let stat = await Util.promisify(FS.stat)(filepath);
	if(!stat.isFile()){
		throw new Error("Path is not a file: "+filepath);
	}
	let imagemagick  = await getExecPath(conf.imagemagickPath ? conf.imagemagickPath : "convert")
	if(!imagemagick)
		throw new Error("imagemagick convert not available!");
	let size = "x";
	if(!conf.width && !conf.height)
		size = "x300";
	else
		size = (conf.width ? conf.width : "") + "x" + (conf.height ? conf.height : "");
	let thumbout = ChildProcess.spawn(imagemagick, [
		"-thumbnail", size,
		"-background", "white",
		"-alpha", "remove",
		Path.resolve(filepath),
		"jpeg:-"
	], {
		stdio: ['ignore', 'pipe', 'ignore']
	});
	return thumbout.stdout;
} 

module.exports = {
	imgPreview, docPreview
};