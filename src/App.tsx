import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

interface Contest {
  id: number;
  event: string;
  host: string;
  href: string;
  start: string;
  end: string;
}

function App() {
  const [contests, setContests] = useState<Contest[]>([]);

  const formatDateTime = (date: Date) => {
    return (date.toISOString());
  }

  const formatDateString = (dateString: string) => {
    return dateString.split('T')[0] + ' ' + dateString.split('T')[1];
  }

  useEffect (() => {
    const fetchContests = async () => {

      const currentDate = new Date();
      const startDateString = formatDateTime(currentDate);

      const endDate = new Date();
      endDate.setDate(currentDate.getDate() + 2);
      const endDateString = formatDateTime(endDate);
      try {
        const apiKey = import.meta.env.VITE_API_KEY;
        const response = await axios.get('https://clist.by:443/api/v4/contest/', {
          headers: {
            'Authorization': apiKey
          },
          params: {
            start__gte: startDateString,
            end__lt: endDateString,
            order_by: 'start'
          }
        });
        setContests(response.data.objects);
      }
      catch (error){
        console.error('Error fetching contests: ', error)
      }
    }
    fetchContests();
    
  }, []);

  return (
    <>
      <h1 className='title'>Coding Contests</h1>
      {contests.length == 0? (<div>Loading...</div>):(<div>
        <ul className='list'>
          {contests.map(contest => (
            <li key={contest.id} className='list-item'>
              <div className='item-name'>{contest.event}</div>
              <div className='item-dates'>{formatDateString(contest.start)} - {formatDateString(contest.end)}</div>
              <div className='item-host'>{contest.host}</div>
              <a href={contest.href} className='item-link' target='_blank'>Link</a>
            </li>
          ))}
        </ul>
      </div>)}
    </>
  )
}

export default App
