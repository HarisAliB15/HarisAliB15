// Scope the pinned snake generator's GitHub query to the calendar year.
const originalFetch = globalThis.fetch;
const year = Number(new Intl.DateTimeFormat('en', {
  timeZone: 'Asia/Karachi', year: 'numeric'
}).format(new Date()));
globalThis.fetch = async (url, options) => {
  if (String(url) !== 'https://api.github.com/graphql') {
    return originalFetch(url, options);
  }
  const body = JSON.parse(options.body);
  if (!body.query.includes('contributionsCollection {')) {
    throw new Error('Snake query changed; review calendar-year adapter.');
  }
  body.query = body.query.replace('contributionsCollection {',
    `contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {`);
  const response = await originalFetch(url, { ...options, body: JSON.stringify(body) });
  if (response.ok) {
    const result = await response.clone().json();
    if (result.errors) throw new Error(JSON.stringify(result.errors));
    const days = result.data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap(week => week.contributionDays);
    if (!days.length || days.some(day => !day.date.startsWith(`${year}-`))) {
      throw new Error('Contribution dates are outside the selected calendar year.');
    }
    console.log(`Verified calendar year ${year}: ${days[0].date} to ${days.at(-1).date}; ${days.reduce((sum, day) => sum + day.contributionCount, 0)} contributions.`);
  }
  return response;
};
