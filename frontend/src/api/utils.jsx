export function formatDate(dateString) {
    if (!dateString) return "No date";
  
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
  
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  }
  