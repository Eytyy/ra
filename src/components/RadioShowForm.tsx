import { useCallback, useEffect, useState } from 'react';
import { formatSize } from '../lib/helpers';
import { motion } from 'framer-motion';
import FileInput from './FileInput';

type StateProps = {
  title: string;
  file: File | null;
};

type Props = {
  date: string;
  artist: string;
  submit: (formData: FormData) => void;
};

export default function RadioShowForm({
  artist,
  date,
  submit,
}: Props) {
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<StateProps>({
    title: '',
    file: null,
  });

  const validate = useCallback(() => {
    const { file, title } = form;
    const errors: { [key: string]: string } = {};

    if (!file) {
      errors['file'] = 'File is required';
    }
    if (!title) {
      errors['title'] =
        'Please add a title for your show or episode number eg. Ep.12';
    }
    // validate file type
    const allowedExtensions = /(\.mp3)$/i;
    if (file && !allowedExtensions.exec(file.name)) {
      errors['file'] =
        'Invalid file type, only mp3 files are allowed';
    }
    setErrors(errors);
    return errors;
  }, [form]);

  const updateFile = (file: File) => {
    setDirty(true);
    setForm({ ...form, file });
  };
  const removeFile = () => setForm({ ...form, file: null });

  useEffect(() => {
    if (dirty) {
      validate();
    }
  }, [form, validate, dirty]);

  // Append form data and upload to server
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length) {
      return;
    }

    const formData = new FormData();
    formData.append('file', form.file!);
    formData.append('title', form.title);
    formData.append('artist', artist);
    formData.append('date', date);
    submit(formData);
  }
  return (
    <form
      className="gap-8 grid grid-rows[auto_min-content]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-6 md:space-x-8">
        <div>
          <input
            name="name"
            value={form.title}
            onChange={(e) => {
              setDirty(true);
              setForm({ ...form, title: e.target.value });
            }}
            type="text"
            placeholder="Write your show title here"
            className="form-element"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">
              {errors.title}
            </p>
          )}
        </div>
        <div>
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
            <FileInput updateFile={updateFile} />
          )}
          {errors.file && (
            <p className="text-red-500 text-xs mt-1">{errors.file}</p>
          )}
        </div>
      </div>
      <div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 border-[1px] w-full rounded-full"
        >
          SEND
        </motion.button>
      </div>
    </form>
  );
}
