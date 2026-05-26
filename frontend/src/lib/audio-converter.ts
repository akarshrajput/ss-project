/**
 * Utility to fetch an audio file (via our proxy to bypass CORS)
 * and convert it to a 16-bit stereo WAV file client-side.
 */

export async function convertMp3UrlToWav(
  url: string,
  fileName: string,
  onProgress?: (stage: "fetching" | "decoding" | "encoding" | "done" | "error", progress?: number) => void
): Promise<void> {
  try {
    onProgress?.("fetching");
    // Fetch the MP3 file through the local proxy to bypass any CORS restrictions
    const proxyUrl = `/api/audio/proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio file from proxy: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    onProgress?.("decoding");
    // Decode the audio array buffer to PCM audio buffer using AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    onProgress?.("encoding");
    // Encode AudioBuffer to WAV
    const wavBlob = audioBufferToWav(audioBuffer);

    onProgress?.("done");
    // Download the WAV Blob
    const downloadUrl = URL.createObjectURL(wavBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName.endsWith(".wav") ? fileName : `${fileName}.wav`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    onProgress?.("error");
    console.error("Audio conversion failed:", error);
    throw error;
  }
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // 1 = raw PCM
  const bitDepth = 16;
  
  let result;
  if (numOfChan === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  
  return writeWavFile(result, numOfChan, sampleRate, format, bitDepth);
}

function interleave(inputL: Float32Array, inputR: Float32Array): Float32Array {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  let index = 0;
  let inputIndex = 0;
  
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function writeWavFile(
  samples: Float32Array,
  numChannels: number,
  sampleRate: number,
  format: number,
  bitDepth: number
): Blob {
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);
  
  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true);
  
  floatTo16BitPCM(view, 44, samples);
  
  return new Blob([view], { type: 'audio/wav' });
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array): void {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
