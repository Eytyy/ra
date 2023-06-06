import { ID3Writer } from 'browser-id3-writer';
// import { removeSpecialCharacters } from './helpers';

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
    const f_title = `'${title.toUpperCase()}'`;
    const f_artist = `[${artist.toUpperCase()}]`;

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async () => {
        const arrayBuffer = reader.result;
        if (!arrayBuffer || typeof arrayBuffer === 'string') {
          throw new Error('Failed to read file');
        }
        const writer = new ID3Writer(arrayBuffer);
        writer.setFrame('TIT2', f_title).setFrame('TPE1', [f_artist]);
        writer.addTag();

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
