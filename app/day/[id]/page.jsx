import { readFileSync } from 'fs';

export default function Day({ params }) {
  const day = params.id;
  const folderName = `day${day.toString().padStart(2, '0')}`;

  const defaultInput = readFileSync(`./${folderName}/input.txt`, 'utf8');

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex flex-col gap-4 w-full '>
        <div className='flex gap-4 w-full'>
          <button
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            // onClick={() => {}}
          >
            Run test
          </button>

          <button
            className='flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            // onClick={() => {}}
          >
            Run input
          </button>
        </div>

        <textarea className='bg-gray-800 rounded' defaultValue={defaultInput} />
      </div>
    </main>
  );
}
