import { useState } from 'react';
import FileUpload from './FileUpload';
import { formatSize } from '../lib/helpers';
import { calendar_v3 } from 'googleapis';

type StateProps = {
  title: string;
  file: File | null;
};

type Props = {
  event: calendar_v3.Schema$Event;
  artist?: string | null;
  submit: (formData: FormData) => void;
};

export default function RadioShowForm({
  artist,
  event,
  submit,
}: Props) {
  const [form, setForm] = useState<StateProps>({
    title: '',
    file: null,
  });

  const updateFile = (file: File) => setForm({ ...form, file });
  const removeFile = () => setForm({ ...form, file: null });

  // Append form data and upload to server
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !form.file ||
      !event.start?.dateTime ||
      !form.title ||
      !artist
    ) {
      return void 0;
    }

    const formData = new FormData();
    formData.append('file', form.file);
    formData.append('title', form.title.toUpperCase());
    formData.append('artist', `[${artist.toUpperCase()}]`);
    formData.append('date', event.start.dateTime);
    submit(formData);
  }

  return (
    <form
      className="gap-8 grid grid-rows[auto_min-content]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-8">
        <div>
          <input
            name="name"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            type="text"
            placeholder="Write your show title here"
            className="form-element"
          />
        </div>
        {form.file ? (
          <div className="flex items-center justify-between gap-6 bg-[#111010] py-3 px-6 rounded-full">
            <div className="text-white space-x-2 text-sm">
              <span>{form.file.name}</span>
              <span className="text-xs">
                {formatSize(form.file.size)}
              </span>
            </div>
            <button
              onClick={removeFile}
              className="text-white text-sm underline"
            >
              remove
            </button>
          </div>
        ) : (
          <FileUpload updateFile={updateFile} />
        )}
      </div>
      <div>
        <button className="p-4 border-[1px] w-full rounded-full">
          SEND
        </button>
      </div>
    </form>
  );
}
