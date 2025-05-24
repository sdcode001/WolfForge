import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private algorithm = {
    name: 'AES-CBC',
    length: 256
  };

  private key!: CryptoKey;

  //Only call this once on app init, store key securely if needed
  async generateKey() {
    this.key = await window.crypto.subtle.generateKey(
      this.algorithm,
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(16)); // New IV each time
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      this.key,
      encoded
    );

    // Return IV + ciphertext (both in hex) so they can be separated during decryption
    return this.arrayBufferToHex(iv) + ':' + this.arrayBufferToHex(encrypted);
  }

  async decrypt(encryptedHex: string): Promise<string> {
    const [ivHex, cipherHex] = encryptedHex.split(':');
    if (!ivHex || !cipherHex) throw new Error('Invalid encrypted data format');

    const iv = new Uint8Array(this.hexToArrayBuffer(ivHex));
    const encryptedBuffer = this.hexToArrayBuffer(cipherHex);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      this.key,
      encryptedBuffer
    );

    return new TextDecoder().decode(decrypted);
  }

  private arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
  }
}


