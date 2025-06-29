import { environment } from '../../environments/environment';

export class UploadAdapter {
  apiUrl: string = environment.apiBaseUrl;
  baseUrl: string = environment.baseUrl;

  private loader: any;
  private xhr: XMLHttpRequest = new XMLHttpRequest();

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then((file: File) => new Promise((resolve, reject) => {
        this.xhr = new XMLHttpRequest();
        this.xhr.open('POST', `${this.apiUrl}/Upload`, true);
        this.xhr.responseType = 'json';

        // 🔐 Add Authorization header
        const token = localStorage.getItem('token');
        if (token) {
          this.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        this.xhr.onload = () => {
          if (this.xhr.status === 200) {
            resolve({ default: `${this.baseUrl}/${this.xhr.response.url}` });
          } else {
            reject('Upload failed');
          }
        };

        this.xhr.onerror = () => reject('Upload failed');
        this.xhr.onabort = () => reject();

        const data = new FormData();
        data.append('file', file);
        this.xhr.send(data);
      }));
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}