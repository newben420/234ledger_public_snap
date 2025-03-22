// import * as fs from "fs";
// import * as path from "path";
// import { ServerResParamFx } from "./general";
// import { GSRes } from "@shared/model/res";
// // import { createCanvas, loadImage } from 'canvas';
// import { Jimp } from "jimp";
// import { toWebP } from "format-converter";
// import { Blob } from "buffer";
// import { Log } from "./Log";

// /**
//  * Resizes an image to the specified height while maintaining aspect ratio,
//  * converts it to WebP, saves it in the same directory, and deletes the original file.
//  *
//  * @param height - The new height to resize the image to.
//  * @param imagePath - The absolute path to the image file.
//  */
// export async function processImage(height: number, imagePath: string, fx: ServerResParamFx) {
//   try {
//     // Ensure the image exists
//     if (!fs.existsSync(imagePath)) {
//       fx(GSRes.err("f_err_1"));
//       return;
//     }

//     // Get file details
//     const originalDir = path.dirname(imagePath);
//     const fileName = path.basename(imagePath, path.extname(imagePath));
//     const webpImagePath = path.join(originalDir, `${fileName}.webp`);

//     // Load the image using sharp
//     const image = await Jimp.read(imagePath);
//     const cheight = image.height;

//     let doHeight: boolean = false;

//     // Check if resizing is necessary
//     if (cheight && height < cheight) {
//       doHeight = true;
//     }

//     // Resize and convert to WebP
//     if (doHeight) {
//       image.resize({ h: height });
//     }
//     const blob = new Blob([await image.getBuffer("image/jpeg")], { type: "image/jpeg" });
//     toWebP(blob as any).then((webpBlob) => {
//       webpBlob.arrayBuffer().then((arrayBuffer) => {
//         const buffer = Buffer.from(arrayBuffer);
//         fs.writeFile(webpImagePath, buffer, (err) => {
//           if (err) {
//             fs.unlinkSync(imagePath);
//             Log.dev(err);
//             fx(GSRes.err("f_err_2"));
//           }
//           else {
//             fs.unlinkSync(imagePath);
//             fx(GSRes.succ(webpImagePath));
//           }
//         });
//       }).catch((err) => {
//         fs.unlinkSync(imagePath);
//         Log.dev(err);
//         fx(GSRes.err("f_err_2"));
//       });
//     })
//       .catch((error) => {
//         fs.unlinkSync(imagePath);
//         Log.dev(error);
//         fx(GSRes.err("f_err_2"));
//       });

//   } catch (error) {
//     Log.dev(error);
//     fx(GSRes.err("f_err_2"));
//   }
// }
