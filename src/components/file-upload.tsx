'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { FC } from 'react';

import '@uploadthing/react/styles.css';
import Image from 'next/image';
import { X } from 'lucide-react';

type FileUploaderProps = {
  onChange: (url: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage' | 'imageUploader';
};

const FileUploader: FC<FileUploaderProps> = ({ onChange, value, endpoint }) => {
  const fileType = value?.split('.').pop();

  return (
    <>
      {value && fileType !== 'pdf' ? (
        <div className='w-full flex items-center justify-center'>
          <div className='relative h-20 w-20'>
            <Image
              width={80}
              height={80}
              src={value}
              alt='image'
              className='h-20 w-20 rounded-full object-cover'
            />
            <X
              size={20}
              onClick={() => onChange('')}
              className='absolute top-0 right-1 text-white bg-rose-500 rounded-full shadow-md cursor-pointer'
            />
          </div>
        </div>
      ) : (
        <UploadDropzone
          endpoint={endpoint as any}
          onClientUploadComplete={(res: any) => {
            onChange(res?.[0].url);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      )}
    </>
  );
};

export default FileUploader;
