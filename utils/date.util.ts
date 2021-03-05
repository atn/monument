const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

const todayFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
});

const isToday = (someDate: Date) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}


export function formatDate(date: string) {
  const dateObj = new Date(date)
  if (isToday(dateObj)) return `Today at ${todayFormat.format(dateObj)}`
  return dateTimeFormat.format(dateObj)
}