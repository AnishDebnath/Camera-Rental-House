import supabase from './src/db/supabase.js';

async function test() {
  try {
    const { data, error, count } = await supabase.from('products').select('*', { count: 'exact' });
    console.log('Error:', error);
    console.log('Count:', count);
    console.log('Data length:', data?.length);
    if (data && data.length > 0) {
      console.log('First product:', data[0]);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

test();
