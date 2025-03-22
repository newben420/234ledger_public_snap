export const SEODate = (customDate: string): string => {
    // console.log(customDate);
    // Match the custom format using a regex
    const dateRegex = /^(\w{3}), (\w{3}) (\d{1,2}) (\d{4}) (\d{1,2}):(\d{2}) (AM|PM)$/i;

    const months: { [key: string]: string } = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04",
        May: "05", Jun: "06", Jul: "07", Aug: "08",
        Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };

    const match = customDate.match(dateRegex);

    if (!match) {
        //   throw new Error("Invalid date format");
        return "";
    }

    // Extract parts of the custom date
    const [_, dayOfWeek, month, day, year, hour, minute, period] = match;

    // Convert month name to numeric value
    const monthNumber = months[month];

    if (!monthNumber) {
        //   throw new Error("Invalid month");
        return "";
    }

    // Convert hour to 24-hour format
    let hour24 = parseInt(hour, 10);
    if (period === "PM" && hour24 !== 12) {
        hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
        hour24 = 0;
    }

    // Format as YYYY-MM-DDTHH:mm:ss
    const formattedDate = `${year}-${monthNumber.padStart(2, "0")}-${day.padStart(2, "0")}T${hour24
        .toString()
        .padStart(2, "0")}:${minute.padStart(2, "0")}`;

    // console.log(formattedDate);

    return formattedDate;
}