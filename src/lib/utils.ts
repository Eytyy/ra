import { ID3Writer } from 'browser-id3-writer';

export const updateTags = async ({
  file,
  title,
  artist,
}: {
  file: File;
  title: string;
  artist: string;
}): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async () => {
        const arrayBuffer = reader.result;
        if (!arrayBuffer || typeof arrayBuffer === 'string') {
          throw new Error('Failed to read file');
        }
        const writer = new ID3Writer(arrayBuffer);
        writer
          .setFrame('TIT2', `'${title.toUpperCase()}'`)
          .setFrame('TPE1', [`[${artist.toUpperCase()}]`])
          .setFrame('TPE2', `[${artist.toUpperCase}]`);

        const updatedBlob = await writer.getBlob();
        const updatedFile = new File([updatedBlob], file.name, {
          type: file.type,
        });
        resolve(updatedFile);
      };
    } catch (e) {
      console.error('Error updating tags:', e);
      reject(e);
    }
  });
};
