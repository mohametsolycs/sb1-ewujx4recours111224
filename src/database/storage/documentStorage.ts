import { Document } from '../../types';
import { StorageError } from '../utils/errors';

export const documentStorage = {
  async store(file: File): Promise<Document> {
    try {
      // Convert file to base64 string for storage
      const base64 = await this.fileToBase64(file);
      
      const document: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        url: base64,
        type: file.type,
        category: this.getDocumentCategory(file.type),
        uploadedAt: new Date()
      };

      return document;
    } catch (error) {
      console.error('Failed to store document:', error);
      throw new StorageError('Failed to store document');
    }
  },

  getDocumentCategory(fileType: string): string {
    if (fileType.startsWith('image/')) {
      return 'photo';
    } else if (fileType === 'application/pdf') {
      return 'document';
    } else {
      return 'other';
    }
  },

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  base64ToBlob(base64Url: string): Blob {
    try {
      // Handle both data URL and raw base64
      const base64 = base64Url.includes('base64,') 
        ? base64Url.split('base64,')[1]
        : base64Url;

      // Decode base64
      const byteCharacters = atob(base64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      // Get content type from data URL or default to application/octet-stream
      const contentType = base64Url.includes('data:') 
        ? base64Url.split(';')[0].split(':')[1]
        : 'application/octet-stream';

      return new Blob(byteArrays, { type: contentType });
    } catch (error) {
      console.error('Error converting base64 to blob:', error);
      throw new StorageError('Failed to convert document data');
    }
  },

  openDocument(document: Document): void {
    try {
      const blob = this.base64ToBlob(document.url);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error opening document:', error);
      throw new StorageError('Failed to open document');
    }
  }
};