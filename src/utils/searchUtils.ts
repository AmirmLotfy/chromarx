export const searchGoogle = async (query: string): Promise<Array<{ title: string; url: string }>> => {
  const apiKey = 'AIzaSyB_v5ipvfZ_xMXQSQpan7ieZ_YEQfy6AWY';
  const cx = 'e0bab85862daf4c11';

  try {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!data.items) return [];
    
    return data.items.slice(0, 3).map((item: any) => ({
      title: item.title,
      url: item.link
    }));
  } catch (error) {
    console.error('Google search error:', error);
    return [];
  }
};