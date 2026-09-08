export const generateHash = async (buffer: ArrayBuffer): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Prototype AES-GCM Key Management (Not for Production)
const DEMO_ENCRYPTION_KEY_STRING = 'NyayaVault-Demo-Secure-Key-12345'; // Simple deterministic key for demo
let cachedCryptoKey: CryptoKey | null = null;

const getDemoKey = async (): Promise<CryptoKey> => {
  if (cachedCryptoKey) return cachedCryptoKey;
  
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(DEMO_ENCRYPTION_KEY_STRING.padEnd(32, '0')), // Need 256 bit key
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('NyayaVault-Salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  cachedCryptoKey = key;
  return key;
};

export const encryptFile = async (fileBuffer: ArrayBuffer): Promise<{ encryptedBlob: Blob, iv: Uint8Array }> => {
  const key = await getDemoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    fileBuffer
  );
  
  return {
    encryptedBlob: new Blob([encryptedBuffer]),
    iv
  };
};

export const decryptFile = async (encryptedBlob: Blob, iv: Uint8Array): Promise<ArrayBuffer> => {
  const key = await getDemoKey();
  const encryptedBuffer = await encryptedBlob.arrayBuffer();
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    encryptedBuffer
  );
  
  return decryptedBuffer;
};
