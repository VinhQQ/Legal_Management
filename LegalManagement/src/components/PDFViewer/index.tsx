'use client';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ url }: { url: string | undefined }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div className='w-full h-full'>
      <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
        <Viewer fileUrl={url!} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};
export default PDFViewer;
