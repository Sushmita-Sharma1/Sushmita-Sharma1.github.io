/**
 * Sushmita Sharma Portfolio - Web Crypto Authentication Module
 * Implements PBKDF2-SHA256 key derivation in client-side secure context.
 * Author: Sushmita Sharma (Refactored to Staff Frontend Standard)
 */

(function () {
  'use strict';

  const PBKDF2_ITERATIONS = 150000;
  const KEY_LENGTH_BITS = 256;
  const SALT_BYTE_LENGTH = 16;

  /**
   * Converts an ArrayBuffer or Uint8Array to a lowercase hex string.
   * @param {ArrayBuffer|Uint8Array} buffer
   * @returns {string} Hexadecimal representation.
   */
  const bufferToHex = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray, (byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  /**
   * Converts a hex string back to a Uint8Array.
   * @param {string} hexString
   * @returns {Uint8Array}
   */
  const hexToBuffer = (hexString) => {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return bytes;
  };

  /**
   * Derives a cryptographic hash from a password and salt using PBKDF2-SHA-256.
   * @param {string} password - User password.
   * @param {string} saltHex - Hex-encoded salt.
   * @param {number} iterations - Number of hash iterations.
   * @returns {Promise<string>} Hex-encoded derived hash.
   */
  const deriveHash = async (password, saltHex, iterations = PBKDF2_ITERATIONS) => {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('A secure browser context (HTTPS or localhost) is required for Web Crypto operations.');
    }

    const encoder = new TextEncoder();
    const rawKey = encoder.encode(password);
    const saltBuffer = hexToBuffer(saltHex);

    const baseKey = await crypto.subtle.importKey(
      'raw',
      rawKey,
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: saltBuffer,
        iterations: iterations
      },
      baseKey,
      KEY_LENGTH_BITS
    );

    return bufferToHex(derivedBits);
  };

  /**
   * Generates a cryptographically random salt.
   * @returns {string} Hex-encoded 16-byte salt.
   */
  const generateSalt = () => {
    const saltBytes = new Uint8Array(SALT_BYTE_LENGTH);
    crypto.getRandomValues(saltBytes);
    return bufferToHex(saltBytes);
  };

  // Expose API
  window.Auth = {
    ITER: PBKDF2_ITERATIONS,
    derive: deriveHash,
    newSalt: generateSalt
  };
})();
