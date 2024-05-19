import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppSwal } from './services/app.swal';
import { AppService } from './services/app..service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'DA2-FE';

  selectedFile: File | null = null;
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
      const result = await this.appService.doPOST("upload-image", this.selectedFile);
      if (result) {
        if (result.status == 200) {
          const blob = await result.blob();
      
          // Create a URL for the Blob object
          const imageUrl = URL.createObjectURL(blob);

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

  downloadImage(){
    if (this.selectedFile) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.setAttribute('href', window.URL.createObjectURL(this.selectedFile));
      link.setAttribute('download', this.selectedFile.name);

      // Append the anchor element to the body
      document.body.appendChild(link);

      // Trigger a click event on the anchor element
      link.click();

      // Remove the anchor element from the body
      document.body.removeChild(link);
    } else {
      // Handle error: No file selected
      this.appSwal.showError("Bạn chưa thêm hình vào.")
      console.error('No file selected.');
    }
  }
}
