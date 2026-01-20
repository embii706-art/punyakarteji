
import { CLOUDINARY } from "../config/cloudinary.js";

export async function uploadProductConfirm(file){
 const f = new FormData();
 f.append('file',file);
 f.append('upload_preset',CLOUDINARY.uploadPreset);
 const r = await fetch(CLOUDINARY.url,{method:'POST',body:f});
 return r.json();
}
