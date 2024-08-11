import path from 'path';

export default function itIsImage(filename) {
    let isImage = false;
    const extension = path.extname(filename).toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png"];
    
    for(let imageExtension of imageExtensions){
      if(extension === imageExtension){
        isImage = true;
        break;
      }
    }
  
    return isImage;
}