import 'dotenv/config';
import supabase from './server/src/db/supabase.js';

async function test() {
  try {
    const { data, error } = await supabase.from('rentals').select('id').limit(1);
    if (error) {
      console.error('Database Error:', error.message);
      if (error.message.includes('does not exist')) {
        console.error('CRITICAL: rentals table is missing!');
      }
    } else {
      console.log('Rentals table exists. Found:', data.length, 'records.');
    }
  } catch (err) {
    console.error('Connection Error:', err);
  }
}

test();
