const axios = require('axios');

async function testFetchWithCookies() {
  try {
    const client = axios.create({
      baseURL: 'https://www.dhlottery.co.kr',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    // Step 1: Visit main page to get initial cookies
    const initRes = await client.get('/common.do?method=main');
    const setCookie = initRes.headers['set-cookie'];
    console.log('Set-Cookie headers:', setCookie);

    const cookies = setCookie ? setCookie.map(c => c.split(';')[0]).join('; ') : '';

    // Step 2: Request JSON API with Cookie header
    const apiRes = await client.get('/common.do?method=getLottoNumber&drwNo=1135', {
      headers: {
        'Cookie': cookies,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    console.log('API Response data type:', typeof apiRes.data);
    console.log('API Response:', apiRes.data);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

testFetchWithCookies();
