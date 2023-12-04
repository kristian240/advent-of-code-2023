import { readdirSync } from 'fs';

export default function Home() {
  const days = readdirSync('./').filter((file) => file.startsWith('day'));

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {/* render days in a list */}
      <ul className='flex flex-col gap-4'>
        {days.map((day) => (
          <li key={day}>
            <a href={`/day/${parseInt(day.replace('day', ''))}`}>{day}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
