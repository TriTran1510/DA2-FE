// src/app/utils/image-conversion.util.ts
export function convertImageToPng(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
  
          canvas.toBlob((blob) => {
            if (blob) {
              const pngFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".png"), { type: 'image/png' });
              resolve(pngFile);
            } else {
              reject(new Error('Image conversion failed.'));
            }
          }, 'image/png');
        };
  
        img.onerror = () => {
          reject(new Error('Image loading failed.'));
        };
      };
  
      reader.onerror = () => {
        reject(new Error('File reading failed.'));
      };
  
      reader.readAsDataURL(file);
    });
  }
  