export const abbreviateNumber = (num: number): string => {
    if (num === 0) return '0';

    const abbreviations = ['K', 'M', 'B', 'T']; // Thousand, Million, Billion, Trillion
    const sizes = [1000, 1000000, 1000000000, 1000000000000];
  
    if (num < 1000) {
      // For numbers smaller than 1000, no abbreviation is needed
      return num.toString();
    }
  
    let i = 0;
    while (num >= sizes[i] && i < sizes.length - 1) {
      i++;
    }
  
    // For larger numbers, format with at least 2 decimal places
    const abbreviatedNumber = (num / sizes[i]).toFixed(2);
    const formattedNumber = abbreviatedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
  
    return `${formattedNumber}${abbreviations[i - 1] || ''}`;
}