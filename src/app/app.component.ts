import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppSwal } from './services/app.swal';
import { AppService } from './services/app..service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { convertImageToPng } from './utils/image-conversion.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'DA2-FE';

  selectedFile: File | null = null;
  convertedImage: File | null = null;
  denoisedBlob: Blob;
  filePreview: string | ArrayBuffer | null = null;
  imageAfterUrl: string;
  sanitizedImageUrl: SafeUrl;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    private appSwal: AppSwal,
    private appService: AppService,
    private sanitizer: DomSanitizer
  ){

  }

  ngOnDestroy() {
    URL.revokeObjectURL(this.imageAfterUrl)
  }

  triggerFileInput(){
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Check if the selected file is an image
      if (!file.type.startsWith('image/')) {
        this.appSwal.showError("File upload chưa đúng định dạng !")
        console.error('Selected file is not an image.');
        return;
      }

      this.selectedFile = file;
      console.log('Selected file:', this.selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreview = e.target.result;
        console.log('File preview URL:', this.filePreview);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async denoiseImage() {
    if (!this.selectedFile) {
      this.appSwal.showError("Bạn chưa chọn hình ảnh");
      return;
    }
  
    try {
      const pngFile = await convertImageToPng(this.selectedFile);
      this.convertedImage = pngFile;
      const result = await this.appService.doPOST("upload-image", this.convertedImage);
      if (result) {
        if (result.status == 200) {
          this.denoisedBlob = await result.blob();
      
          // Create a URL for the Blob object
          const imageUrl = URL.createObjectURL(this.denoisedBlob);

          // Now you can use imageUrl to display the image in your Angular component
          console.log('Image URL:', imageUrl);
          this.imageAfterUrl = imageUrl;
          this.sanitizeImageUrl(this.imageAfterUrl);
          this.appSwal.showSuccess('Denoise thành công', false);
        } 
      }
    } catch (error) {
      console.error('Error in request:', error);
    }
  }
  
  sanitizeImageUrl(blobUrl: string): void {
    this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  }

  downloadBlob(): void {
    if(this.sanitizedImageUrl == null){
      this.appSwal.showError("Bạn chưa denoise hình ảnh");
      return;
    }
    const url = URL.createObjectURL(this.denoisedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'denoised-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  }

}
